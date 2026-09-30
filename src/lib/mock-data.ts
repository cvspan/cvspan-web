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

/** Tabler-style dashboard extras. */
export const sparkTaskCompletion = [4, 6, 5, 8, 7, 9, 6, 10, 8, 11, 9, 12];
export const sparkAttendance = [88, 91, 90, 94, 92, 95, 96, 94, 97, 96, 98, 96];
export const sparkMessages = [2, 5, 3, 6, 4, 7, 5, 8, 6, 4, 5, 3];
export const barAssignments = [2, 3, 1, 4, 3, 5, 2, 4, 6, 3, 5, 4];

export const miniStats: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  spark: number[];
  kind: "line" | "bar";
}[] = [
  {
    label: "Tasks completed",
    value: "12",
    delta: "+9%",
    tone: "success",
    spark: sparkTaskCompletion,
    kind: "line",
  },
  {
    label: "Attendance",
    value: "96%",
    delta: "+2%",
    tone: "success",
    spark: sparkAttendance,
    kind: "line",
  },
  {
    label: "Messages",
    value: "3",
    delta: "0%",
    tone: "neutral",
    spark: sparkMessages,
    kind: "line",
  },
  {
    label: "Assignments graded",
    value: "4",
    delta: "-1",
    tone: "error",
    spark: barAssignments,
    kind: "bar",
  },
];

export const tiles = [
  { value: "18", caption: "12 this month", label: "Tasks done", tone: "accent" as Tone },
  { value: "4.2", caption: "out of 5.0", label: "Average grade", tone: "success" as Tone },
  { value: "2", caption: "1 in progress", label: "Certificates", tone: "warning" as Tone },
  { value: "5", caption: "2 unread", label: "Announcements", tone: "neutral" as Tone },
];
