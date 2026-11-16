import type { Tone } from "./tone";
import { atLeast, type Role } from "./roles";

/**
 * Objectives and key results (OKRs). Each person sets objectives for a cycle, each with a weight
 * and measurable key results. The set goes to their supervisor, usually the head of their
 * department, who approves it or sends it back with a note. Once approved, progress is tracked
 * against the key results.
 */
export type ObjectiveStatus = "draft" | "submitted" | "approved" | "changes_requested";

export const objectiveStatusLabels: Record<ObjectiveStatus, string> = {
  draft: "Draft",
  submitted: "Awaiting review",
  approved: "Approved",
  changes_requested: "Changes requested",
};

export const objectiveStatusTones: Record<ObjectiveStatus, Tone> = {
  draft: "neutral",
  submitted: "warning",
  approved: "success",
  changes_requested: "error",
};

/** The weights of one person's objectives in a cycle have to add up to this. */
export const TOTAL_WEIGHT = 100;
export const MAX_KEY_RESULTS = 5;

/** Objectives can be edited while they are a draft or have been sent back. */
export function isEditable(status: ObjectiveStatus) {
  return status === "draft" || status === "changes_requested";
}

type Head = { id: string; role: Role } | null;

/**
 * Who reviews someone's objectives: the head of their department when that head can supervise
 * (manager or above) and is someone else; otherwise the person they report to. Null means no
 * supervisor is set up, and an admin has to review them.
 */
export function objectiveReviewerId(subject: { id: string; managerId: string | null }, head: Head) {
  if (head && head.id !== subject.id && atLeast(head.role, "manager")) return head.id;
  return subject.managerId && subject.managerId !== subject.id ? subject.managerId : null;
}

/** Admins can review anyone; otherwise only the person's own supervisor (never the person themselves). */
export function canReviewObjectives(
  actor: { id: string; role: Role },
  subject: { id: string; managerId: string | null },
  head: Head,
) {
  if (actor.id === subject.id) return false;
  if (!atLeast(actor.role, "manager")) return false;
  return atLeast(actor.role, "hr") || objectiveReviewerId(subject, head) === actor.id;
}

export type KeyResultValues = { target: number; current: number };

/** How far a key result has got, 0 to 100. A target of zero counts as not started. */
export function keyResultProgress({ target, current }: KeyResultValues) {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

/** An objective's progress is the average of its key results'. */
export function objectiveProgress(keyResults: KeyResultValues[]) {
  if (keyResults.length === 0) return 0;
  return Math.round(keyResults.reduce((sum, kr) => sum + keyResultProgress(kr), 0) / keyResults.length);
}

/** Overall progress weights each objective by how much it counts. */
export function overallProgress(objectives: { weight: number; keyResults: KeyResultValues[] }[]) {
  const total = objectives.reduce((sum, objective) => sum + objective.weight, 0);
  if (total === 0) return 0;
  return Math.round(
    objectives.reduce((sum, objective) => sum + objective.weight * objectiveProgress(objective.keyResults), 0) / total,
  );
}

export function progressTone(percent: number): Tone {
  if (percent >= 100) return "success";
  if (percent >= 60) return "accent";
  return "neutral";
}

/** Why a set can't be submitted yet, or null when it is ready. */
export function submissionProblem(objectives: { title: string; weight: number; keyResultCount: number }[]) {
  if (objectives.length === 0) return "Add at least one objective first.";
  const missing = objectives.find((objective) => objective.keyResultCount === 0);
  if (missing) return `“${missing.title}” needs at least one key result.`;
  const total = objectives.reduce((sum, objective) => sum + objective.weight, 0);
  if (total !== TOTAL_WEIGHT) return `Weights add up to ${total}%; they must total ${TOTAL_WEIGHT}%.`;
  return null;
}

/** The status of someone's whole set: the least finished one wins, so nothing looks done too early. */
export function setStatus(statuses: ObjectiveStatus[]): ObjectiveStatus | null {
  if (statuses.length === 0) return null;
  for (const status of ["changes_requested", "draft", "submitted"] as const) {
    if (statuses.includes(status)) return status;
  }
  return "approved";
}

/** The current cycle: the one covering today, else the most recently started. */
export function pickCycle<T extends { id: string; startDate: string; endDate: string }>(cycles: T[], today: string, wanted?: string) {
  const chosen = wanted ? cycles.find((cycle) => cycle.id === wanted) : undefined;
  if (chosen) return chosen;
  const current = cycles.find((cycle) => cycle.startDate <= today && today <= cycle.endDate);
  if (current) return current;
  return [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}
