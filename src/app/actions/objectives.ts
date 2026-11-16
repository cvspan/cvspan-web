"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { getSupervisorFor } from "@/db/queries-objectives";
import { departments, keyResults, objectives, performanceCycles, users } from "@/db/schema";
import { tierSql } from "@/db/tier";
import { companyDay } from "@/lib/dates";
import {
  MAX_KEY_RESULTS,
  TOTAL_WEIGHT,
  canReviewObjectives,
  isEditable,
  submissionProblem,
  type ObjectiveStatus,
} from "@/lib/objectives";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { fail, ok, optionalDate, optionalText, parseForm, requiredId, requiredText, type ActionResult } from "@/lib/validation";
import { logActivity, notify, requireRole } from "./guards";

function refresh() {
  revalidatePath("/performance");
  revalidatePath("/performance/team");
  revalidatePath("/");
}

async function openCycle(cycleId: string) {
  const [cycle] = await db.select().from(performanceCycles).where(eq(performanceCycles.id, cycleId)).limit(1);
  if (!cycle) return { ok: false as const, error: "That cycle no longer exists." };
  if (cycle.endDate < companyDay()) return { ok: false as const, error: `${cycle.name} has ended, so its objectives can't be changed.` };
  return { ok: true as const, cycle };
}

const objectiveSchema = z.object({
  id: optionalText("Objective", 60),
  cycleId: requiredId("cycle"),
  title: requiredText("Objective", 160),
  description: optionalText("Description", 1000),
  weight: z.coerce.number("Enter a weight").int("Weight must be a whole number").min(1, "Weight must be at least 1%").max(100, "Weight can't be more than 100%"),
});

/** Reads the repeated key-result fields of the form. A row with no title is ignored. */
function readKeyResults(formData: FormData) {
  const titles = formData.getAll("kr_title").map(String);
  const targets = formData.getAll("kr_target").map(String);
  const units = formData.getAll("kr_unit").map(String);
  const rows: { title: string; target: number; unit: string | null }[] = [];
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].trim();
    if (!title) continue;
    const target = Number(targets[i]);
    if (!Number.isInteger(target) || target < 1) return { error: `“${title}” needs a target of 1 or more.` };
    rows.push({ title: title.slice(0, 160), target, unit: units[i]?.trim().slice(0, 40) || null });
  }
  if (rows.length === 0) return { error: "Add at least one key result: how you will know it's done." };
  if (rows.length > MAX_KEY_RESULTS) return { error: `An objective can have up to ${MAX_KEY_RESULTS} key results.` };
  return { rows };
}

