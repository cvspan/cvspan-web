import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canReviewObjectives,
  keyResultProgress,
  objectiveProgress,
  objectiveReviewerId,
  overallProgress,
  pickCycle,
  setStatus,
  submissionProblem,
} from "./objectives";

const head = { id: "head", role: "manager" as const };

describe("objectiveReviewerId", () => {
  it("prefers the head of department", () => {
    assert.equal(objectiveReviewerId({ id: "a", managerId: "m" }, head), "head");
  });

  it("falls back to the manager when the person is the head", () => {
    assert.equal(objectiveReviewerId({ id: "head", managerId: "ceo" }, head), "ceo");
  });

  it("ignores a head who cannot supervise", () => {
    assert.equal(objectiveReviewerId({ id: "a", managerId: "m" }, { id: "x", role: "member" }), "m");
  });

  it("is null when nobody supervises", () => {
    assert.equal(objectiveReviewerId({ id: "a", managerId: null }, null), null);
  });
});

describe("canReviewObjectives", () => {
  const subject = { id: "a", managerId: "m" };
  it("lets the supervisor and admins review, but never the person", () => {
    assert.equal(canReviewObjectives({ id: "head", role: "manager" }, subject, head), true);
    assert.equal(canReviewObjectives({ id: "k", role: "admin" }, subject, head), true);
    assert.equal(canReviewObjectives({ id: "a", role: "admin" }, subject, head), false);
  });

  it("does not let other managers or members review", () => {
    assert.equal(canReviewObjectives({ id: "m", role: "manager" }, subject, head), false);
    assert.equal(canReviewObjectives({ id: "head", role: "member" }, subject, head), false);
  });
});

describe("progress", () => {
  it("clamps a key result between 0 and 100", () => {
    assert.equal(keyResultProgress({ target: 10, current: 5 }), 50);
    assert.equal(keyResultProgress({ target: 10, current: 25 }), 100);
    assert.equal(keyResultProgress({ target: 10, current: -3 }), 0);
    assert.equal(keyResultProgress({ target: 0, current: 4 }), 0);
  });

  it("averages key results and weights objectives", () => {
    assert.equal(objectiveProgress([{ target: 10, current: 10 }, { target: 10, current: 0 }]), 50);
    assert.equal(objectiveProgress([]), 0);
    assert.equal(
      overallProgress([
        { weight: 75, keyResults: [{ target: 10, current: 10 }] },
        { weight: 25, keyResults: [{ target: 10, current: 0 }] },
      ]),
      75,
    );
  });
});

describe("submissionProblem", () => {
  it("requires key results and weights that total 100", () => {
    assert.match(submissionProblem([])!, /at least one objective/);
    assert.match(submissionProblem([{ title: "A", weight: 100, keyResultCount: 0 }])!, /key result/);
    assert.match(submissionProblem([{ title: "A", weight: 60, keyResultCount: 1 }])!, /60%/);
    assert.equal(
      submissionProblem([
        { title: "A", weight: 60, keyResultCount: 1 },
        { title: "B", weight: 40, keyResultCount: 2 },
      ]),
      null,
    );
  });
});

describe("setStatus", () => {
  it("shows the least finished status", () => {
    assert.equal(setStatus([]), null);
    assert.equal(setStatus(["approved", "approved"]), "approved");
    assert.equal(setStatus(["approved", "submitted"]), "submitted");
    assert.equal(setStatus(["submitted", "changes_requested"]), "changes_requested");
  });
});

describe("pickCycle", () => {
  const cycles = [
    { id: "q3", startDate: "2026-07-01", endDate: "2026-09-30" },
    { id: "q4", startDate: "2026-10-01", endDate: "2026-12-31" },
  ];
  it("prefers the requested cycle, then the one covering today, then the latest", () => {
    assert.equal(pickCycle(cycles, "2026-10-26", "q3")?.id, "q3");
    assert.equal(pickCycle(cycles, "2026-10-26")?.id, "q4");
    assert.equal(pickCycle(cycles, "2027-02-01")?.id, "q4");
    assert.equal(pickCycle([], "2026-10-26"), undefined);
  });
});
