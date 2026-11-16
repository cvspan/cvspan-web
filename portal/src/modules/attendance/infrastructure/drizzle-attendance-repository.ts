import "server-only";
import { and, eq, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { attendance } from "@/db/schema";
import type { AttendanceRepository } from "../application/ports";

/** The Postgres (Neon over HTTP) implementation of the attendance store. Stateless: no connection is held between calls. */
export const drizzleAttendanceRepository: AttendanceRepository = {
  async closeSilentRecords(userId, before) {
    await db
      .update(attendance)
      .set({ clockOut: sql`${attendance.lastSeenAt}` })
      .where(
        and(
          eq(attendance.userId, userId),
          isNull(attendance.clockOut),
          isNotNull(attendance.clockIn),
          lt(attendance.lastSeenAt, before),
        ),
      );
  },

  async findDay(userId, day) {
    const [row] = await db
      .select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.day, day)))
      .limit(1);
    return row ?? null;
  },

  async insertDay(userId, day, values) {
    const inserted = await db
      .insert(attendance)
      .values({ userId, day, ...values })
      .onConflictDoNothing()
      .returning({ id: attendance.id });
    return inserted.length > 0;
  },

  async update(id, values) {
    await db.update(attendance).set(values).where(eq(attendance.id, id));
  },

  async touchDay(userId, day, now) {
    await db
      .update(attendance)
      .set({ lastSeenAt: now })
      .where(and(eq(attendance.userId, userId), eq(attendance.day, day)));
  },
};
