import type { Tone } from "./tone";

/* Pure scheduling logic for projects. No I/O, so it is trivial to test. */

export const projectStatuses = ["planning", "active", "on_hold", "completed", "cancelled"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const projectRoles = ["lead", "contributor", "reviewer"] as const;
export type ProjectRole = (typeof projectRoles)[number];

export const projectRoleLabels: Record<ProjectRole, string> = {
  lead: "Lead",
  contributor: "Contributor",
  reviewer: "Reviewer",
};

export const milestoneStatuses = ["not_started", "in_progress", "done"] as const;
export type MilestoneStatus = (typeof milestoneStatuses)[number];

export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

export type ReportedHealth = "on_track" | "at_risk" | "off_track";

export const reportedHealthLabels: Record<ReportedHealth, string> = {
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
};

export const reportedHealthTone: Record<ReportedHealth, Tone> = {
  on_track: "success",
  at_risk: "warning",
  off_track: "error",
};

export type Health =
  | "on_track"
  | "at_risk"
  | "behind"
  | "complete"
  | "paused"
  | "not_started"
  | "cancelled";

export const healthLabels: Record<Health, string> = {
  on_track: "On track",
  at_risk: "At risk",
  behind: "Behind schedule",
  complete: "Complete",
  paused: "On hold",
  not_started: "Not started",
  cancelled: "Cancelled",
};

export const healthTone: Record<Health, Tone> = {
  on_track: "success",
  at_risk: "warning",
  behind: "error",
  complete: "success",
  paused: "neutral",
  not_started: "neutral",
  cancelled: "neutral",
};

/** Date-only strings ("2026-10-01") compared as UTC days, so time zones never shift a day. */
const DAY_MS = 86_400_000;
const dayNumber = (value: string) => Math.floor(Date.parse(`${value}T00:00:00Z`) / DAY_MS);

export function daysBetween(from: string, to: string) {
  return dayNumber(to) - dayNumber(from);
}

export function todayString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/** Share of the schedule that has elapsed, 0–100. Null when the project has no usable dates. */
export function plannedProgress(start: string | null, target: string | null, today: string) {
  if (!start || !target) return null;
  const total = daysBetween(start, target);
  if (total <= 0) return today >= target ? 100 : 0;
  const elapsed = daysBetween(start, today);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

type Counts = { done: number; total: number };

/**
 * Actual progress: tasks are the source of truth. A project with no tasks falls back to its
 * milestones, and a completed project is always 100 regardless of what was left open.
 */
export function projectProgress(input: {
  status: ProjectStatus;
  tasks: Counts;
  milestones: Counts;
}) {
  if (input.status === "completed") return 100;
  if (input.tasks.total > 0) return Math.round((input.tasks.done / input.tasks.total) * 100);
  if (input.milestones.total > 0) {
    return Math.round((input.milestones.done / input.milestones.total) * 100);
  }
  return 0;
}

/** A milestone's own progress: its tasks if it has any, otherwise whether it is done. */
export function milestoneProgress(status: MilestoneStatus, tasks: Counts) {
  if (status === "done") return 100;
  if (tasks.total > 0) return Math.round((tasks.done / tasks.total) * 100);
  return 0;
}

/**
 * Schedule health. Compares actual progress with how much of the schedule has elapsed, and
 * treats a missed milestone or target date as a problem in its own right.
 */
export function projectHealth(input: {
  status: ProjectStatus;
  startDate: string | null;
  targetDate: string | null;
  progress: number;
  overdueMilestones: number;
  today: string;
}): Health {
  const { status, startDate, targetDate, progress, overdueMilestones, today } = input;

  if (status === "completed") return "complete";
  if (status === "cancelled") return "cancelled";
  if (status === "on_hold") return "paused";

  if (status === "planning") {
    /** Planning past its start date means the kickoff slipped. */
    return startDate && today > startDate ? "at_risk" : "not_started";
  }

  if (targetDate && today > targetDate) return "behind";

  const planned = plannedProgress(startDate, targetDate, today);
  const gap = planned === null ? 0 : planned - progress;

  if (gap > 25) return "behind";
  if (gap > 10 || overdueMilestones > 0) return "at_risk";
  return "on_track";
}

/** Whole days to the target: positive is time left, negative is overrun, null without a target. */
export function daysToTarget(targetDate: string | null, today: string) {
  return targetDate ? daysBetween(today, targetDate) : null;
}

export type TimelineRange = { start: string; end: string; totalDays: number };

/** The window the Gantt chart covers: the project dates widened to include every milestone. */
export function timelineRange(
  project: { startDate: string | null; targetDate: string | null },
  milestones: { startDate: string | null; dueDate: string }[],
  today: string,
): TimelineRange | null {
  const dates = [
    project.startDate,
    project.targetDate,
    ...milestones.flatMap((milestone) => [milestone.startDate, milestone.dueDate]),
  ].filter((value): value is string => Boolean(value));

  if (dates.length === 0) return null;

  /** Include today when the project is under way, so the marker is always on the chart. */
  const sorted = [...dates].sort();
  const start = sorted[0];
  let end = sorted[sorted.length - 1];
  if (today > end && today <= addDays(end, 31)) end = today;

  return { start, end, totalDays: Math.max(1, daysBetween(start, end)) };
}

export function addDays(value: string, days: number) {
  return new Date((dayNumber(value) + days) * DAY_MS).toISOString().slice(0, 10);
}

/** Position of a date along the chart as a 0–100 percentage. */
export function percentAlong(range: TimelineRange, value: string) {
  return Math.min(100, Math.max(0, (daysBetween(range.start, value) / range.totalDays) * 100));
}

/** First day of each month inside the range, for the chart's axis. */
export function monthTicks(range: TimelineRange) {
  const ticks: { label: string; percent: number }[] = [];
  const [year, month] = range.start.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, 1));
  const formatter = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

  while (true) {
    const value = cursor.toISOString().slice(0, 10);
    if (value > range.end) break;
    if (value >= range.start) {
      ticks.push({ label: formatter.format(cursor), percent: percentAlong(range, value) });
    }
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return ticks;
}

type ProjectRowCounts = {
  status: ProjectStatus;
  startDate: string | null;
  targetDate: string | null;
  tasksTotal: number;
  tasksDone: number;
  milestonesTotal: number;
  milestonesDone: number;
  overdueMilestones: number;
};

/** Everything a project row or header shows, derived the same way on every page. */
export function describeProject(row: ProjectRowCounts, today: string) {
  const progress = projectProgress({
    status: row.status,
    tasks: { done: row.tasksDone, total: row.tasksTotal },
    milestones: { done: row.milestonesDone, total: row.milestonesTotal },
  });

  return {
    progress,
    planned: plannedProgress(row.startDate, row.targetDate, today),
    daysLeft: daysToTarget(row.targetDate, today),
    health: projectHealth({
      status: row.status,
      startDate: row.startDate,
      targetDate: row.targetDate,
      progress,
      overdueMilestones: row.overdueMilestones,
      today,
    }),
  };
}

/**
 * A short reference for a project: "Website Relaunch" → "WR", "Platform" → "PLA". Numbered when
 * that code is already taken. Only a starting point; admins can type their own.
 */
export function deriveProjectCode(name: string, taken: ReadonlySet<string>) {
  const words = name.toUpperCase().match(/[A-Z0-9]+/g) ?? [];
  const raw =
    words.length > 1 ? words.map((word) => word[0]).join("").slice(0, 4) : (words[0] ?? "PRJ").slice(0, 3);
  const base = raw.length >= 2 ? raw : `${raw}X`;

  if (!taken.has(base)) return base;
  for (let suffix = 2; suffix < 100; suffix++) {
    if (!taken.has(`${base}${suffix}`)) return `${base}${suffix}`;
  }
  return `${base}${Date.now() % 1000}`;
}
