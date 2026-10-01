import "server-only";
import { db } from "@/db";
import { getProjectRole } from "@/db/queries-projects";
import { notifications, activityLog } from "@/db/schema";
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
 * Admins, or the lead of this particular project. Leads run the schedule day to day
 * (milestones, status, updates) but cannot change who is on the project or delete it.
 */
export async function requireProjectEditor(projectId: string) {
  const user = await requireUser();
  if (atLeast(user.role, "admin")) return user;

  const role = await getProjectRole(projectId, user.id);
  if (role !== "lead") {
    throw new Error("Only admins and the project lead can change this project.");
  }
  return user;
}

/** Postgres unique-constraint violation, however the driver wraps it. */
export function isUniqueViolation(error: unknown) {
  const code = (error as { code?: string; cause?: { code?: string } } | null) ?? {};
  return code.code === "23505" || code.cause?.code === "23505";
}
