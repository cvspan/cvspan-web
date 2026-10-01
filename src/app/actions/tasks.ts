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
  requiredText,
  type ActionResult,
} from "@/lib/validation";
import { logActivity, notify } from "./guards";

const taskSchema = z.object({
  title: requiredText("Title", 160),
  description: optionalText("Description", 1000),
  assigneeId: optionalId("assignee"),
  projectId: optionalId("project"),
  milestoneId: optionalId("milestone"),
  dueAt: optionalDate("Due date"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
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

  /** Only managers, admins and a project's own lead may put work on someone else's plate. */
  if (assigneeId !== user.id && !atLeast(user.role, "manager") && !canManageProject(user.role, projectRole)) {
    return fail("You can only assign tasks to yourself.");
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
  });

  if (assigneeId !== user.id) {
    await notify(assigneeId, `${user.name} assigned you “${values.title}”`, "/tasks");
    await logActivity(user.id, "assigned a task", values.title);
  }

  refresh(projectId);
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