/** Creates or updates one of your own objectives while it is still a draft or was sent back. */
export async function saveObjective(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = parseForm(objectiveSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { id, cycleId, title, description, weight } = parsed.data;

  const krs = readKeyResults(formData);
  if ("error" in krs) return fail(krs.error!);

  const cycle = await openCycle(cycleId);
  if (!cycle.ok) return fail(cycle.error);

  const mine = await db
    .select({ id: objectives.id, weight: objectives.weight, status: objectives.status })
    .from(objectives)
    .where(and(eq(objectives.userId, user.id), eq(objectives.cycleId, cycleId)));

  const existing = id ? mine.find((row) => row.id === id) : undefined;
  if (id && !existing) return fail("That objective no longer exists.");
  if (existing && !isEditable(existing.status as ObjectiveStatus)) {
    return fail("This objective is awaiting review or approved. Withdraw it first to change it.");
  }

  const others = mine.filter((row) => row.id !== id).reduce((sum, row) => sum + row.weight, 0);
  if (others + weight > TOTAL_WEIGHT) {
    return fail(`Your other objectives already use ${others}%. This one can be at most ${TOTAL_WEIGHT - others}%.`);
  }

  let objectiveId = id;
  if (existing && objectiveId) {
    await db
      .update(objectives)
      .set({ title, description, weight, updatedAt: new Date() })
      .where(eq(objectives.id, objectiveId));
    await db.delete(keyResults).where(eq(keyResults.objectiveId, objectiveId));
  } else {
    const [created] = await db
      .insert(objectives)
      .values({ cycleId, userId: user.id, title, description, weight })
      .returning({ id: objectives.id });
    objectiveId = created.id;
  }

  await db.insert(keyResults).values(krs.rows.map((row, position) => ({ ...row, objectiveId: objectiveId!, position })));

  refresh();
  return ok;
}

export async function deleteObjective(objectiveId: string): Promise<ActionResult> {
  const user = await requireUser();
  const [row] = await db
    .select({ status: objectives.status })
    .from(objectives)
    .where(and(eq(objectives.id, objectiveId), eq(objectives.userId, user.id)))
    .limit(1);
  if (!row) return fail("That objective no longer exists.");
  if (!isEditable(row.status as ObjectiveStatus)) return fail("Withdraw it from review before deleting it.");
  await db.delete(objectives).where(eq(objectives.id, objectiveId));
  refresh();
  return ok;
}

/** Sends your whole set for the cycle to your supervisor. Weights must total 100% and each objective needs key results. */
export async function submitObjectives(cycleId: string): Promise<ActionResult> {
  const user = await requireUser();

  const cycle = await openCycle(cycleId);
  if (!cycle.ok) return fail(cycle.error);

  const mine = await db
    .select({ id: objectives.id, title: objectives.title, weight: objectives.weight, status: objectives.status })
    .from(objectives)
    .where(and(eq(objectives.userId, user.id), eq(objectives.cycleId, cycleId)));
  const counts = mine.length
    ? await db
        .select({ objectiveId: keyResults.objectiveId, n: sql<number>`count(*)::int` })
        .from(keyResults)
        .where(inArray(keyResults.objectiveId, mine.map((row) => row.id)))
        .groupBy(keyResults.objectiveId)
    : [];

  const problem = submissionProblem(
    mine.map((row) => ({ title: row.title, weight: row.weight, keyResultCount: counts.find((c) => c.objectiveId === row.id)?.n ?? 0 })),
  );
  if (problem) return fail(problem);

  const toSend = mine.filter((row) => isEditable(row.status as ObjectiveStatus));
  if (toSend.length === 0) return fail("There is nothing new to send.");

  const supervisor = await getSupervisorFor(user.id);
  /** Someone with no supervisor and no one above them (the top of the company) has no one to ask. */
  const selfApprove = !supervisor?.id && user.role === "super_admin";
  const now = new Date();

  await db
    .update(objectives)
    .set(
      selfApprove
        ? { status: "approved", reviewerId: null, submittedAt: now, reviewedAt: now, reviewNote: null, updatedAt: now }
        : { status: "submitted", reviewerId: supervisor?.id ?? null, submittedAt: now, reviewNote: null, updatedAt: now },
    )
    .where(inArray(objectives.id, toSend.map((row) => row.id)));

  if (!selfApprove) {
    const message = `${user.name} submitted their ${cycle.cycle.name} objectives for review`;
    if (supervisor?.id) {
      await notify(supervisor.id, message, "/performance/team", "objectives");
    } else {
      const people = await db.select({ id: users.id, role: tierSql() }).from(users);
      for (const person of people.filter((candidate) => atLeast(candidate.role, "hr") && candidate.id !== user.id)) {
        await notify(person.id, message, "/performance/team", "objectives");
      }
    }
  }
  await logActivity(user.id, "submitted objectives", cycle.cycle.name);

  refresh();
  return ok;
}

/** Takes your submitted objectives back to draft, to change them before they are reviewed. */
export async function withdrawObjectives(cycleId: string): Promise<ActionResult> {
  const user = await requireUser();
  await db
    .update(objectives)
    .set({ status: "draft", submittedAt: null, updatedAt: new Date() })
    .where(and(eq(objectives.userId, user.id), eq(objectives.cycleId, cycleId), eq(objectives.status, "submitted")));
  refresh();
  return ok;
}

const reviewSchema = z.object({
  userId: requiredId("person"),
  cycleId: requiredId("cycle"),
  decision: z.enum(["approve", "changes"], "Choose a decision"),
  note: optionalText("Note", 1000),
});

/** The supervisor's decision on someone's submitted set: approve it, or send it back with what to change. */
export async function reviewObjectives(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("manager");

  const parsed = parseForm(reviewSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, cycleId, decision, note } = parsed.data;
  if (decision === "changes" && !note) return fail("Say what needs to change, so they know what to fix.");

  const [subject] = await db
    .select({
      id: users.id,
      name: users.name,
      managerId: users.managerId,
      headId: departments.headId,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .where(eq(users.id, userId))
    .limit(1);
  if (!subject) return fail("That person no longer exists.");

  const headRow = subject.headId
    ? (await db.select({ id: users.id, role: tierSql() }).from(users).where(eq(users.id, subject.headId)).limit(1))[0]
    : undefined;
  if (!canReviewObjectives(actor, subject, headRow ?? null)) return fail("You are not this person's supervisor.");

  const submitted = await db
    .select({ id: objectives.id })
    .from(objectives)
    .where(and(eq(objectives.userId, userId), eq(objectives.cycleId, cycleId), eq(objectives.status, "submitted")));
  if (submitted.length === 0) return fail("Nothing from them is waiting for review.");

  const now = new Date();
  await db
    .update(objectives)
    .set({
      status: decision === "approve" ? "approved" : "changes_requested",
      reviewedById: actor.id,
      reviewedAt: now,
      reviewNote: note,
      updatedAt: now,
    })
    .where(inArray(objectives.id, submitted.map((row) => row.id)));

  await notify(
    userId,
    decision === "approve"
      ? `${actor.name} approved your objectives`
      : `${actor.name} asked for changes to your objectives`,
    "/performance",
    "objectives",
  );
  await logActivity(actor.id, decision === "approve" ? "approved objectives" : "requested changes to objectives", subject.name);

  refresh();
  return ok;
}

/** Updates how far a key result has got. Only on approved objectives, and only your own. */
export async function updateKeyResultProgress(keyResultId: string, current: number): Promise<ActionResult> {
  const user = await requireUser();
  if (!Number.isInteger(current) || current < 0 || current > 1_000_000_000) return fail("Enter a whole number, 0 or more.");

  const [row] = await db
    .select({ id: keyResults.id, status: objectives.status, ownerId: objectives.userId })
    .from(keyResults)
    .innerJoin(objectives, eq(keyResults.objectiveId, objectives.id))
    .where(eq(keyResults.id, keyResultId))
    .limit(1);
  if (!row || row.ownerId !== user.id) return fail("That key result no longer exists.");
  if (row.status !== "approved") return fail("Progress can be updated once your supervisor approves the objective.");

  await db.update(keyResults).set({ current }).where(eq(keyResults.id, keyResultId));
  revalidatePath("/performance");
  revalidatePath("/performance/team");
  revalidatePath("/");
  return ok;
}

const cycleSchema = z.object({
  name: requiredText("Cycle name", 80),
  startDate: optionalDate("Start date"),
  endDate: optionalDate("End date"),
});

export async function createCycle(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");
  const parsed = parseForm(cycleSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { name, startDate, endDate } = parsed.data;
  if (!startDate || !endDate) return fail("Choose a start and an end date.");
  if (endDate <= startDate) return fail("The end date must be after the start date.");

  await db.insert(performanceCycles).values({ name, startDate, endDate });
  await logActivity(actor.id, "created a performance cycle", name);
  refresh();
  return ok;
}
