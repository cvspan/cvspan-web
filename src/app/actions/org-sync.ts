import "server-only";
import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { getOrgPeople } from "@/db/queries-org";
import { departments, projectMembers, projects, users } from "@/db/schema";
import { planReportingLines, type OrgContext } from "@/lib/org";
import { atLeast, type Role } from "@/lib/roles";
import { notify } from "./guards";

/**
 * The latest project each member joined, and that project's manager. A member with no manager
 * of their own defaults to this person.
 */
async function projectManagersByMember() {
  const member = alias(projectMembers, "member");
  const manager = alias(projectMembers, "manager");

  const rows = await db
    .select({ memberId: member.userId, managerId: manager.userId })
    .from(member)
    .innerJoin(manager, and(eq(manager.projectId, member.projectId), eq(manager.role, "lead"), ne(manager.userId, member.userId)))
    .innerJoin(projects, eq(projects.id, member.projectId))
    .where(and(ne(projects.status, "live"), ne(projects.status, "cancelled")))
    .orderBy(desc(member.createdAt));

  const result = new Map<string, string>();
  for (const row of rows) if (!result.has(row.memberId)) result.set(row.memberId, row.managerId);
  return result;
}

/**
 * Brings every reporting line into line with the rules: heads report to the CEO, managers to
 * their department's head, and a member with no manager gets their project manager or
 * department head. Safe to call after anything that could move someone; when nothing needs
 * changing it writes nothing. Returns how many lines changed.
 */
export async function reconcileOrg() {
  const [people, heads, projectManagers] = await Promise.all([
    getOrgPeople(),
    db
      .select({ id: departments.id, headId: departments.headId })
      .from(departments)
      .where(isNotNull(departments.headId)),
    projectManagersByMember(),
  ]);

  const context: OrgContext = {
    ceoId: people.find((person) => person.orgLevel === "ceo")?.id ?? null,
    departmentHeads: new Map(heads.map((row) => [row.id, row.headId!])),
  };

  const changes = planReportingLines(people, context, projectManagers);
  if (changes.length === 0) return 0;

  const [first, ...rest] = changes.map((change) =>
    db.update(users).set({ managerId: change.managerId }).where(eq(users.id, change.id)),
  );
  await db.batch([first, ...rest]);

  const names = new Map(people.map((person) => [person.id, person.name]));
  await Promise.all(
    changes.map((change) =>
      notify(
        change.id,
        change.managerId
          ? `You now report to ${names.get(change.managerId) ?? "your manager"}`
          : "You no longer have a reporting line",
        "/org",
        "organisation",
      ),
    ),
  );
  return changes.length;
}

export type AccessResult =
  | { ok: true; promoted: boolean; name: string }
  | { ok: false; error: string };

/**
 * Makes sure someone has manager access, which running people or a project requires. A member
 * is promoted to Manager, but only when an admin is the one asking: otherwise a project manager
 * could hand out access. Anyone already a manager or above is left as they are.
 */
export async function ensureManagerAccess(userId: string, actorRole: Role): Promise<AccessResult> {
  const [person] = await db
    .select({ name: users.name, role: users.role, orgLevel: users.orgLevel })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!person) return { ok: false, error: "That person no longer exists." };

  if (atLeast(person.role, "manager")) return { ok: true, promoted: false, name: person.name };

  if (!atLeast(actorRole, "admin")) {
    return {
      ok: false,
      error: `${person.name} is a member. Only an admin can make a member a manager, and so a project manager.`,
    };
  }

  await db
    .update(users)
    .set({ role: "manager", orgLevel: person.orgLevel === "member" ? "manager" : person.orgLevel })
    .where(eq(users.id, userId));
  await notify(userId, "You are now a Manager", "/org", "organisation");
  return { ok: true, promoted: true, name: person.name };
}


/** What to refresh after anything that moves people around the organisation. */
export function refreshOrg() {
  revalidatePath("/org");
  revalidatePath("/people");
  revalidatePath("/team");
  revalidatePath("/reviews");
  revalidatePath("/departments");
  revalidatePath("/");
}
