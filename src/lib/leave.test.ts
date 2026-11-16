import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { leaveBalance, leavePeriod, leaveProblem, workingDays } from "./leave";

describe("workingDays", () => {
  it("counts Monday to Friday only", () => {
    assert.equal(workingDays("2026-10-26", "2026-10-26"), 1); // Monday
    assert.equal(workingDays("2026-10-26", "2026-11-01"), 5); // Mon–Sun
    assert.equal(workingDays("2026-10-24", "2026-10-25"), 0); // Sat–Sun
    assert.equal(workingDays("2026-10-23", "2026-10-27"), 3); // Fri, Mon, Tue
  });

  it("clips to a period", () => {
    assert.equal(workingDays("2026-12-28", "2027-01-08", "2026-01-01", "2026-12-31"), 4); // Mon–Thu in 2026
    assert.equal(workingDays("2026-10-26", "2026-10-30", "2026-11-01", "2026-11-30"), 0);
  });
});

describe("leavePeriod", () => {
  it("is the calendar year for an employee and the whole internship for an intern", () => {
    const employee = { employmentType: "full_time", startDate: "2024-06-03", endDate: null };
    assert.deepEqual(leavePeriod(employee, "2026-10-26"), { kind: "year", start: "2026-01-01", end: "2026-12-31" });

    const intern = { employmentType: "internship", startDate: "2026-07-06", endDate: null };
    assert.deepEqual(leavePeriod(intern, "2026-10-26"), { kind: "internship", start: "2026-07-06", end: "2027-01-06" });
  });

  it("follows an extension an admin gave", () => {
    const intern = { employmentType: "internship", startDate: "2026-07-06", endDate: "2027-03-06" };
    assert.equal(leavePeriod(intern, "2026-10-26").end, "2027-03-06");
  });
});

describe("leaveBalance and leaveProblem", () => {
  const employee = { employmentType: "full_time", startDate: "2024-06-03", endDate: null };
  const intern = { employmentType: "internship", startDate: "2026-07-06", endDate: null };
  const today = "2026-10-26";

  it("gives 20 days to employees and 10 to interns", () => {
    assert.equal(leaveBalance(employee, [], today).allowance, 20);
    assert.equal(leaveBalance(intern, [], today).allowance, 10);
    assert.equal(leaveBalance({ ...employee, employmentType: "volunteer" }, [], today).allowance, null);
  });

  it("counts approved and pending days, in working days, and ignores declined and unpaid", () => {
    const balance = leaveBalance(
      intern,
      [
        { type: "Annual leave", startDate: "2026-09-07", endDate: "2026-09-11", status: "approved" }, // 5
        { type: "Study leave", startDate: "2026-10-13", endDate: "2026-10-14", status: "pending" }, // 2
        { type: "Sick leave", startDate: "2026-08-03", endDate: "2026-08-04", status: "declined" },
        { type: "Unpaid leave", startDate: "2026-08-10", endDate: "2026-08-14", status: "approved" },
      ],
      today,
    );
    assert.deepEqual([balance.taken, balance.pending, balance.remaining], [5, 2, 3]);
  });

  it("stops a request that would go over", () => {
    const balance = leaveBalance(intern, [{ type: "Annual leave", startDate: "2026-09-07", endDate: "2026-09-15", status: "approved" }], today); // 7 used, 3 left
    assert.match(leaveProblem(balance, { type: "Annual leave", startDate: "2026-11-02", endDate: "2026-11-06" }) ?? "", /5 working days and you have 3 left/);
    assert.equal(leaveProblem(balance, { type: "Annual leave", startDate: "2026-11-02", endDate: "2026-11-04" }), null);
  });

  it("lets unpaid leave through and rejects weekends and backwards dates", () => {
    const balance = leaveBalance(intern, [], today);
    assert.equal(leaveProblem(balance, { type: "Unpaid leave", startDate: "2026-11-02", endDate: "2026-12-30" }), null);
    assert.match(leaveProblem(balance, { type: "Annual leave", startDate: "2026-10-24", endDate: "2026-10-25" }) ?? "", /no working days/);
    assert.match(leaveProblem(balance, { type: "Annual leave", startDate: "2026-11-05", endDate: "2026-11-02" }) ?? "", /before/);
  });

  it("puts no limit on people without an allowance", () => {
    const balance = leaveBalance({ ...employee, employmentType: "volunteer" }, [], today);
    assert.equal(leaveProblem(balance, { type: "Annual leave", startDate: "2026-11-02", endDate: "2026-12-30" }), null);
  });
});
