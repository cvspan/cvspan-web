import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyFilters,
  dueState,
  groupByStatus,
  isArchivedDone,
  moveInList,
  noFilters,
  positionBetween,
  type BoardTask,
} from "./board";

const task = (id: string, extra: Partial<BoardTask> = {}): BoardTask => ({
  id,
  title: id,
  description: null,
  status: "todo",
  priority: "normal",
  position: 0,
  dueAt: null,
  completedAt: null,
  assigneeId: null,
  assigneeName: null,
  assigneeAvatar: null,
  projectId: null,
  projectName: null,
  projectCode: null,
  ...extra,
});

const NOW = new Date("2026-10-02T12:00:00");

describe("positionBetween", () => {
  it("lands between two neighbours", () => assert.equal(positionBetween(1000, 2000), 1500));
  it("goes above the first and below the last card", () => {
    assert.equal(positionBetween(null, 1000), 0);
    assert.equal(positionBetween(1000, null), 2000);
  });
  it("starts an empty column at a time-based key", () => assert.ok(positionBetween(null, null) > 1e12));
});

describe("dueState", () => {
  it("flags overdue, today, soon and later", () => {
    assert.equal(dueState("2026-10-01T09:00:00", "todo", NOW), "overdue");
    assert.equal(dueState("2026-10-02T18:00:00", "todo", NOW), "today");
    assert.equal(dueState("2026-10-04T09:00:00", "in_progress", NOW), "soon");
    assert.equal(dueState("2026-10-20T09:00:00", "todo", NOW), "later");
  });
  it("ignores finished work and missing dates", () => {
    assert.equal(dueState("2026-09-01T00:00:00", "done", NOW), null);
    assert.equal(dueState(null, "todo", NOW), null);
  });
});

describe("groupByStatus", () => {
  it("fills every column and orders each by position", () => {
    const columns = groupByStatus([
      task("b", { position: 2 }),
      task("a", { position: 1 }),
      task("c", { status: "done", position: 1 }),
    ]);
    assert.deepEqual(columns.todo.map((t) => t.id), ["a", "b"]);
    assert.deepEqual(columns.done.map((t) => t.id), ["c"]);
    assert.deepEqual(columns.blocked, []);
  });
});

describe("applyFilters", () => {
  const all = [
    task("design logo", { assigneeId: "ada", projectId: "p1", projectName: "Nuodex", priority: "high" }),
    task("write copy", { assigneeId: "bello", dueAt: "2026-09-30T00:00:00" }),
    task("unowned"),
  ];

  it("searches title and project", () => {
    assert.deepEqual(applyFilters(all, { ...noFilters, search: "nuodex" }, NOW).map((t) => t.id), ["design logo"]);
  });
  it("filters by assignee, including unassigned", () => {
    assert.deepEqual(applyFilters(all, { ...noFilters, assigneeId: "ada" }, NOW).map((t) => t.id), ["design logo"]);
    assert.deepEqual(applyFilters(all, { ...noFilters, assigneeId: "none" }, NOW).map((t) => t.id), ["unowned"]);
  });
  it("filters by priority and overdue", () => {
    assert.deepEqual(applyFilters(all, { ...noFilters, priority: "high" }, NOW).map((t) => t.id), ["design logo"]);
    assert.deepEqual(applyFilters(all, { ...noFilters, overdueOnly: true }, NOW).map((t) => t.id), ["write copy"]);
  });
});

describe("moveInList / isArchivedDone", () => {
  it("stamps completion when moved to done and clears it when reopened", () => {
    const moved = moveInList([task("a")], "a", "done", 5, NOW);
    assert.equal(moved[0].status, "done");
    assert.ok(moved[0].completedAt);
    assert.equal(moveInList(moved, "a", "todo", 6, NOW)[0].completedAt, null);
  });
  it("hides done work older than two weeks", () => {
    assert.ok(isArchivedDone(task("a", { status: "done", completedAt: "2026-09-01T00:00:00" }), NOW));
    assert.ok(!isArchivedDone(task("a", { status: "done", completedAt: "2026-09-28T00:00:00" }), NOW));
    assert.ok(!isArchivedDone(task("a", { status: "todo" }), NOW));
  });
});
