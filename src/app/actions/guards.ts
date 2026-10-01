import "server-only";
import { db } from "@/db";
import { getProjectRole } from "@/db/queries-projects";
import { notifications, activityLog } from "@/db/schema";
import { canManageProject } from "@/lib/project";
import { atLeast, type Role } from "@/lib/roles";
import { requireUser } from "@/lib/session";

/** Throws unless the signed-in user actually holds `minimum` — not a preview of it. */
export async function requireRole(minimum: Role) {
  const user = await requireUser();
  if (!atLeast(user.role, minimum)) {
    throw new Error(`This action needs ${minimum} access.`);
  }
  return user;
}

export async function notify(userId: string, title: string, href?: string) {
  await db.insert(notifications).values({ userId, title, href });
}

export async function logActivity(actorId: string, action: string, subject?: string) {
  await db.insert(activityLog).values({ actorId, action, subject });
}

/**
 * Admins, or this project's manager. A project manager runs their project end to end: its
 * details, status, links, team, milestones, tasks and updates. Only admins create or delete one.
 */
export async function requireProjectManager(projectId: string) {
  const user = await requireUser();
  const role = await getProjectRole(projectId, user.id);
  if (!canManageProject(user.role, role)) {
    throw new Error("Only admins and the project manager can change this project.");
  }
  return user;
}

/** Postgres unique-constraint violation, however the driver wraps it. */
export function isUniqueViolation(error: unknown) {
  const code = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return code.code === "23505" || code.cause?.code === "23505";
}
