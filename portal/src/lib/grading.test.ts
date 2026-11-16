import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addMonths, companyDay, mondayOf, weekdayIndex } from "./dates";
import {
  averageRating,
  canReview,
  defaultInternshipEnd,
  defaultReviewWeek,
  evidenceHints,
  evidenceRatios,
  headsDepartmentOf,
  internshipWindow,
  isReviewableWeek,
  reviewableWeeks,
  reviewerIdFor,
  suggestRating,
} from "./grading";

describe("week arithmetic", () => {
  it("finds the Monday of any day", () => {
    assert.equal(mondayOf("2026-10-01"), "2026-09-28"); // Thursday
    assert.equal(mondayOf("2026-09-28"), "2026-09-28"); // Monday
    assert.equal(mondayOf("2026-10-04"), "2026-09-28"); // Sunday
    assert.equal(weekdayIndex("2026-09-28"), 0);
  });

  it("adds months, clamping to the end of a shorter month", () => {
    assert.equal(addMonths("2026-07-06", 6), "2027-01-06");
    assert.equal(addMonths("2026-08-31", 6), "2027-02-28");
    assert.equal(addMonths("2026-12-15", 2), "2027-02-15");
  });

  it("formats the company day in Lagos time, not UTC", () => {
    // 23:30 UTC on 30 Sept is already 00:30 on 1 Oct in Lagos.
    assert.equal(companyDay(new Date("2026-09-30T23:30:00Z")), "2026-10-01");
  });
});

describe("which week to grade", () => {
  it("is last week until Friday, then the current week", () => {
    assert.equal(defaultReviewWeek("2026-10-01"), "2026-09-21"); // Thursday
    assert.equal(defaultReviewWeek("2026-10-02"), "2026-09-28"); // Friday
    assert.equal(defaultReviewWeek("2026-10-04"), "2026-09-28"); // Sunday
    assert.equal(defaultReviewWeek("2026-10-05"), "2026-09-28"); // Monday: last week
  });

  it("rejects future weeks, non-Mondays and weeks before the person joined", () => {
    assert.equal(isReviewableWeek("2026-10-05", "2026-10-01", null), false);
    assert.equal(isReviewableWeek("2026-09-29", "2026-10-01", null), false);
    assert.equal(isReviewableWeek("2026-09-28", "2026-10-01", "2026-10-01"), true);
    assert.equal(isReviewableWeek("2026-09-21", "2026-10-01", "2026-10-01"), false);
  });

  it("lists weeks newest first and stops at the start date", () => {
    assert.deepEqual(reviewableWeeks("2026-09-15", "2026-10-01", 8), [
      "2026-09-28",
      "2026-09-21",
      "2026-09-14",
    ]);
  });
});

describe("who grades whom", () => {
  it("grades HR employees like Management: by their department head", () => {
    const head = { id: "head", role: "manager" as const };
    assert.equal(reviewerIdFor({ id: "hr1", role: "hr", managerId: "boss" }, head), "head");
    assert.equal(reviewerIdFor({ id: "hr1", role: "hr", managerId: "boss" }, null), "boss");
  });

  const member = { id: "m", role: "member" as const, managerId: "boss" };
  const manager = { id: "mgr", role: "manager" as const, managerId: "coo" };
  const head = { id: "head", role: "manager" as const };

  it("a manager grades the members who report to them", () => {
    assert.equal(reviewerIdFor(member, null), "boss");
  });

  it("a department head grades the managers in the department", () => {
    assert.equal(reviewerIdFor(manager, head), "head");
  });

  it("a head, or a manager with no head, is graded by their own manager", () => {
    assert.equal(reviewerIdFor(manager, { id: "mgr", role: "manager" }), "coo");
    assert.equal(reviewerIdFor(manager, null), "coo");
  });

  it("a department head who is only a member can't grade, so the manager's manager does", () => {
    assert.equal(reviewerIdFor(manager, { id: "newbie", role: "member" }), "coo");
  });

  it("admins are outside the weekly cycle", () => {
    assert.equal(reviewerIdFor({ id: "a", role: "admin", managerId: null }, null), null);
  });
});

