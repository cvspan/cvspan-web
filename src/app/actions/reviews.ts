"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { departments, reviewRatings, users, weeklyReviews } from "@/db/schema";
import { companyDay } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import {
  CRITERIA,
  averageRating,
  canReview,
  criterionKeys,
  isReviewableWeek,
} from "@/lib/grading";
import { requireUser } from "@/lib/session";
import {
  fail,
  ok,
  optionalText,
  parseForm,
  requiredId,
  type ActionResult,
} from "@/lib/validation";
import { logActivity, notify } from "./guards";

/** One required 1–5 field per criterion, named `rating_<key>`. */
const ratingFields = Object.fromEntries(
  CRITERIA.map((criterion) => [
    `rating_${criterion.key}`,
    z.coerce
      .number(`Rate ${criterion.name.toLowerCase()}`)
      .int(`Rate ${criterion.name.toLowerCase()}`)
      .min(1, `Rate ${criterion.name.toLowerCase()}`)
      .max(5, `Rate ${criterion.name.toLowerCase()}`),
  ]),
) as Record<`rating_${(typeof criterionKeys)[number]}`, z.ZodCoercedNumber>;

const reviewSchema = z.object({
  userId: requiredId("person"),
  weekStart: z.iso.date("Choose a valid week"),
  comment: optionalText("Comment", 1000),
  ...ratingFields,
});

/**
 * Saves a weekly review (or replaces this week's, if one exists). The reviewer is checked here,
 * on the server: the designated reviewer or an admin may grade, never the person themselves.
 */
export async function submitWeeklyReview(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();

  const parsed = parseForm(reviewSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, weekStart, comment } = parsed.data;

  const [subject] = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      managerId: users.managerId,
      startDate: users.startDate,
      departmentHeadId: departments.headId,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .where(eq(users.id, userId))
    .limit(1);
  if (!subject) return fail("That person no longer exists.");

  if (!canReview({ id: actor.id, role: actor.role }, subject, subject.departmentHeadId)) {
    return fail(`You are not ${subject.name}'s reviewer.`);
  }
  if (!isReviewableWeek(weekStart, companyDay(), subject.startDate)) {
    return fail("That week can't be graded yet, or is from before they started.");
  }

  const ratings = criterionKeys.map((key) => ({
    criterion: key,
    rating: parsed.data[`rating_${key}`] as number,
  }));

  const [existing] = await db
    .select({ id: weeklyReviews.id })
    .from(weeklyReviews)
    .where(and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStart, weekStart)))
    .limit(1);
  const reviewId = existing?.id ?? crypto.randomUUID();

  /** One atomic batch: the review and its ratings are replaced together or not at all. */
  await db.batch([
    existing
      ? db
          .update(weeklyReviews)
          .set({ reviewerId: actor.id, comment, updatedAt: new Date() })
          .where(eq(weeklyReviews.id, reviewId))
      : db.insert(weeklyReviews).values({
          id: reviewId,
          userId,
          reviewerId: actor.id,
          weekStart,
          comment,
        }),
    db.delete(reviewRatings).where(eq(reviewRatings.reviewId, reviewId)),
    db.insert(reviewRatings).values(ratings.map((entry) => ({ reviewId, ...entry }))),
  ]);

  const average = (averageRating(ratings.map((entry) => entry.rating)) ?? 0).toFixed(1);
  await notify(
    userId,
    `${actor.name} ${existing ? "updated" : "posted"} your review for the week of ${formatDay(weekStart)}: ${average}/5`,
    `/reviews?week=${weekStart}`,
  );
  await logActivity(actor.id, "graded a week", `${subject.name} · ${average}/5`);

  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath(`/people/${userId}`);
  return ok;
}
