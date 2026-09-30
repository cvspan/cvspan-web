import "server-only";
import { db } from "@/db";
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