describe("who may grade", () => {
  const member = { id: "m", role: "member" as const, managerId: "boss" };
  const manager = { id: "mgr", role: "manager" as const, managerId: "coo" };

  it("a manager may grade the members who report to them, and no one else", () => {
    assert.equal(canReview({ id: "boss", role: "manager" }, member, null), true);
    assert.equal(canReview({ id: "other", role: "manager" }, member, null), false);
  });

  it("admins may grade everyone in the cycle, members and managers", () => {
    assert.equal(canReview({ id: "kemi", role: "admin" }, member, null), true);
    assert.equal(canReview({ id: "kemi", role: "admin" }, manager, null), true);
    assert.equal(canReview({ id: "seyi", role: "super_admin" }, manager, null), true);
  });

  it("members never grade anyone, even when set as someone's manager or a department head", () => {
    assert.equal(canReview({ id: "boss", role: "member" }, member, null), false);
    assert.equal(canReview({ id: "head", role: "member" }, manager, { id: "head", role: "member" }), false);
    assert.equal(canReview({ id: "m2", role: "member" }, member, null), false);
  });

  it("nobody grades themselves", () => {
    assert.equal(canReview({ id: "m", role: "member" }, member, null), false);
    assert.equal(canReview({ id: "mgr", role: "manager" }, manager, null), false);
    assert.equal(canReview({ id: "kemi", role: "admin" }, { id: "kemi", role: "manager", managerId: null }, null), false);
  });

  it("a department head may grade anyone in their department, members and managers", () => {
    const head = { id: "head", role: "manager" as const };
    assert.equal(canReview({ id: "head", role: "manager" }, member, head), true);
    assert.equal(canReview({ id: "head", role: "manager" }, manager, head), true);
  });

  it("a head's reach stops at their own department and at themselves", () => {
    const otherHead = { id: "other-head", role: "manager" as const };
    assert.equal(canReview({ id: "head", role: "manager" }, member, otherHead), false);
    assert.equal(canReview({ id: "head", role: "manager" }, { id: "head", role: "manager", managerId: null }, { id: "head", role: "manager" }), false);
    assert.equal(headsDepartmentOf({ id: "head" }, { id: "x" }, null), false);
  });

  it("a head who only holds a member role still can't grade", () => {
    assert.equal(canReview({ id: "head", role: "member" }, member, { id: "head", role: "member" }), false);
  });

  it("a manager can't grade a peer manager they don't head", () => {
    assert.equal(canReview({ id: "peer", role: "manager" }, manager, null), false);
  });

  it("admins are not graded in the weekly cycle", () => {
    assert.equal(canReview({ id: "kemi", role: "admin" }, { id: "x", role: "admin", managerId: null }, null), false);
  });
});

describe("ratings", () => {
  it("turns an evidence ratio into a 1–5 suggestion", () => {
    assert.deepEqual([1, 0.75, 0.5, 0.25, 0].map(suggestRating), [5, 4, 3, 2, 1]);
    assert.equal(suggestRating(null), null);
  });

  it("averages to one decimal", () => {
    assert.equal(averageRating([4, 5, 4, 4]), 4.3);
    assert.equal(averageRating([]), null);
  });

  it("does not count approved leave against attendance or logins", () => {
    const ratios = evidenceRatios(
      { loginDays: 4, presentDays: 4, leaveDays: 1, tasksDue: 4, tasksDone: 3, tasksOverdue: 1 },
      true,
    );
    assert.equal(ratios.availability, 1);
    assert.equal(ratios.daily_login, 1);
    assert.equal(ratios.tasks, 0.75);
    assert.equal(ratios.meetings, null);
  });

  it("suggests nothing for logins before they were tracked, or tasks when none were due", () => {
    const ratios = evidenceRatios(
      { loginDays: 0, presentDays: 5, leaveDays: 0, tasksDue: 0, tasksDone: 0, tasksOverdue: 0 },
      false,
    );
    assert.equal(ratios.daily_login, null);
    assert.equal(ratios.tasks, null);
  });
});

describe("internship countdown", () => {
  it("defaults to six months", () => {
    assert.equal(defaultInternshipEnd("2026-07-06"), "2027-01-06");
  });

  it("measures progress through the programme", () => {
    const window = internshipWindow({ startDate: "2026-07-06", endDate: null }, "2026-10-06");
    assert.ok(window);
    assert.equal(window.end, "2027-01-06");
    assert.equal(window.status, "active");
    assert.equal(window.totalDays, 184);
    assert.equal(window.elapsedDays, 92);
    assert.equal(window.daysLeft, 92);
    assert.equal(window.percent, 50);
    assert.equal(window.weekNumber, 14);
    assert.equal(window.totalWeeks, 27);
  });

  it("prefers a stored end date", () => {
    const window = internshipWindow({ startDate: "2026-07-06", endDate: "2026-12-12" }, "2026-10-01");
    assert.equal(window?.end, "2026-12-12");
  });

  it("handles not started and finished", () => {
    assert.equal(internshipWindow({ startDate: "2026-11-01", endDate: null }, "2026-10-01")?.status, "upcoming");
    assert.equal(internshipWindow({ startDate: "2026-11-01", endDate: null }, "2026-10-01")?.percent, 0);
    const done = internshipWindow({ startDate: "2026-01-05", endDate: null }, "2026-10-01");
    assert.equal(done?.status, "completed");
    assert.equal(done?.percent, 100);
    assert.equal(done?.daysLeft, 0);
  });

  it("is null without a start date", () => {
    assert.equal(internshipWindow({ startDate: null, endDate: null }, "2026-10-01"), null);
  });
});

describe("evidenceHints", () => {
  it("describes what the portal recorded, in plain words", () => {
    const hints = evidenceHints(
      { loginDays: 4, presentDays: 4, leaveDays: 1, tasksDue: 4, tasksDone: 3, tasksOverdue: 1 },
      true,
    );
    assert.equal(hints.availability, "4 of 4 working days clocked in (1 on leave).");
    assert.equal(hints.tasks, "3 of 4 tasks due this week completed, 1 overdue.");
    assert.equal(hints.daily_login, "Opened the portal on 4 of 4 working days.");
  });

  it("says so when there is nothing to report", () => {
    const hints = evidenceHints(
      { loginDays: 0, presentDays: 0, leaveDays: 0, tasksDue: 0, tasksDone: 0, tasksOverdue: 0 },
      false,
    );
    assert.equal(hints.tasks, "No tasks were due this week.");
    assert.match(hints.daily_login, /no data/);
  });
});
