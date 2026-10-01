export type EmploymentType =
  | "full_time"
  | "part_time"
  | "internship"
  | "volunteer"
  | "student";

export const employmentLabels: Record<EmploymentType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  internship: "Internship",
  volunteer: "Volunteer",
  student: "Student",
};

export const taskStatusLabels = {
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
} as const;

export const attendanceLabels = {
  on_site: "On site",
  remote: "Remote",
  leave: "Leave",
  absent: "Absent",
} as const;

export const postStatusLabels = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
} as const;

export const jobStageLabels = {
  draft: "Draft",
  open: "Open",
  screening: "Screening",
  interviewing: "Interviewing",
  closed: "Closed",
} as const;

export const applicationStageLabels = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
} as const;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const dayFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short" });

export function formatDay(value: Date | string | null) {
  if (!value) return "—";
  return dayFormatter.format(new Date(value));
}

export function formatWeekday(value: Date | string | null) {
  if (!value) return "";
  return weekdayFormatter.format(new Date(value));
}

export function formatTime(value: Date | string | null) {
  if (!value) return "—";
  return timeFormatter.format(new Date(value));
}

export function formatMonth(value: Date | string | null) {
  if (!value) return "";
  return monthFormatter.format(new Date(value));
}

/** "in 3 days", "2 days ago", "today" — for deadlines and activity feeds. */
export function relativeDays(value: Date | string | null) {
  if (!value) return "—";
  const target = new Date(value);
  const today = new Date();
  const diff = Math.round(
    (target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86_400_000,
  );
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

export function hoursBetween(start: Date | string | null, end: Date | string | null) {
  if (!start || !end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.round((ms % 3_600_000) / 60_000);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export const workModeLabels = {
  on_site: "On site",
  hybrid: "Hybrid",
  remote: "Remote",
} as const;

export const seniorityLabels = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead",
} as const;

export const salaryPeriodLabels = {
  year: "per year",
  month: "per month",
  day: "per day",
  hour: "per hour",
} as const;

export const applyMethodLabels = {
  portal: "Apply in the portal",
  email: "Apply by email",
  url: "Apply on an external site",
} as const;

/** "₦450,000 – ₦600,000 per month", or a single figure when only one is set. */
export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: keyof typeof salaryPeriodLabels,
) {
  if (!min && !max) return null;
  const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : currency === "GBP" ? "£" : "";
  const money = (value: number) => `${symbol}${value.toLocaleString("en-GB")}`;
  const range = min && max ? `${money(min)} – ${money(max)}` : money((min ?? max) as number);
  return `${range} ${salaryPeriodLabels[period]}`;
}

/** "1 day", "2 days": the word agrees with the number. */
export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
