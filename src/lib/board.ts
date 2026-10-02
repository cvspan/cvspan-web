/*
 * The rules behind the task board, kept apart from the screen so they can be tested: which columns
 * exist, where a dropped card is placed, how due dates read, and which tasks a filter keeps.
 */

export const BOARD_STATUSES = ["todo", "in_progress", "blocked", "done"] as const;
export type BoardStatus = (typeof BOARD_STATUSES)[number];

export type BoardTask = {
  id: string;
  title: string;
  description: string | null;
  status: BoardStatus;
  priority: "low" | "normal" | "high";
  position: number;
  /** ISO strings, so the task can cross from the server to the browser. */
  dueAt: string | null;
  completedAt: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  assigneeAvatar: string | null;
  projectId: string | null;
  projectName: string | null;
  projectCode: string | null;
};

const GAP = 1000;

/** A sort key that puts a card between its new neighbours. `null` means there is no neighbour on that side. */
export function positionBetween(before: number | null, after: number | null) {
  if (before !== null && after !== null) return (before + after) / 2;
  if (before !== null) return before + GAP;
  if (after !== null) return after - GAP;
  return Date.now();
}

export type DueState = "overdue" | "today" | "soon" | "later";

const DAY = 86_400_000;

/** How urgent a due date is. Finished work is never urgent. */
export function dueState(dueAt: string | null, status: BoardStatus, now = new Date()): DueState | null {
  if (!dueAt || status === "done") return null;
  const due = new Date(dueAt);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  if (due < startOfToday) return "overdue";
  const days = Math.floor((due.getTime() - startOfToday.getTime()) / DAY);
  if (days === 0) return "today";
  return days <= 2 ? "soon" : "later";
}

export type BoardFilters = {
  search: string;
  assigneeId: string;
  projectId: string;
  priority: string;
  overdueOnly: boolean;
};

export const noFilters: BoardFilters = { search: "", assigneeId: "", projectId: "", priority: "", overdueOnly: false };

export const hasFilters = (filters: BoardFilters) =>
  Boolean(filters.search || filters.assigneeId || filters.projectId || filters.priority || filters.overdueOnly);

export function applyFilters(tasks: BoardTask[], filters: BoardFilters, now = new Date()) {
  const needle = filters.search.trim().toLowerCase();
  return tasks.filter((task) => {
    if (needle && !`${task.title} ${task.description ?? ""} ${task.projectName ?? ""}`.toLowerCase().includes(needle)) {
      return false;
    }
    if (filters.assigneeId === "none" ? task.assigneeId !== null : filters.assigneeId && task.assigneeId !== filters.assigneeId) {
      return false;
    }
    if (filters.projectId === "none" ? task.projectId !== null : filters.projectId && task.projectId !== filters.projectId) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.overdueOnly && dueState(task.dueAt, task.status, now) !== "overdue") return false;
    return true;
  });
}

/** Tasks grouped into their columns, each in board order. */
export function groupByStatus(tasks: BoardTask[]) {
  const columns = Object.fromEntries(BOARD_STATUSES.map((status) => [status, [] as BoardTask[]])) as Record<
    BoardStatus,
    BoardTask[]
  >;
  for (const task of tasks) columns[task.status].push(task);
  for (const status of BOARD_STATUSES) columns[status].sort((a, b) => a.position - b.position);
  return columns;
}

/** Done work piles up. The board shows what finished in the last two weeks and counts the rest. */
export const DONE_VISIBLE_DAYS = 14;

export function isArchivedDone(task: BoardTask, now = new Date()) {
  if (task.status !== "done" || !task.completedAt) return false;
  return now.getTime() - new Date(task.completedAt).getTime() > DONE_VISIBLE_DAYS * DAY;
}

/** Applies a move to a task list, the way the server will, so the board can update before it answers. */
export function moveInList(tasks: BoardTask[], taskId: string, status: BoardStatus, position: number, now = new Date()) {
  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          status,
          position,
          completedAt: status === "done" ? (task.completedAt ?? now.toISOString()) : null,
        }
      : task,
  );
}
