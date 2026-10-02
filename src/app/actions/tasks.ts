"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { milestones, projectMembers, tasks, users } from "@/db/schema";
import { getProjectRole } from "@/db/queries-projects";
import { canManageProject } from "@/lib/project";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import {
  fail,
  ok,
  optionalDate,
  optionalId,
  optionalText,
  parseForm,
  requiredId,
  requiredText,
  type ActionResult,
} from "@/lib/validation";
import { logActivity, notify } from "./guards";

const TASK_STATUSES = ["todo", "in_progress", "blocked", "done"] as const;

const taskSchema = z.object({
  title: requiredText("Title", 160),
  description: optionalText("Description", 1000),
  assigneeId: optionalId("assignee"),
  projectId: optionalId("project"),
  milestoneId: optionalId("milestone"),
  dueAt: optionalDate("Due date"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  status: z.enum(TASK_STATUSES).default("todo"),
});

function refresh(projectId?: string | null) {
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/");
  if (projectId) revalidatePath(`/projects/${projectId}`);
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = parseForm(taskSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { assigneeId: requestedAssignee, projectId, milestoneId, dueAt, ...values } = parsed.data;

  const assigneeId = requestedAssignee ?? user.id;
  const projectRole = projectId ? await getProjectRole(projectId, user.id) : null;
  const isAdmin = atLeast(user.role, "admin");

  /** Members never create or assign tasks, not even their own. Managers, admins and a project's own lead do. */
  if (!atLeast(user.role, "manager") && !canManageProject(user.role, projectRole)) {
    return fail("Members can't create or assign tasks. Ask your manager.");
  }

  if (projectId) {
    if (!isAdmin && !projectRole) return fail("You are not on that project.");

    /** Work on a project goes to people on that project. */
    const [onProject] = await db
      .select({ id: projectMembers.id })
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, assigneeId)))
      .limit(1);
    if (!onProject) {
      const [assignee] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, assigneeId))
        .limit(1);
      return fail(`Add ${assignee?.name ?? "that person"} to the project before assigning them work on it.`);
    }
  }

  if (milestoneId) {
    const [milestone] = await db
      .select({ projectId: milestones.projectId })
      .from(milestones)
      .where(eq(milestones.id, milestoneId))
      .limit(1);
    if (!milestone || milestone.projectId !== projectId) {
      return fail("That milestone belongs to a different project.");
    }
  }

  await db.insert(tasks).values({
    ...values,
    projectId,
    milestoneId,
    assigneeId,
    createdById: user.id,
    dueAt: dueAt ? new Date(dueAt) : null,
    completedAt: values.status === "done" ? new Date() : null,
    /** The current time puts a new task at the bottom of its column. */
    position: Date.now(),
  });

  if (assigneeId !== user.id) {
    await notify(assigneeId, `${user.name} assigned you “${values.title}”`, "/tasks", "tasks");
    await logActivity(user.id, "assigned a task", values.title);
  }

  refresh(projectId);
  return ok;
}

/** Who may change a task's status or place on the board: its assignee, and the people who manage the work. */
async function canMove(user: { id: string; role: Parameters<typeof atLeast>[0] }, task: { assigneeId: string | null; projectId: string | null }) {
  if (task.assigneeId === user.id || atLeast(user.role, "manager")) return true;
  return task.projectId ? canManageProject(user.role, await getProjectRole(task.projectId, user.id)) : false;
}

/**
 * Moves a task to a column and a place in it. `position` is a sort key between its new neighbours,
 * worked out by the board, so one write is enough however many tasks the column holds.
 */
export async function moveTask(taskId: string, status: string, position: number): Promise<ActionResult> {
  const user = await requireUser();

  if (!(TASK_STATUSES as readonly string[]).includes(status) || !Number.isFinite(position)) {
    return fail("That move isn't valid.");
  }
  const nextStatus = status as (typeof TASK_STATUSES)[number];

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return fail("That task no longer exists.");
  if (!(await canMove(user, task))) return fail("You can only move tasks that are assigned to you.");

  await db
    .update(tasks)
    .set({
      status: nextStatus,
      position,
      /** Finishing stamps the time; reopening clears it. Moving within Done keeps the original stamp. */
      completedAt: nextStatus === "done" ? (task.completedAt ?? new Date()) : null,
    })
    .where(eq(tasks.id, taskId));

  if (nextStatus !== task.status && nextStatus === "done" && task.createdById && task.createdById !== user.id) {
    await notify(task.createdById, `${user.name} finished “${task.title}”`, "/tasks", "tasks");
  }

  refresh(task.projectId);
  return ok;
}

const editSchema = taskSchema.omit({ status: true }).extend({
  taskId: requiredId("task"),
  /** Set by the form when the date was not changed. */
  keepDue: z.string().optional(),
});

/** Edits a task's details. Managers, admins and the project's manager only; everyone else just moves it. */
export async function updateTask(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = parseForm(editSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { taskId, assigneeId, projectId, milestoneId, dueAt, keepDue, ...values } = parsed.data;

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return fail("That task no longer exists.");

  const leads = task.projectId ? canManageProject(user.role, await getProjectRole(task.projectId, user.id)) : false;
  if (!atLeast(user.role, "manager") && !leads) return fail("Only a manager can edit a task's details.");

  if (projectId && assigneeId) {
    const [onProject] = await db
      .select({ id: projectMembers.id })
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, assigneeId)))
      .limit(1);
    if (!onProject) return fail("Add that person to the project before assigning them work on it.");
  }

  await db
    .update(tasks)
    .set({
      ...values,
      assigneeId: assigneeId ?? null,
      projectId: projectId ?? null,
      milestoneId: projectId && projectId === task.projectId ? task.milestoneId : (milestoneId ?? null),
      dueAt: keepDue ? task.dueAt : dueAt ? new Date(dueAt) : null,
    })
    .where(eq(tasks.id, taskId));

  if (assigneeId && assigneeId !== task.assigneeId && assigneeId !== user.id) {
    await notify(assigneeId, `${user.name} assigned you “${values.title}”`, "/tasks", "tasks");
  }

  refresh(task.projectId);
  if (projectId && projectId !== task.projectId) refresh(projectId);
  return ok;
}

export async function setTaskDone(taskId: string, done: boolean) {
  const user = await requireUser();

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return;

  /** Your own task, or someone you manage — admins can close anything, and so can a project's lead. */
  const mine = task.assigneeId === user.id;
  const leadsProject = task.projectId
    ? canManageProject(user.role, await getProjectRole(task.projectId, user.id))
    : false;
  if (!mine && !leadsProject && !atLeast(user.role, "manager")) return;

  await db
    .update(tasks)
    .set({ status: done ? "done" : "todo", completedAt: done ? new Date() : null })
    .where(eq(tasks.id, taskId));

  refresh(task.projectId);
}

export async function deleteTask(taskId: string) {
  const user = await requireUser();

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return;

  const leadsProject = task.projectId
    ? canManageProject(user.role, await getProjectRole(task.projectId, user.id))
    : false;
  if (!leadsProject && !atLeast(user.role, "manager")) return;

  await db.delete(tasks).where(eq(tasks.id, taskId));
  refresh(task.projectId);
}
