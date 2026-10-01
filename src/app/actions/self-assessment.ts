"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { selfAssessments, users } from "@/db/schema";
import { companyDay } from "@/lib/dates";
import { requireUser } from "@/lib/session";
import { fail, ok, optionalText, parseForm, type ActionResult } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { logActivity, notify } from "./guards";

const schema = z.object({
  score: z.coerce
    .number("Enter a score from 0 to 100")
    .int("Enter a whole number")
    .min(0, "The score can't be below 0")
    .max(100, "The score can't be above 100"),
  comment: optionalText("Notes", 1000),
});

/**
 * Saves how someone thinks the month went. One per person per month, so saving again updates
 * it. Their manager is told, and sees it on their profile when grading.
 */
export async function saveSelfAssessment(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = parseForm(schema, formData);
  if (!parsed.success) return fail(parsed.error);

  /** The first of the current month in company time, matching how KPI cycles are keyed. */
  const periodStart = `${companyDay().slice(0, 7)}-01`;

  await db
    .insert(selfAssessments)
    .values({ userId: user.id, periodStart, ...parsed.data })
    .onConflictDoUpdate({
      target: [selfAssessments.userId, selfAssessments.periodStart],
      set: { ...parsed.data, updatedAt: new Date() },
    });

  const [account] = await db
    .select({ managerId: users.managerId })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  if (account?.managerId) {
    await notify(account.managerId, `${user.name} shared their self-assessment: ${parsed.data.score}%`, `/people/${user.id}`, "grades");
  }
  await logActivity(user.id, "submitted a self-assessment", `${parsed.data.score}%`);

  revalidatePath("/kpis");
  revalidatePath(`/people/${user.id}`);
  return ok;
}
