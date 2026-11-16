import "server-only";
import { and, asc, desc, eq, inArray, notInArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import { departments, keyResults, objectives, performanceCycles, users } from "./schema";
import { objectiveReviewerId, setStatus, type ObjectiveStatus } from "@/lib/objectives";
import { tierSql } from "./tier";

const reviewer = alias(users, "objective_reviewer");
const head = alias(users, "objective_head");

export async function getCycles() {
  return db.select().from(performanceCycles).orderBy(desc(performanceCycles.startDate));
}

export type ObjectiveView = Awaited<ReturnType<typeof getObjectivesFor>>[number];

/** One person's objectives for a cycle, each with its key results. */
export async function getObjectivesFor(userId: string, cycleId: string) {
  const rows = await db
    .select({
      id: objectives.id,
      title: objectives.title,
      description: objectives.description,
      weight: objectives.weight,
      status: objectives.status,
      reviewerId: objectives.reviewerId,
      reviewerName: reviewer.name,
      submittedAt: objectives.submittedAt,
      reviewedAt: objectives.reviewedAt,
      reviewNote: objectives.reviewNote,
      createdAt: objectives.createdAt,
    })
    .from(objectives)
    .leftJoin(reviewer, eq(objectives.reviewerId, reviewer.id))
    .where(and(eq(objectives.userId, userId), eq(objectives.cycleId, cycleId)))
    .orderBy(asc(objectives.createdAt));

  const krs = rows.length
    ? await db
        .select()
        .from(keyResults)
        .where(inArray(keyResults.objectiveId, rows.map((row) => row.id)))
        .orderBy(asc(keyResults.position))
    : [];

  return rows.map((row) => ({ ...row, keyResults: krs.filter((kr) => kr.objectiveId === row.id) }));
}

/** Who the person's objectives go to, so they can be told before they submit. */
export async function getSupervisorFor(userId: string) {
  const [row] = await db
    .select({
      managerId: users.managerId,
      headId: departments.headId,
      headRole: tierSql(head),
      headName: head.name,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .leftJoin(head, eq(departments.headId, head.id))
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) return null;

  const headRef = row.headId && row.headRole ? { id: row.headId, role: row.headRole } : null;
  const id = objectiveReviewerId({ id: userId, managerId: row.managerId }, headRef);
  if (!id) return { id: null, name: null, isHead: false };
  const [person] = await db.select({ name: users.name }).from(users).where(eq(users.id, id)).limit(1);
  return { id, name: person?.name ?? null, isHead: id === row.headId };
}

export type TeamMember = Awaited<ReturnType<typeof getTeamObjectives>>[number];

/**
 * The people whose objectives `viewer` reviews, with where each set stands. Admins see everyone;
 * a supervisor sees the people they are the reviewer for.
 */
export async function getTeamObjectives(viewer: { id: string; isAdmin: boolean }, cycleId: string) {
  const people = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      jobTitle: users.jobTitle,
      managerId: users.managerId,
      departmentName: departments.name,
      headId: departments.headId,
      headRole: tierSql(head),
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .leftJoin(head, eq(departments.headId, head.id))
    .where(and(eq(users.role, "employee"), notInArray(users.status, ["alumni", "suspended"])))
    .orderBy(asc(users.name));

  const mine = people.filter((person) => {
    if (person.id === viewer.id) return false;
    if (viewer.isAdmin) return true;
    const headRef = person.headId && person.headRole ? { id: person.headId, role: person.headRole } : null;
    return objectiveReviewerId(person, headRef) === viewer.id;
  });

  const rows = mine.length
    ? await db
        .select()
        .from(objectives)
        .where(and(eq(objectives.cycleId, cycleId), inArray(objectives.userId, mine.map((person) => person.id))))
        .orderBy(asc(objectives.createdAt))
    : [];
  const krs = rows.length
    ? await db
        .select()
        .from(keyResults)
        .where(inArray(keyResults.objectiveId, rows.map((row) => row.id)))
        .orderBy(asc(keyResults.position))
    : [];

  return mine.map((person) => {
    const own = rows
      .filter((row) => row.userId === person.id)
      .map((row) => ({ ...row, keyResults: krs.filter((kr) => kr.objectiveId === row.id) }));
    return {
      id: person.id,
      name: person.name,
      avatarUrl: person.avatarUrl,
      jobTitle: person.jobTitle,
      department: person.departmentName,
      objectives: own,
      status: setStatus(own.map((objective) => objective.status as ObjectiveStatus)),
    };
  });
}
