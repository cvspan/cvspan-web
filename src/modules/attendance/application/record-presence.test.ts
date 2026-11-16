import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { makeMemoryThrottle } from "../infrastructure/memory-throttle";
import type { AttendanceRepository, StoredAttendance } from "./ports";
import { makeRecordPresence } from "./record-presence";

const at = (time: string) => new Date(`2026-10-30T${time}:00Z`);

/** The whole use case runs here against an in-memory store: no database, no framework. */
function fakeStore() {
  const rows = new Map<string, StoredAttendance & { userId: string; day: string }>();
  const calls: string[] = [];
  const repo: AttendanceRepository = {
    async closeSilentRecords(userId, before) {
      calls.push("close");
      for (const row of rows.values()) {
        if (row.userId === userId && !row.clockOut && row.clockIn && row.lastSeenAt && row.lastSeenAt < before) row.clockOut = row.lastSeenAt;
      }
    },
    async findDay(userId, day) {
      calls.push("find");
      return rows.get(`${userId}:${day}`) ?? null;
    },
    async insertDay(userId, day, values) {
      calls.push("insert");
      if (rows.has(`${userId}:${day}`)) return false;
      rows.set(`${userId}:${day}`, { id: `${userId}:${day}`, userId, day, ...values });
      return true;
    },
    async update(id, values) {
      calls.push("update");
      Object.assign(rows.get(id)!, values);
    },
    async touchDay(userId, day, now) {
      calls.push("touch");
      rows.get(`${userId}:${day}`)!.lastSeenAt = now;
    },
  };
  return { repo, rows, calls };
}

function setup(start: string) {
  const store = fakeStore();
  let clock = at(start);
  const record = makeRecordPresence({
    attendance: store.repo,
    throttle: makeMemoryThrottle(),
    dayOf: (now) => now.toISOString().slice(0, 10),
    now: () => clock,
  });
  return { ...store, record, advance: (time: string) => (clock = at(time)) };
}

describe("recordPresence", () => {
  it("clocks someone in on their first signal", async () => {
    const { record, rows } = setup("08:00");
    assert.equal(await record("u1"), "recorded");
    const row = rows.get("u1:2026-10-30")!;
    assert.deepEqual(row.clockIn, at("08:00"));
    assert.equal(row.clockOut, null);
  });

  it("writes once for signals that arrive together, such as two tabs", async () => {
    const { record, calls, advance } = setup("08:00");
    await record("u1");
    const before = calls.length;
    advance("08:00");
    assert.equal(await record("u1"), "skipped");
    assert.equal(calls.length, before, "a coalesced signal touches no storage");
  });

  it("keeps the person seen on later signals", async () => {
    const { record, rows, advance } = setup("08:00");
    await record("u1");
    advance("08:01");
    assert.equal(await record("u1"), "recorded");
    assert.deepEqual(rows.get("u1:2026-10-30")!.lastSeenAt, at("08:01"));
  });

  it("clocks out a person whose signals stopped, then counts the gap as time away when they return", async () => {
    const { record, rows, advance } = setup("08:00");
    await record("u1");
    advance("10:00");
    await record("u1");
    const row = rows.get("u1:2026-10-30")!;
    assert.equal(row.clockOut, null, "back in, so open again");
    assert.equal(row.awaySeconds, 2 * 3600 - 0, "two hours away, from the last signal at 08:00");
  });

  it("survives losing the race to insert the day", async () => {
    const { repo, rows } = fakeStore();
    const record = makeRecordPresence({
      attendance: { ...repo, findDay: async () => null },
      throttle: makeMemoryThrottle(),
      dayOf: () => "2026-10-30",
      now: () => at("09:00"),
    });
    rows.set("u1:2026-10-30", { id: "x", userId: "u1", day: "2026-10-30", kind: "remote", clockIn: at("08:59"), clockOut: null, lastSeenAt: at("08:59"), awaySeconds: 0 });
    await record("u1");
    assert.deepEqual(rows.get("u1:2026-10-30")!.lastSeenAt, at("09:00"));
  });
});

describe("makeMemoryThrottle", () => {
  it("lets a signal through again once the window has passed, and never grows past its bound", () => {
    const throttle = makeMemoryThrottle(3);
    assert.equal(throttle.seenRecently("a", at("08:00"), 45_000), false);
    assert.equal(throttle.seenRecently("a", at("08:00"), 45_000), true);
    assert.equal(throttle.seenRecently("a", at("08:02"), 45_000), false);
    for (const user of ["b", "c", "d", "e"]) throttle.seenRecently(user, at("08:03"), 45_000);
    assert.equal(throttle.seenRecently("e", at("08:03"), 45_000), true, "the newest entry survives a reset");
  });
});
