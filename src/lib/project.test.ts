import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDays,
  daysBetween,
  deriveProjectCode,
  describeProject,
  milestoneProgress,
  monthTicks,
  percentAlong,
  plannedProgress,
  projectHealth,
  projectProgress,
  timelineRange,
} from "./project";

const TODAY = "2026-10-15";

describe("plannedProgress", () => {
  it("is the share of the schedule that has elapsed", () => {
    assert.equal(plannedProgress("2026-10-01", "2026-10-31", TODAY), 47);
  });

  it("clamps before the start and after the target", () => {
    assert.equal(plannedProgress("2026-11-01", "2026-12-01", TODAY), 0);
    assert.equal(plannedProgress("2026-08-01", "2026-09-01", TODAY), 100);
  });

  it("is null without both dates", () => {
    assert.equal(plannedProgress(null, "2026-12-01", TODAY), null);
    assert.equal(plannedProgress("2026-10-01", null, TODAY), null);
  });

  it("handles a one-day project", () => {
    assert.equal(plannedProgress("2026-10-15", "2026-10-15", TODAY), 100);
  });
});

describe("projectProgress", () => {
  const none = { done: 0, total: 0 };

  it("uses tasks first", () => {
    assert.equal(
      projectProgress({ status: "active", tasks: { done: 3, total: 4 }, milestones: { done: 0, total: 5 } }),
      75,
    );
  });

  it("falls back to milestones when there are no tasks", () => {
    assert.equal(
      projectProgress({ status: "active", tasks: none, milestones: { done: 1, total: 4 } }),
      25,
    );
  });

  it("is 0 with nothing to measure, and 100 once completed", () => {
    assert.equal(projectProgress({ status: "active", tasks: none, milestones: none }), 0);
    assert.equal(
      projectProgress({ status: "completed", tasks: { done: 1, total: 9 }, milestones: none }),
      100,
    );
  });
});

describe("milestoneProgress", () => {
  it("is 100 when done, otherwise driven by its tasks", () => {
    assert.equal(milestoneProgress("done", { done: 0, total: 3 }), 100);
    assert.equal(milestoneProgress("in_progress", { done: 1, total: 4 }), 25);
    assert.equal(milestoneProgress("in_progress", { done: 0, total: 0 }), 0);
  });
});

describe("projectHealth", () => {
  const base = {
    status: "active" as const,
    startDate: "2026-10-01",
    targetDate: "2026-10-31",
    overdueMilestones: 0,
    today: TODAY,
  };

  it("is on track when progress keeps pace with the schedule", () => {
    assert.equal(projectHealth({ ...base, progress: 45 }), "on_track");
  });

  it("is at risk when progress trails by more than 10 points", () => {
    assert.equal(projectHealth({ ...base, progress: 30 }), "at_risk");
  });

  it("is behind when progress trails by more than 25 points", () => {
    assert.equal(projectHealth({ ...base, progress: 10 }), "behind");
  });

  it("treats an overdue milestone as at risk even when progress is fine", () => {
    assert.equal(projectHealth({ ...base, progress: 60, overdueMilestones: 1 }), "at_risk");
  });

  it("is behind once the target date has passed without completing", () => {
    assert.equal(projectHealth({ ...base, targetDate: "2026-10-10", progress: 90 }), "behind");
  });

  it("flags a project still in planning after its start date", () => {
    assert.equal(projectHealth({ ...base, status: "planning", progress: 0 }), "at_risk");
    assert.equal(
      projectHealth({ ...base, status: "planning", startDate: "2026-11-01", progress: 0 }),
      "not_started",
    );
  });

  it("does not judge paused, completed or cancelled projects", () => {
    assert.equal(projectHealth({ ...base, status: "on_hold", progress: 0 }), "paused");
    assert.equal(projectHealth({ ...base, status: "completed", progress: 0 }), "complete");
    assert.equal(projectHealth({ ...base, status: "cancelled", progress: 0 }), "cancelled");
  });

  it("is on track when there are no dates to compare against", () => {
    assert.equal(
      projectHealth({ ...base, startDate: null, targetDate: null, progress: 0 }),
      "on_track",
    );
  });
});

describe("timeline helpers", () => {
  it("widens the range to include every milestone", () => {
    const range = timelineRange(
      { startDate: "2026-10-01", targetDate: "2026-10-31" },
      [{ startDate: null, dueDate: "2026-11-10" }],
      TODAY,
    );
    assert.deepEqual(range, { start: "2026-10-01", end: "2026-11-10", totalDays: 40 });
  });

  it("is null when nothing has a date", () => {
    assert.equal(timelineRange({ startDate: null, targetDate: null }, [], TODAY), null);
  });

  it("positions dates along the range", () => {
    const range = { start: "2026-10-01", end: "2026-10-31", totalDays: 30 };
    assert.equal(percentAlong(range, "2026-10-01"), 0);
    assert.equal(percentAlong(range, "2026-10-16"), 50);
    assert.equal(percentAlong(range, "2026-12-01"), 100);
  });

  it("lists month starts inside the range", () => {
    const range = { start: "2026-09-20", end: "2026-11-20", totalDays: 61 };
    assert.deepEqual(
      monthTicks(range).map((tick) => tick.label),
      ["Oct 26", "Nov 26"],
    );
  });

  it("does arithmetic on date strings without drifting across DST", () => {
    assert.equal(daysBetween("2026-03-01", "2026-04-01"), 31);
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  });
});

describe("describeProject", () => {
  it("derives progress, schedule and health from a project row", () => {
    const described = describeProject(
      {
        status: "active",
        startDate: "2026-10-01",
        targetDate: "2026-10-31",
        tasksTotal: 10,
        tasksDone: 5,
        milestonesTotal: 3,
        milestonesDone: 1,
        overdueMilestones: 0,
      },
      TODAY,
    );
    assert.deepEqual(described, { progress: 50, planned: 47, daysLeft: 16, health: "on_track" });
  });

  it("reports overrun as negative days left", () => {
    const described = describeProject(
      {
        status: "active",
        startDate: "2026-09-01",
        targetDate: "2026-10-10",
        tasksTotal: 4,
        tasksDone: 3,
        milestonesTotal: 0,
        milestonesDone: 0,
        overdueMilestones: 0,
      },
      TODAY,
    );
    assert.equal(described.daysLeft, -5);
    assert.equal(described.health, "behind");
  });
});

describe("deriveProjectCode", () => {
  const none = new Set<string>();

  it("uses initials for multi-word names and a prefix for single words", () => {
    assert.equal(deriveProjectCode("Website Relaunch", none), "WR");
    assert.equal(deriveProjectCode("Staff Onboarding & Performance", none), "SOP");
    assert.equal(deriveProjectCode("Platform", none), "PLA");
  });

  it("numbers a code that is already taken", () => {
    assert.equal(deriveProjectCode("Website Relaunch", new Set(["WR"])), "WR2");
    assert.equal(deriveProjectCode("Website Relaunch", new Set(["WR", "WR2"])), "WR3");
  });

  it("always yields at least two characters", () => {
    assert.equal(deriveProjectCode("X", none), "XX");
    assert.equal(deriveProjectCode("", none), "PRJ");
  });
});
