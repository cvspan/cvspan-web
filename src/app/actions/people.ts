"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { departments, users } from "@/db/schema";
import { ROLES, roleLabels, type Role } from "@/lib/roles";
import { z } from "zod";
import { logActivity, requireRole } from "./guards";
import { reconcileOrg, refreshOrg } from "./org-sync";
import type { EmploymentType } from "@/lib/format";
import { defaultInternshipEnd } from "@/lib/grading";
import { defaultLevelForRole } from "@/lib/org";
import {
  datesInOrder,
  fail,
  ok,
  optionalDate,
  parseForm,
  requiredId,
  type ActionResult,
} from "@/lib/validation";

export async function inviteMember(formData: FormData) {
  const user = await requireRole("admin");

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !name) return;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return;

  const departmentName = String(formData.get("department") ?? "");
  const [department] = departmentName
    ? await db.select().from(departments).where(eq(departments.name, departmentName)).limit(1)
    : [];

  const inviteRole = (String(formData.get("role") ?? "member") as Role) ?? "member";
  const employmentType = String(formData.get("employmentType") ?? "full_time") as EmploymentType;
  const startDate = String(formData.get("startDate") ?? "") || null;

  /** Internships run for six months unless an end date is given. */
  const endDate =
    String(formData.get("endDate") ?? "") ||
    (employmentType === "internship" && startDate ? defaultInternshipEnd(startDate) : null);

  await db.insert(users).values({
    email,
    name,
    jobTitle: String(formData.get("jobTitle") ?? "").trim() || null,
    role: inviteRole,
    orgLevel: defaultLevelForRole(inviteRole),
    employmentType,
    status: "invited",
    departmentId: department?.id ?? null,
    managerId: String(formData.get("managerId") ?? "") || null,
    startDate,
    endDate,
  });

  await logActivity(user.id, "invited a new member", name);
  /** A new member with no manager reports to their department head. */
  await reconcileOrg();
  refreshOrg();
  revalidatePath("/people");
  revalidatePath("/");
}

const accessSchema = z.object({
  userId: requiredId("person"),
  role: z.enum(ROLES, "Choose a role"),
  status: z.enum(["active", "suspended", "alumni"], "Choose a status"),
});

/**
 * Changes someone's access role and whether they can sign in. Admins can suspend people or move
 * them to alumni; only a super admin can change a role. Two safeguards keep the portal reachable:
 * nobody changes their own access, and the last active super admin can't be demoted or suspended.
 */
export async function updateAccess(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(accessSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, role, status } = parsed.data;

  if (userId === actor.id) return fail("You can't change your own access. Ask another admin.");

  const [target] = await db
    .select({ name: users.name, role: users.role, status: users.status, orgLevel: users.orgLevel })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) return fail("That person no longer exists.");

  const roleChanged = role !== target.role;
  /** "invited" isn't something an admin sets, so leaving it alone counts as unchanged. */
  const statusChanged = status !== target.status && !(target.status === "invited" && status === "active");

  if (!roleChanged && !statusChanged) return fail("Nothing to change.");
  if (roleChanged && actor.role !== "super_admin") return fail("Only a super admin can change someone's role.");

  /** Would this leave the portal without an active super admin? */
  const losesSuperAdmin =
    target.role === "super_admin" && ((roleChanged && role !== "super_admin") || (statusChanged && status !== "active"));
  if (losesSuperAdmin) {
    const [others] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(users)
      .where(and(eq(users.role, "super_admin"), eq(users.status, "active"), ne(users.id, userId)));
    if (!others || others.n === 0) return fail("There has to be at least one active super admin.");
  }

  /** The org level follows the new access role, except for the CEO, who is chosen on the org chart. */
  await db
    .update(users)
    .set({
      ...(roleChanged ? { role, ...(target.orgLevel === "ceo" ? {} : { orgLevel: defaultLevelForRole(role) }) } : {}),
      ...(statusChanged ? { status } : {}),
    })
    .where(eq(users.id, userId));

  await logActivity(
    actor.id,
    [roleChanged ? `changed a role to ${roleLabels[role]}` : null, statusChanged ? `set a member to ${status}` : null]
      .filter(Boolean)
      .join(" and "),
    target.name,
  );

  await reconcileOrg();
  refreshOrg();
  revalidatePath("/people");
  revalidatePath(`/people/${userId}`);
  revalidatePath("/roles");
  return ok;
}

/** Start and end dates drive an intern's countdown, so an admin can correct or extend them. */
export async function updateMemberDates(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(
    z
      .object({
        userId: requiredId("person"),
        startDate: optionalDate("Start date"),
        endDate: optionalDate("End date"),
      })
      .refine((data) => datesInOrder(data.startDate, data.endDate), {
        message: "The end date can't be before the start date.",
        path: ["endDate"],
      }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { userId, startDate, endDate } = parsed.data;

  const [person] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);
  if (!person) return fail("That person no longer exists.");

  await db.update(users).set({ startDate, endDate }).where(eq(users.id, userId));

  await logActivity(actor.id, "updated a member's dates", person.name);
  revalidatePath(`/people/${userId}`);
  revalidatePath("/people");
  revalidatePath("/reviews");
  revalidatePath("/");
  return ok;
}
