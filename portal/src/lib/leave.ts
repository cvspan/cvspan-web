import { addDays, daysBetween, weekdayIndex } from "./dates";
import { defaultInternshipEnd } from "./grading";

/*
 * Leave is counted in working days (Monday to Friday). A full-time employee has 20 a calendar year;
 * an intern has 10 for the whole internship, which runs six months unless an admin extends it.
 * Other kinds of engagement have no allowance set, so nothing limits them.
 */
export const LEAVE_ALLOWANCE: Record<string, number | undefined> = {
  full_time: 20,
  internship: 10,
};

/** Unpaid leave doesn't draw on the paid allowance. */
export const UNPAID_LEAVE = "Unpaid leave";

/** Monday–Friday days from `start` to `end` inclusive, optionally clipped to `from`–`to`. */
export function workingDays(start: string, end: string, from?: string, to?: string) {
  const first = from && from > start ? from : start;
  const last = to && to < end ? to : end;
  if (last < first) return 0;

  let count = 0;
  for (let offset = 0, total = daysBetween(first, last); offset <= total; offset++) {
    if (weekdayIndex(addDays(first, offset)) < 5) count += 1;
  }
  return count;
}

type Person = { employmentType: string; startDate: string | null; endDate: string | null };

/** The stretch of time an allowance covers: this calendar year, or the whole internship. */
export function leavePeriod(person: Person, today: string) {
  if (person.employmentType === "internship" && person.startDate) {
    return { kind: "internship" as const, start: person.startDate, end: person.endDate ?? defaultInternshipEnd(person.startDate) };
  }
  const year = today.slice(0, 4);
  return { kind: "year" as const, start: `${year}-01-01`, end: `${year}-12-31` };
}

type Request = { type: string; startDate: string; endDate: string; status: string };

export function leaveBalance(person: Person, requests: Request[], today: string) {
  const period = leavePeriod(person, today);
  const allowance = LEAVE_ALLOWANCE[person.employmentType] ?? null;

  const count = (status: string) =>
    requests
      .filter((request) => request.status === status && request.type !== UNPAID_LEAVE)
      .reduce((sum, request) => sum + workingDays(request.startDate, request.endDate, period.start, period.end), 0);

  const taken = count("approved");
  const pending = count("pending");
  return {
    allowance,
    period,
    taken,
    pending,
    remaining: allowance === null ? null : Math.max(0, allowance - taken - pending),
  };
}

/** Why a request can't go ahead, or null when it can. */
export function leaveProblem(
  balance: ReturnType<typeof leaveBalance>,
  request: { type: string; startDate: string; endDate: string },
) {
  if (request.endDate < request.startDate) return "The end date can't be before the start date.";

  const days = workingDays(request.startDate, request.endDate);
  if (days === 0) return "That range has no working days in it. Leave is counted Monday to Friday.";

  if (balance.allowance !== null && request.type !== UNPAID_LEAVE) {
    const inPeriod = workingDays(request.startDate, request.endDate, balance.period.start, balance.period.end);
    if (inPeriod > (balance.remaining ?? 0)) {
      const left = balance.remaining ?? 0;
      return `That is ${inPeriod} working day${inPeriod === 1 ? "" : "s"} and you have ${left} left of your ${balance.allowance}${
        balance.period.kind === "internship" ? " for the internship" : " this year"
      }${balance.pending > 0 ? ` (counting ${balance.pending} still awaiting approval)` : ""}.`;
    }
  }
  return null;
}
