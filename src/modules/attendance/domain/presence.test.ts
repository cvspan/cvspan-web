import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PRESENCE_TIMEOUT_MS, presenceStep, presenceView, workedLabel, type AttendanceRecord } from "./presence";

const at = (time: string) => new Date(`2026-10-26T${time}:00Z`);
const record = (over: Partial<AttendanceRecord> = {}): AttendanceRecord => ({
  kind: "remote",
  clockIn: at("08:00"),
  clockOut: null,
  lastSeenAt: at("08:00"),
  awaySeconds: 0,
  ...over,
});

describe("presenceStep", () => {
  it("clocks someone in on their first signal of the day", () => {
    const step = presenceStep(null, at("08:05"));
    assert.equal(step.type, "insert");
    assert.deepEqual(step.values, { kind: "remote", clockIn: at("08:05"), clockOut: null, lastSeenAt: at("08:05"), awaySeconds: 0 });
  });

  it("turns a leave day into a worked day when they sign in anyway", () => {
    const step = presenceStep(record({ kind: "leave", clockIn: null, lastSeenAt: null }), at("09:00"));
    assert.equal(step.type, "update");
    assert.equal(step.values.kind, "remote");
    assert.deepEqual(step.values.clockIn, at("09:00"));
  });

  it("just refreshes the last-seen time while they stay", () => {
    const step = presenceStep(record({ lastSeenAt: at("08:10") }), at("08:11"));
    assert.deepEqual(step.values, { lastSeenAt: at("08:11") });
  });

  it("counts a long silence as time away when they come back without being clocked out", () => {
    const step = presenceStep(record({ lastSeenAt: at("10:00") }), at("11:00"));
    assert.equal(step.values.awaySeconds, 3600);
  });

  it("reopens a record that was clocked out and takes the gap off the hours", () => {
    const step = presenceStep(record({ clockOut: at("12:00"), lastSeenAt: at("12:00"), awaySeconds: 60 }), at("13:00"));
    assert.equal(step.values.clockOut, null);
    assert.equal(step.values.awaySeconds, 60 + 3600);
  });
});

describe("presenceView", () => {
  const now = at("17:00");

  it("is working while signals are recent", () => {
    const view = presenceView(record({ lastSeenAt: at("16:59") }), now);
    assert.equal(view.working, true);
    assert.equal(view.clockOut, null);
    assert.equal(view.workedMs, 9 * 3_600_000);
  });

  it("shows a silent record as clocked out at the last signal", () => {
    const last = new Date(now.getTime() - PRESENCE_TIMEOUT_MS - 60_000);
    const view = presenceView(record({ lastSeenAt: last }), now);
    assert.equal(view.working, false);
    assert.deepEqual(view.clockOut, last);
  });

  it("takes time away off the hours", () => {
    const view = presenceView(record({ clockOut: at("12:00"), awaySeconds: 1800 }), now);
    assert.equal(view.workedMs, 3.5 * 3_600_000);
  });

  it("has no hours without a clock-in", () => {
    assert.equal(presenceView(record({ kind: "leave", clockIn: null }), now).workedMs, null);
  });
});

describe("workedLabel", () => {
  it("formats hours and minutes", () => {
    assert.equal(workedLabel(8.5 * 3_600_000), "8h 30m");
    assert.equal(workedLabel(0), "0h 00m");
    assert.equal(workedLabel(null), "—");
  });
});
