import "server-only";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/db";
import { attendance } from "@/db/schema";

/** Signing out is clocking out: close whatever is open now rather than waiting for the signals to stop. */
export async function endPresence(userId: string, now = new Date()) {
  await db
    .update(attendance)
    .set({ clockOut: now, lastSeenAt: now })
    .where(and(eq(attendance.userId, userId), isNull(attendance.clockOut), isNotNull(attendance.clockIn)));
}
