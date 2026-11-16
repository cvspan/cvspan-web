import type { AttendanceRecord, PresenceWrite } from "../domain/presence";

/** A stored attendance record: the domain's view of it, plus the identity the store needs. */
export type StoredAttendance = AttendanceRecord & { id: string };

/**
 * What the use case needs from storage. The domain and the use case know nothing about Postgres,
 * Drizzle or Redis: an adapter implements this, and tests use an in-memory one.
 */
export interface AttendanceRepository {
  /** Fills in the clock-out of any open record whose signals stopped before `before`. */
  closeSilentRecords(userId: string, before: Date): Promise<void>;
  findDay(userId: string, day: string): Promise<StoredAttendance | null>;
  /** Returns false when a record for that person and day already exists (two tabs signing in at once). */
  insertDay(userId: string, day: string, values: Required<PresenceWrite>): Promise<boolean>;
  update(id: string, values: PresenceWrite): Promise<void>;
  /** Just refreshes the last-seen time, for the lost race above. */
  touchDay(userId: string, day: string, now: Date): Promise<void>;
}

/**
 * Remembers when a person's last signal was written, so tabs and retries that arrive close together
 * cost nothing. Best effort and per-process by default; a shared store (Redis) makes it hold across
 * every instance, with no change to the use case.
 */
export interface PresenceThrottle {
  /** True when a signal for this person was already written within `windowMs`; otherwise records this one. */
  seenRecently(userId: string, now: Date, windowMs: number): boolean | Promise<boolean>;
}
