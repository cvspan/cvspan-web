"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { getOrgPeople } from "@/db/queries-org";
import { departments, users } from "@/db/schema";
import { automaticManagerId, levelLabels, positionLevels, validatePosition, type OrgContext } from "@/lib/org";
import {
  fail,
  ok,
  optionalId,
  optionalText,
  parseForm,
  requiredId,
  type ActionResult,
} from "@/lib/validation";
import { isUniqueViolation, logActivity, notify, requireRole } from "./guards";
import { ensureManagerAccess, reconcileOrg, refreshOrg } from "./org-sync";

const positionSchema = z.object({
  userId: requiredId("person"),
  level: z.enum(positionLevels, "Choose a level"),
  managerId: optionalId("manager"),
  jobTitle: optionalText("Job title", 80),
});

/**
 * Sets someone's level, and, where it is theirs to choose, who they report to. Admins only.
 *   - Department head: they head the department they are in (replacing its current head) and
 *     report to the CEO. A member who becomes a head gets manager access.
 *   - Manager: reports to their department's head, or to whoever is chosen when it has none.
 *   - Member: reports to whoever is chosen.
 *   - CEO: reports to no one, and the heads report to them.
 * The reporting line also decides who grades them and who approves their leave, so the people
 * involved are told when it changes.
 */
export async function updatePosition(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(positionSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, level, jobTitle } = parsed.data;

  const people = await getOrgPeople();
  const subject = people.find((person) => person.id === userId);
  if (!subject) return fail("That person no longer exists.");

  const departmentHeads = await db
    .select({ id: departments.id, headId: departments.headId })
    .from(departments);
  const context: OrgContext = {
    ceoId: people.find((person) => person.orgLevel === "ceo")?.id ?? null,
    departmentHeads: new Map(departmentHeads.flatMap((row) => (row.headId ? [[row.id, row.headId] as [string, string]] : []))),
  };

  /** Heads and managers under a head are placed by the structure; only the rest are chosen. */
  const automatic = automaticManagerId(subject, level, context) !== undefined;
  const chosenManager = automatic ? null : parsed.data.managerId;

  const problem = validatePosition({ subjectId: userId, level, managerId: chosenManager }, people);
  if (problem) return fail(problem);

  /** Running people needs manager access, so a member made a head or manager gets it. */
  let promoted = false;
  if (level === "head" || level === "manager") {
    const access = await ensureManagerAccess(userId, actor.role);
    if (!access.ok) return fail(access.error);
    promoted = access.promoted;
  }

  const storedLevel = level === "ceo" ? "ceo" : level === "member" ? "member" : "manager";
  const headsNow = subject.headOf.length > 0;

  try {
    await db
      .update(users)
      .set({
        orgLevel: storedLevel,
        jobTitle,
        ...(automatic ? {} : { managerId: chosenManager }),
      })
      .where(eq(users.id, userId));

    if (level === "head" && subject.departmentId) {
      await db.update(departments).set({ headId: userId, updatedAt: new Date() }).where(eq(departments.id, subject.departmentId));
    } else if (headsNow && level !== "head") {
      /** Moving a head to another level means they stop heading their department. */
      await db.update(departments).set({ headId: null, updatedAt: new Date() }).where(eq(departments.headId, userId));
    }
  } catch (error) {
    /** Two admins making different people CEO at once: the database allows only one. */
    if (isUniqueViolation(error)) return fail("Someone else was just made CEO. Refresh and try again.");
    throw error;
  }

  await reconcileOrg();

  const before = subject.headOf.length > 0 ? "head" : subject.orgLevel;
  /** A promotion already sent its own message. */
  if (before !== level && !(promoted && level === "manager")) {
    await notify(
      userId,
      level === "head" ? `You are now Head of ${subject.departmentName}` : `You are now ${levelLabels[level]}`,
      "/org",
    );
  }
  await logActivity(actor.id, "updated the org chart", `${subject.name} · ${levelLabels[level]}`);

  refreshOrg();
  return ok;
}
