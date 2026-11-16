import { PRESENCE_TIMEOUT_MS, presenceStep } from "../domain/presence";
import type { AttendanceRepository, PresenceThrottle } from "./ports";

/**
 * Signals closer together than this are one write. The portal pings once a minute per tab, so this
 * mostly collapses several tabs open by the same person; it adds at most this much to the last-seen
 * time, which the three-minute timeout absorbs.
 */
export const COALESCE_WINDOW_MS = 45_000;

export type RecordPresenceDeps = {
  attendance: AttendanceRepository;
  throttle: PresenceThrottle;
  /** The company's calendar day for an instant ("2026-10-30"). Injected so the use case has no time-zone code. */
  dayOf: (now: Date) => string;
  now?: () => Date;
};

/** Handles one presence signal: clocks someone in, keeps them seen, and closes records that went silent. */
export function makeRecordPresence({ attendance, throttle, dayOf, now = () => new Date() }: RecordPresenceDeps) {
  return async function recordPresence(userId: string): Promise<"skipped" | "recorded"> {
    const at = now();
    if (await throttle.seenRecently(userId, at, COALESCE_WINDOW_MS)) return "skipped";

    await attendance.closeSilentRecords(userId, new Date(at.getTime() - PRESENCE_TIMEOUT_MS));

    const day = dayOf(at);
    const record = await attendance.findDay(userId, day);
    const step = presenceStep(record, at);

    if (step.type === "update") {
      await attendance.update(record!.id, step.values);
      return "recorded";
    }

    const created = await attendance.insertDay(userId, day, step.values);
    if (!created) await attendance.touchDay(userId, day, at);
    return "recorded";
  };
}
