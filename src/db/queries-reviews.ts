import "server-only";
import { and, asc, desc, eq, gte, inArray, lte, notInArray, sql } from "drizzle-orm";
import { db } from "./index";
import {
  attendance,
  departments,
  portalActivity,
  reviewRatings,
  tasks,
  users,
  weeklyReviews,
} from "./schema";
import { addDays } from "@/lib/dates";
import {
  type CriterionKey,
  type WeekEvidence,
  averageRating,
  defaultReviewWeek,
  isReviewableWeek,
  headsDepartmentOf,
  reviewerIdFor,
} from "@/lib/grading";
import { alias } from "drizzle-orm/pg-core";
import { atLeast, type Role } from "@/lib/roles";

const reviewer = alias(users, "reviewer");
const departmentHead = alias(users, "department_head");

export type ReviewRow = {
  id: string;
  userId: string;
  weekStart: string;
  comment: string | null;
  reviewerId: string | null;
  reviewerName: string | null;
  updatedAt: Date;
  ratings: Partial<Record<CriterionKey, number>>;
  average: number | null;
};

async function withRatings(
  rows: Omit<ReviewRow, "ratings" | "average">[],
): Promise<ReviewRow[]> {
  if (rows.length === 0) return [];

  const ratings = await db
    .select()
    .from(reviewRatings)
    .where(inArray(reviewRatings.reviewId, rows.map((row) => row.id)));

  return rows.map((row) => {
    const own = ratings.filter((rating) => rating.reviewId === row.id);
    return {
      ...row,
      ratings: Object.fromEntries(own.map((rating) => [rating.criterion, rating.rating])),
      average: averageRating(own.map((rating) => rating.rating)),
    };
  });
}

const reviewColumns = {
  id: weeklyReviews.id,
  userId: weeklyReviews.userId,
  weekStart: weeklyReviews.weekStart,
  comment: weeklyReviews.comment,
  reviewerId: weeklyReviews.reviewerId,
  reviewerName: reviewer.name,
  updatedAt: weeklyReviews.updatedAt,
};

/** One person's reviews, newest week first. */
export async function getReviewsForUser(userId: string, limit = 26) {
  const rows = await db
    .select(reviewColumns)
    .from(weeklyReviews)
    .leftJoin(reviewer, eq(reviewer.id, weeklyReviews.reviewerId))
    .where(eq(weeklyReviews.userId, userId))
    .orderBy(desc(weeklyReviews.weekStart))
    .limit(limit);
  return withRatings(rows);
}

/** Reviews for a set of people across a window of weeks. */
export async function getReviewsForPeople(userIds: string[], fromWeek: string, toWeek: string) {
  if (userIds.length === 0) return [];
  const rows = await db
    .select(reviewColumns)
    .from(weeklyReviews)
    .leftJoin(reviewer, eq(reviewer.id, weeklyReviews.reviewerId))
    .where(
      and(
        inArray(weeklyReviews.userId, userIds),
        gte(weeklyReviews.weekStart, fromWeek),
        lte(weeklyReviews.weekStart, toWeek),
      ),
    );
  return withRatings(rows);
}

/** Everyone who takes part in the weekly cycle, with what is needed to decide who grades them. */
export async function getGradablePeople() {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      jobTitle: users.jobTitle,
      role: users.role,
      employmentType: users.employmentType,
      managerId: users.managerId,
      departmentId: users.departmentId,
      departmentName: departments.name,
      headId: departments.headId,
      headRole: departmentHead.role,
      startDate: users.startDate,
      endDate: users.endDate,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .leftJoin(departmentHead, eq(departments.headId, departmentHead.id))
    .where(
      and(
        inArray(users.role, ["member", "manager"]),
        notInArray(users.status, ["alumni", "suspended"]),
      ),
    )
    .orderBy(asc(users.name));

  return rows.map(({ headId, headRole, ...person }) => ({
    ...person,
    head: headId && headRole ? { id: headId, role: headRole } : null,
  }));
}

export type Evidence = WeekEvidence;

const emptyEvidence: Evidence = {
  loginDays: 0,
  presentDays: 0,
  leaveDays: 0,
  tasksDue: 0,
  tasksDone: 0,
  tasksOverdue: 0,
};

