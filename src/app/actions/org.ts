"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { getOrgPeople } from "@/db/queries-org";
import { users } from "@/db/schema";
import { levelLabels, orgLevels, validatePosition } from "@/lib/org";
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

const positionSchema = z.object({
  userId: requiredId("person"),
  orgLevel: z.enum(orgLevels, "Choose a level"),
  managerId: optionalId("manager"),
  jobTitle: optionalText("Job title", 80),
});

/**
 * Sets where someone sits: their level, who they report to, and their title. Admins only.
 * The reporting line also decides who grades them, who approves their leave and whose team
 * page they appear on, so the people involved are told when it changes.
 */
export async function updatePosition(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(positionSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, orgLevel, jobTitle } = parsed.data;

  /** The CEO reports to no one, whatever was submitted. */
  const managerId = orgLevel === "ceo" ? null : parsed.data.managerId;

  const people = await getOrgPeople();
  const subject = people.find((person) => person.id === userId);
  if (!subject) return fail("That person no longer exists.");

  const problem = validatePosition({ subjectId: userId, level: orgLevel, managerId }, people);
  if (problem) return fail(problem);

  try {
    await db.update(users).set({ orgLevel, managerId, jobTitle }).where(eq(users.id, userId));
  } catch (error) {
    /** Two admins making different people CEO at once: the database allows only one. */
    if (isUniqueViolation(error)) return fail("Someone else was just made CEO. Refresh and try again.");
    throw error;
  }

  if (managerId !== subject.managerId) {
    const manager = managerId ? people.find((person) => person.id === managerId) : null;
    await notify(
      userId,
      manager ? `You now report to ${manager.name}` : "You no longer have a reporting line",
      "/org",
    );
    if (manager && manager.id !== actor.id) {
      await notify(manager.id, `${subject.name} now reports to you`, "/org");
    }
  }

  await logActivity(actor.id, "updated the org chart", `${subject.name} · ${levelLabels[orgLevel]}`);

  revalidatePath("/org");
  revalidatePath("/people");
  revalidatePath("/team");
  revalidatePath("/reviews");
  revalidatePath("/");
  return ok;
}
