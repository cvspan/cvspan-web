"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { logActivity, notify } from "./guards";

export async function createTask(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const assigneeId = String(formData.get("assigneeId") ?? "") || user.id;
  /** Only managers and above may put work on someone else's plate. */
  if (assigneeId !== user.id && !atLeast(user.role, "manager")) return;

  const dueRaw = String(formData.get("dueAt") ?? "");
  const priority = String(formData.get("priority") ?? "normal") as "low" | "normal" | "high";

  await db.insert(tasks).values({
    title,
    project: String(formData.get("project") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    assigneeId,
    createdById: user.id,
    priority,
    dueAt: dueRaw ? new Date(dueRaw) : null,
  });

  if (assigneeId !== user.id) {
    await notify(assigneeId, `${user.name} assigned you “${title}”`, "/tasks");
    await logActivity(user.id, "assigned a task", title);
  }

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function setTaskDone(taskId: string, done: boolean) {
  const user = await requireUser();

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return;

  /** Your own task, or someone you manage — admins can close anything. */
  const mine = task.assigneeId === user.id;
  if (!mine && !atLeast(user.role, "manager")) return;

  await db
    .update(tasks)
    .set({ status: done ? "done" : "todo", completedAt: done ? new Date() : null })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const user = await requireUser();
  if (!atLeast(user.role, "manager")) return;

  await db.delete(tasks).where(and(eq(tasks.id, taskId)));
  revalidatePath("/tasks");
}
