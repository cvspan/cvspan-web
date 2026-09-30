/**
 * Placeholder data for the member dashboard.
 * Replaced by Neon queries once the schema is wired up.
 */

export type Tone = "neutral" | "accent" | "success" | "warning" | "error";

export const currentUser = {
  name: "Moses Arfo",
  initials: "MA",
  role: "Product Designer",
  employmentType: "Full time",
  team: "Design",
};

export const stats: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  caption: string;
}[] = [
  {
    label: "Tasks due this week",
    value: "6",
    delta: "+2",
    tone: "success",
    caption: "2 due today",
  },
  {
    label: "KPI score — September",
    value: "82%",
    delta: "+4%",
    tone: "success",
    caption: "Graded 26 Sep by Ada Obi",
  },
  {
    label: "Attendance this month",
    value: "96%",
    delta: "On track",
    tone: "accent",
    caption: "21 of 22 working days",
  },
  {
    label: "Unread messages",
    value: "3",
    delta: "New",
    tone: "warning",
    caption: "1 from your manager",
  },
];

export const kpiTrend = [
  { month: "Apr", score: 64 },
  { month: "May", score: 70 },
  { month: "Jun", score: 68 },
  { month: "Jul", score: 75 },
  { month: "Aug", score: 79 },
  { month: "Sep", score: 82 },
];

export const deadlines: {
  title: string;
  when: string;
  left: string;
  tone: Tone;
}[] = [
  { title: "Q3 self-assessment", when: "Due tomorrow", left: "1 day", tone: "error" },
  { title: "Design system handover", when: "Fri, 3 Oct", left: "3 days", tone: "warning" },
  { title: "Blog post: onboarding", when: "Mon, 6 Oct", left: "6 days", tone: "neutral" },
  { title: "Internship mid-review", when: "Wed, 15 Oct", left: "15 days", tone: "neutral" },
];

export type TaskStatus = "To do" | "In progress" | "Overdue" | "Done";

export const tasks: {
  id: string;
  title: string;
  meta: string;
  status: TaskStatus;
  done: boolean;
}[] = [
  {
    id: "t1",
    title: "Submit weekly KPI self-assessment",
    meta: "Performance · Due tomorrow",
    status: "Overdue",
    done: false,
  },
  {
    id: "t2",
    title: "Finish onboarding checklist",
    meta: "Onboarding · Due Fri, 3 Oct",
    status: "In progress",
    done: false,
  },
  {
    id: "t3",
    title: "Review 3 blog drafts for the website",
    meta: "Website · Due Fri, 3 Oct",
    status: "In progress",
    done: false,
  },
  {
    id: "t4",
    title: "Upload September attendance notes",
    meta: "Attendance · Due Mon, 6 Oct",
    status: "To do",
    done: false,
  },
  {
    id: "t5",
    title: "Team retro notes",
    meta: "Operations · Done 26 Sep",
    status: "Done",
    done: true,
  },
];

export const activity = [
  { initials: "AO", message: "Ada Obi assigned you “Review blog drafts”", when: "20 minutes ago" },
  { initials: "TK", message: "Tunde Ke graded your week 38 KPI: 4.2 / 5", when: "2 hours ago" },
  { initials: "HR", message: "HR published the October holiday calendar", when: "Yesterday" },
  { initials: "AO", message: "Ada Obi commented on your onboarding checklist", when: "Yesterday" },
  { initials: "SY", message: "Seyi approved your leave request for 10 Oct", when: "2 days ago" },
];
