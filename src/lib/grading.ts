import { addDays, addMonths, daysBetween, mondayOf, weekdayIndex } from "./dates";
import { atLeast, type Role } from "./roles";

/* Rules for weekly reviews and the internship countdown. Pure, so they are easy to test. */

export const CRITERIA = [
  {
    key: "meetings",
    name: "Meeting attendance",
    description: "Joins scheduled meetings on time and prepared.",
  },
  {
    key: "availability",
    name: "Availability",
    description: "Reachable and responsive during working hours.",
  },
  {
    key: "tasks",
    name: "Completed tasks",
    description: "Delivers assigned work by its deadline.",
  },
  {
    key: "daily_login",
    name: "Daily portal login",
    description: "Opens the portal on each working day.",
  },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];
export const criterionKeys = CRITERIA.map((criterion) => criterion.key) as CriterionKey[];

export const RATING_LABELS: Record<number, string> = {
  1: "Needs improvement",
  2: "Below expectations",
  3: "Meets expectations",
  4: "Exceeds expectations",
  5: "Outstanding",
};

export const WORKING_DAYS = 5;

/** A 0–1 ratio becomes a 1–5 suggestion: 100% → 5, 75% → 4, 50% → 3, 25% → 2, none → 1. */
export function suggestRating(ratio: number | null) {
  if (ratio === null || Number.isNaN(ratio)) return null;
  return Math.min(5, Math.max(1, Math.round(1 + 4 * Math.min(1, Math.max(0, ratio)))));
}

/** Mean of the ratings to one decimal, or null when there are none. */
export function averageRating(ratings: number[]) {
  if (ratings.length === 0) return null;
  const mean = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
  return Math.round(mean * 10) / 10;
}

export function ratingTone(value: number): "success" | "accent" | "warning" | "error" {
  if (value >= 4) return "success";
  if (value >= 3) return "accent";
  if (value >= 2) return "warning";
  return "error";
}

/* ------------------------------------------------------------------- Weeks */

/**
 * Reviews are written at the end of the week, so from Friday the current week is the one to
 * grade; before that, it is last week's.
 */
export function defaultReviewWeek(today: string) {
  const monday = mondayOf(today);
  return weekdayIndex(today) >= 4 ? monday : addDays(monday, -7);
}

/** A week can be graded once it has started, and not before the person joined. */
export function isReviewableWeek(weekStart: string, today: string, personStart: string | null) {
  if (weekdayIndex(weekStart) !== 0) return false;
  if (weekStart > mondayOf(today)) return false;
  if (personStart && addDays(weekStart, 6) < personStart) return false;
  return true;
}

/** The most recent weeks that can be graded for someone, newest first. */
export function reviewableWeeks(personStart: string | null, today: string, count = 8) {
  const weeks: string[] = [];
  for (let back = 0; back < count; back++) {
    const week = addDays(mondayOf(today), -7 * back);
    if (isReviewableWeek(week, today, personStart)) weeks.push(week);
  }
  return weeks;
}

/* ------------------------------------------------------------ Who grades whom */

export type Gradable = { id: string; role: Role; managerId: string | null };

/**
 * Managers grade the members who report to them; a department head grades the managers in
 * that department. A head, who has no one above them in the department, is graded by their own
 * manager. Admins are not part of the weekly cycle.
 */
export function reviewerIdFor(subject: Gradable, departmentHeadId: string | null) {
  if (subject.role === "member") return subject.managerId;
  if (subject.role === "manager") {
    return departmentHeadId && departmentHeadId !== subject.id ? departmentHeadId : subject.managerId;
  }
  return null;
}

/** The designated reviewer may grade; admins can step in. Nobody grades themselves. */
export function canReview(
  actor: { id: string; role: Role },
  subject: Gradable,
  departmentHeadId: string | null,
) {
  if (actor.id === subject.id) return false;
  if (subject.role !== "member" && subject.role !== "manager") return false;
  return atLeast(actor.role, "admin") || reviewerIdFor(subject, departmentHeadId) === actor.id;
}

/* -------------------------------------------------------------- Week evidence */

export type WeekEvidence = {
  loginDays: number;
  presentDays: number;
  leaveDays: number;
  tasksDue: number;
  tasksDone: number;
  tasksOverdue: number;
};

/** What the portal can say for each criterion, as a 0–1 ratio. Meetings are the reviewer's call. */
export function evidenceRatios(evidence: WeekEvidence, tracksLogins: boolean) {
  /** Approved leave is not held against anyone. */
  const workingDays = Math.max(0, WORKING_DAYS - evidence.leaveDays);
  const days = (count: number) => (workingDays === 0 ? null : Math.min(1, count / workingDays));

  return {
    meetings: null,
    availability: days(evidence.presentDays),
    tasks: evidence.tasksDue === 0 ? null : evidence.tasksDone / evidence.tasksDue,
    daily_login: tracksLogins ? days(evidence.loginDays) : null,
  } satisfies Record<CriterionKey, number | null>;
}

/* ------------------------------------------------------------------ Internship */

export const INTERNSHIP_MONTHS = 6;

/** The default end of an internship: six months after it starts. */
export function defaultInternshipEnd(startDate: string) {
  return addMonths(startDate, INTERNSHIP_MONTHS);
}

export type InternshipWindow = {
  start: string;
  end: string;
  status: "upcoming" | "active" | "completed";
  totalDays: number;
  elapsedDays: number;
  daysLeft: number;
  percent: number;
  weekNumber: number;
  totalWeeks: number;
};

/** Where an intern is in their programme. Uses the stored end date, or six months from the start. */
export function internshipWindow(
  person: { startDate: string | null; endDate: string | null },
  today: string,
): InternshipWindow | null {
  if (!person.startDate) return null;

  const end = person.endDate ?? defaultInternshipEnd(person.startDate);
  const totalDays = Math.max(1, daysBetween(person.startDate, end));
  const elapsedDays = Math.min(totalDays, Math.max(0, daysBetween(person.startDate, today)));

  return {
    start: person.startDate,
    end,
    status: today < person.startDate ? "upcoming" : today >= end ? "completed" : "active",
    totalDays,
    elapsedDays,
    daysLeft: Math.max(0, daysBetween(today, end)),
    percent: Math.round((elapsedDays / totalDays) * 100),
    weekNumber: Math.min(Math.ceil(totalDays / 7), Math.floor(elapsedDays / 7) + 1),
    totalWeeks: Math.ceil(totalDays / 7),
  };
}

/** One line of portal data per criterion, shown beside the rating so the reviewer isn't guessing. */
export function evidenceHints(evidence: WeekEvidence, tracksLogins: boolean) {
  const workingDays = Math.max(0, WORKING_DAYS - evidence.leaveDays);
  const leave = evidence.leaveDays > 0 ? ` (${evidence.leaveDays} on leave)` : "";

  return {
    meetings: "The portal doesn't track meetings. Use your own record.",
    availability: `${evidence.presentDays} of ${workingDays} working days clocked in${leave}.`,
    tasks:
      evidence.tasksDue === 0
        ? "No tasks were due this week."
        : `${evidence.tasksDone} of ${evidence.tasksDue} tasks due this week completed${
            evidence.tasksOverdue > 0 ? `, ${evidence.tasksOverdue} overdue` : ""
          }.`,
    daily_login: tracksLogins
      ? `Opened the portal on ${evidence.loginDays} of ${workingDays} working days.`
      : "Login tracking began after this week, so there is no data.",
  } satisfies Record<CriterionKey, string>;
}
