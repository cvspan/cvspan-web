/*
 * Attendance is recorded by presence, not by a button. Anyone with the portal open sends a signal
 * every minute; the first one of the day is their clock-in. Signing out clocks them out at once,
 * and if the signals simply stop (the tab or browser closed, the laptop asleep) they are clocked out
 * at the last one we heard. Coming back the same day carries on the same record, with the time
 * they were away taken off the hours.
 */

/** How often the open portal tells us someone is there. */
export const PING_INTERVAL_MS = 60_000;

/** No signal for this long and the person has gone: three missed minutes, so a slow network is forgiven. */
export const PRESENCE_TIMEOUT_MS = 3 * PING_INTERVAL_MS;

export type AttendanceRecord = {
  kind: "on_site" | "remote" | "leave" | "absent";
  clockIn: Date | null;
  clockOut: Date | null;
  lastSeenAt: Date | null;
  awaySeconds: number;
};

export type PresenceWrite = Partial<Pick<AttendanceRecord, "kind" | "clockIn" | "clockOut" | "lastSeenAt" | "awaySeconds">>;

const seconds = (ms: number) => Math.max(0, Math.round(ms / 1000));

/**
 * What to store when a presence signal arrives at `now` and today's record is `record` (or missing).
 * Someone online is working, so a leave or absent day becomes a normal one. People work wherever they
 * are, so the portal can't tell on site from remote: signals are recorded as remote.
 */
export function presenceStep(
  record: AttendanceRecord | null,
  now: Date,
): { type: "insert"; values: Required<PresenceWrite> } | { type: "update"; values: PresenceWrite } {
  if (!record || record.kind === "leave" || record.kind === "absent" || !record.clockIn) {
    const values = { kind: "remote" as const, clockIn: now, clockOut: null, lastSeenAt: now, awaySeconds: 0 };
    return record ? { type: "update", values } : { type: "insert", values };
  }

  /** Back after being clocked out: the gap is time away, and the day's record is open again. */
  if (record.clockOut) {
    return {
      type: "update",
      values: {
        clockOut: null,
        lastSeenAt: now,
        awaySeconds: record.awaySeconds + seconds(now.getTime() - record.clockOut.getTime()),
      },
    };
  }

  const last = record.lastSeenAt;
  const gap = last ? now.getTime() - last.getTime() : 0;
  return {
    type: "update",
    values: {
      lastSeenAt: now,
      ...(gap > PRESENCE_TIMEOUT_MS ? { awaySeconds: record.awaySeconds + seconds(gap) } : {}),
    },
  };
}

/** A record as people should see it: stale open records are shown clocked out at the last signal. */
export function presenceView(record: AttendanceRecord, now: Date) {
  if (!record.clockIn) return { clockOut: record.clockOut, working: false, workedMs: null as number | null };

  let end: Date;
  let working = false;
  if (record.clockOut) {
    end = record.clockOut;
  } else if (record.lastSeenAt && now.getTime() - record.lastSeenAt.getTime() > PRESENCE_TIMEOUT_MS) {
    end = record.lastSeenAt;
  } else {
    end = now;
    working = true;
  }

  const workedMs = Math.max(0, end.getTime() - record.clockIn.getTime() - record.awaySeconds * 1000);
  return { clockOut: working ? null : end, working, workedMs };
}

/** "8h 25m", or a dash when there is nothing to show. */
export function workedLabel(ms: number | null) {
  if (ms === null) return "—";
  const minutes = Math.round(ms / 60_000);
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}
