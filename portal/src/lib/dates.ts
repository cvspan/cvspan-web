/*
 * Calendar-day arithmetic on "YYYY-MM-DD" strings. Everything is treated as a UTC day, so a
 * daylight-saving change or the viewer's time zone can never shift a date by one.
 */

const DAY_MS = 86_400_000;

const dayNumber = (value: string) => Math.floor(Date.parse(`${value}T00:00:00Z`) / DAY_MS);

export function daysBetween(from: string, to: string) {
  return dayNumber(to) - dayNumber(from);
}

export function addDays(value: string, days: number) {
  return new Date((dayNumber(value) + days) * DAY_MS).toISOString().slice(0, 10);
}

export function todayString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/** CVSpan works on Lagos time, so "today" for logins and weekly reviews follows it. */
export const COMPANY_TIME_ZONE = "Africa/Lagos";

export function companyDay(now = new Date()) {
  /** en-CA formats as YYYY-MM-DD. */
  return new Intl.DateTimeFormat("en-CA", { timeZone: COMPANY_TIME_ZONE }).format(now);
}

/** 0 for Monday … 6 for Sunday. */
export function weekdayIndex(value: string) {
  return (new Date(`${value}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** The Monday of the week containing `value`. */
export function mondayOf(value: string) {
  return addDays(value, -weekdayIndex(value));
}

/** Adds calendar months, clamping to the end of a shorter month (31 Aug + 6 months → 28 Feb). */
export function addMonths(value: string, months: number) {
  const [year, month, day] = value.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}