/**
 * What the portal recorded for each person in a week (Monday to Friday for days, the whole
 * week for task deadlines). Counted in the database, one row per person.
 */
export async function getWeekEvidence(userIds: string[], weekStart: string) {
  const evidence = new Map<string, Evidence>();
  if (userIds.length === 0) return evidence;

  const friday = addDays(weekStart, 4);
  const nextMonday = addDays(weekStart, 7);

  const rows = await db
    .select({
      id: users.id,
      loginDays: sql<number>`(select count(*)::int from ${portalActivity} where ${portalActivity.userId} = ${users.id} and ${portalActivity.day} between ${weekStart} and ${friday})`,
      presentDays: sql<number>`(select count(*)::int from ${attendance} where ${attendance.userId} = ${users.id} and ${attendance.day} between ${weekStart} and ${friday} and ${attendance.kind} in ('on_site', 'remote'))`,
      leaveDays: sql<number>`(select count(*)::int from ${attendance} where ${attendance.userId} = ${users.id} and ${attendance.day} between ${weekStart} and ${friday} and ${attendance.kind} = 'leave')`,
      tasksDue: sql<number>`(select count(*)::int from ${tasks} where ${tasks.assigneeId} = ${users.id} and ${tasks.dueAt} >= ${weekStart}::date and ${tasks.dueAt} < ${nextMonday}::date)`,
      tasksDone: sql<number>`(select count(*)::int from ${tasks} where ${tasks.assigneeId} = ${users.id} and ${tasks.dueAt} >= ${weekStart}::date and ${tasks.dueAt} < ${nextMonday}::date and ${tasks.status} = 'done')`,
      tasksOverdue: sql<number>`(select count(*)::int from ${tasks} where ${tasks.assigneeId} = ${users.id} and ${tasks.dueAt} >= ${weekStart}::date and ${tasks.dueAt} < ${nextMonday}::date and ${tasks.status} <> 'done' and ${tasks.dueAt} < now())`,
    })
    .from(users)
    .where(inArray(users.id, userIds));

  for (const row of rows) evidence.set(row.id, { ...emptyEvidence, ...row });
  return evidence;
}

/**
 * The first day any login was recorded. Weeks before it have no login data, so the portal
 * suggests nothing for them rather than rating people on a gap in tracking.
 */
export async function getLoginTrackingStart() {
  const [row] = await db
    .select({ day: sql<string | null>`min(${portalActivity.day})::text` })
    .from(portalActivity);
  return row?.day ?? null;
}

/**
 * The people one person can review: those they are the usual reviewer for, and, for a department
 * head, everyone in that department. Members never review anyone, whatever their reporting
 * lines say.
 */
export async function getSubjectsFor(reviewer: { id: string; role: Role }) {
  if (!atLeast(reviewer.role, "manager")) return [];

  const people = await getGradablePeople();
  return people.filter(
    (person) =>
      person.id !== reviewer.id &&
      (reviewerIdFor(person, person.head) === reviewer.id || headsDepartmentOf(reviewer, person, person.head)),
  );
}

/**
 * How many reviews are still owed: the last four gradable weeks, for each person, that have no
 * review yet. A week only counts once it is gradable (from Friday).
 */
export async function getOutstandingReviewCount(
  subjects: { id: string; startDate: string | null }[],
  today: string,
) {
  if (subjects.length === 0) return 0;

  const latest = defaultReviewWeek(today);
  const weeks = [0, 1, 2, 3].map((back) => addDays(latest, -7 * back));

  const existing = await db
    .select({ userId: weeklyReviews.userId, weekStart: weeklyReviews.weekStart })
    .from(weeklyReviews)
    .where(
      and(
        inArray(weeklyReviews.userId, subjects.map((subject) => subject.id)),
        gte(weeklyReviews.weekStart, weeks[weeks.length - 1]),
        lte(weeklyReviews.weekStart, latest),
      ),
    );
  const done = new Set(existing.map((row) => `${row.userId}:${row.weekStart}`));

  let owed = 0;
  for (const subject of subjects) {
    for (const week of weeks) {
      if (isReviewableWeek(week, today, subject.startDate) && !done.has(`${subject.id}:${week}`)) owed++;
    }
  }
  return owed;
}
