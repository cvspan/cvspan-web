/**
 * Placeholder data for every portal surface.
 * Each export is replaced by a Neon query as its module is wired up.
 */

export type Tone = "neutral" | "accent" | "success" | "warning" | "error";

export type EmploymentType =
  | "Full time"
  | "Part time"
  | "Internship"
  | "Volunteer"
  | "Student";

export const currentUser = {
  name: "Moses Arfo",
  initials: "MA",
  role: "Product Designer",
  employmentType: "Full time" as EmploymentType,
  team: "Design",
};

/* ---------------------------------------------------------------- People */

export type Person = {
  id: string;
  name: string;
  initials: string;
  jobTitle: string;
  department: string;
  employmentType: EmploymentType;
  status: "Active" | "Invited" | "Alumni";
  manager: string;
  started: string;
  kpi: number;
  attendance: number;
};

export const people: Person[] = [
  { id: "p1", name: "Ada Obi", initials: "AO", jobTitle: "Design Lead", department: "Design", employmentType: "Full time", status: "Active", manager: "Seyi Bankole", started: "Mar 2024", kpi: 88, attendance: 98 },
  { id: "p2", name: "Moses Arfo", initials: "MA", jobTitle: "Product Designer", department: "Design", employmentType: "Full time", status: "Active", manager: "Ada Obi", started: "Jan 2025", kpi: 82, attendance: 96 },
  { id: "p3", name: "Tunde Ke", initials: "TK", jobTitle: "Engineering Lead", department: "Engineering", employmentType: "Full time", status: "Active", manager: "Seyi Bankole", started: "Aug 2023", kpi: 91, attendance: 94 },
  { id: "p4", name: "Chioma Eze", initials: "CE", jobTitle: "Frontend Intern", department: "Engineering", employmentType: "Internship", status: "Active", manager: "Tunde Ke", started: "Jul 2026", kpi: 74, attendance: 92 },
  { id: "p5", name: "Bello Ibrahim", initials: "BI", jobTitle: "Content Writer", department: "Marketing", employmentType: "Part time", status: "Active", manager: "Ngozi Uche", started: "Feb 2026", kpi: 79, attendance: 88 },
  { id: "p6", name: "Ngozi Uche", initials: "NU", jobTitle: "Marketing Lead", department: "Marketing", employmentType: "Full time", status: "Active", manager: "Seyi Bankole", started: "Nov 2024", kpi: 86, attendance: 97 },
  { id: "p7", name: "Femi Adeyemi", initials: "FA", jobTitle: "Community Volunteer", department: "Programmes", employmentType: "Volunteer", status: "Active", manager: "Ngozi Uche", started: "May 2026", kpi: 71, attendance: 84 },
  { id: "p8", name: "Grace Peters", initials: "GP", jobTitle: "Data Student", department: "Programmes", employmentType: "Student", status: "Active", manager: "Tunde Ke", started: "Sep 2026", kpi: 68, attendance: 90 },
  { id: "p9", name: "Seyi Bankole", initials: "SB", jobTitle: "Chief Operating Officer", department: "Operations", employmentType: "Full time", status: "Active", manager: "—", started: "Jan 2023", kpi: 93, attendance: 99 },
  { id: "p10", name: "Kemi Lawal", initials: "KL", jobTitle: "HR Manager", department: "Operations", employmentType: "Full time", status: "Active", manager: "Seyi Bankole", started: "Jun 2024", kpi: 85, attendance: 95 },
  { id: "p11", name: "Daniel Okoro", initials: "DO", jobTitle: "Backend Intern", department: "Engineering", employmentType: "Internship", status: "Invited", manager: "Tunde Ke", started: "Oct 2026", kpi: 0, attendance: 0 },
  { id: "p12", name: "Amaka Nwosu", initials: "AN", jobTitle: "Design Intern", department: "Design", employmentType: "Internship", status: "Alumni", manager: "Ada Obi", started: "Feb 2026", kpi: 80, attendance: 91 },
];

export const departments = [
  { name: "Design", head: "Ada Obi", headcount: 4, openRoles: 1 },
  { name: "Engineering", head: "Tunde Ke", headcount: 6, openRoles: 2 },
  { name: "Marketing", head: "Ngozi Uche", headcount: 3, openRoles: 0 },
  { name: "Programmes", head: "Kemi Lawal", headcount: 5, openRoles: 1 },
  { name: "Operations", head: "Seyi Bankole", headcount: 3, openRoles: 0 },
];

/* ----------------------------------------------------------------- Stats */

export const stats: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  caption: string;
}[] = [
  { label: "Tasks due this week", value: "6", delta: "+2", tone: "success", caption: "2 due today" },
  { label: "KPI score — September", value: "82%", delta: "+4%", tone: "success", caption: "Graded 26 Sep by Ada Obi" },
  { label: "Attendance this month", value: "96%", delta: "On track", tone: "accent", caption: "21 of 22 working days" },
  { label: "Unread messages", value: "3", delta: "New", tone: "warning", caption: "1 from your manager" },
];

export const kpiTrend = [
  { month: "Apr", score: 64 },
  { month: "May", score: 70 },
  { month: "Jun", score: 68 },
  { month: "Jul", score: 75 },
  { month: "Aug", score: 79 },
  { month: "Sep", score: 82 },
];

export const deadlines: { title: string; when: string; left: string; tone: Tone }[] = [
  { title: "Q3 self-assessment", when: "Due tomorrow", left: "1 day", tone: "error" },
  { title: "Design system handover", when: "Fri, 3 Oct", left: "3 days", tone: "warning" },
  { title: "Blog post: onboarding", when: "Mon, 6 Oct", left: "6 days", tone: "neutral" },
  { title: "Internship mid-review", when: "Wed, 15 Oct", left: "15 days", tone: "neutral" },
];

export type TaskStatus = "To do" | "In progress" | "Overdue" | "Done";

export type Task = {
  id: string;
  title: string;
  meta: string;
  status: TaskStatus;
  done: boolean;
  assignee: string;
  assigneeInitials: string;
  project: string;
  due: string;
  priority: "Low" | "Normal" | "High";
};

export const tasks: Task[] = [
  { id: "t1", title: "Submit weekly KPI self-assessment", meta: "Performance · Due tomorrow", status: "Overdue", done: false, assignee: "Moses Arfo", assigneeInitials: "MA", project: "Performance", due: "1 Oct", priority: "High" },
  { id: "t2", title: "Finish onboarding checklist", meta: "Onboarding · Due Fri, 3 Oct", status: "In progress", done: false, assignee: "Moses Arfo", assigneeInitials: "MA", project: "Onboarding", due: "3 Oct", priority: "Normal" },
  { id: "t3", title: "Review 3 blog drafts for the website", meta: "Website · Due Fri, 3 Oct", status: "In progress", done: false, assignee: "Moses Arfo", assigneeInitials: "MA", project: "Website", due: "3 Oct", priority: "Normal" },
  { id: "t4", title: "Upload September attendance notes", meta: "Attendance · Due Mon, 6 Oct", status: "To do", done: false, assignee: "Moses Arfo", assigneeInitials: "MA", project: "Attendance", due: "6 Oct", priority: "Low" },
  { id: "t5", title: "Team retro notes", meta: "Operations · Done 26 Sep", status: "Done", done: true, assignee: "Moses Arfo", assigneeInitials: "MA", project: "Operations", due: "26 Sep", priority: "Low" },
  { id: "t6", title: "Prepare intern induction deck", meta: "Programmes · Due Wed, 8 Oct", status: "To do", done: false, assignee: "Chioma Eze", assigneeInitials: "CE", project: "Programmes", due: "8 Oct", priority: "High" },
  { id: "t7", title: "Publish October careers page update", meta: "Website · Due Thu, 9 Oct", status: "To do", done: false, assignee: "Bello Ibrahim", assigneeInitials: "BI", project: "Website", due: "9 Oct", priority: "Normal" },
];

export const activity = [
  { initials: "AO", message: "Ada Obi assigned you “Review blog drafts”", when: "20 minutes ago" },
  { initials: "TK", message: "Tunde Ke graded your week 38 KPI: 4.2 / 5", when: "2 hours ago" },
  { initials: "HR", message: "HR published the October holiday calendar", when: "Yesterday" },
  { initials: "AO", message: "Ada Obi commented on your onboarding checklist", when: "Yesterday" },
  { initials: "SY", message: "Seyi approved your leave request for 10 Oct", when: "2 days ago" },
];

/* --------------------------------------------------------- Dashboard extras */

export const sparkTaskCompletion = [4, 6, 5, 8, 7, 9, 6, 10, 8, 11, 9, 12];
export const sparkAttendance = [88, 91, 90, 94, 92, 95, 96, 94, 97, 96, 98, 96];
export const sparkMessages = [2, 5, 3, 6, 4, 7, 5, 8, 6, 4, 5, 3];
export const barAssignments = [2, 3, 1, 4, 3, 5, 2, 4, 6, 3, 5, 4];
export const sparkHeadcount = [18, 18, 19, 19, 20, 20, 21, 21, 21, 22, 23, 24];
export const sparkApplicants = [3, 6, 4, 9, 7, 12, 8, 14, 11, 16, 13, 18];

export const miniStats: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  spark: number[];
  kind: "line" | "bar";
}[] = [
  { label: "Tasks completed", value: "12", delta: "+9%", tone: "success", spark: sparkTaskCompletion, kind: "line" },
  { label: "Attendance", value: "96%", delta: "+2%", tone: "success", spark: sparkAttendance, kind: "line" },
  { label: "Messages", value: "3", delta: "0%", tone: "neutral", spark: sparkMessages, kind: "line" },
  { label: "Assignments graded", value: "4", delta: "-1", tone: "error", spark: barAssignments, kind: "bar" },
];

export const tiles = [
  { value: "18", caption: "12 this month", label: "Tasks done", tone: "accent" as Tone },
  { value: "4.2", caption: "out of 5.0", label: "Average grade", tone: "success" as Tone },
  { value: "2", caption: "1 in progress", label: "Certificates", tone: "warning" as Tone },
  { value: "5", caption: "2 unread", label: "Announcements", tone: "neutral" as Tone },
];

/* ------------------------------------------------------------- Attendance */

export type AttendanceKind = "On site" | "Remote" | "Leave" | "Absent";

export const attendanceMonth: {
  day: string;
  weekday: string;
  kind: AttendanceKind;
  clockIn: string;
  clockOut: string;
  hours: string;
}[] = [
  { day: "30 Sep", weekday: "Tue", kind: "On site", clockIn: "08:52", clockOut: "—", hours: "in progress" },
  { day: "29 Sep", weekday: "Mon", kind: "Remote", clockIn: "09:04", clockOut: "17:32", hours: "8h 28m" },
  { day: "26 Sep", weekday: "Fri", kind: "On site", clockIn: "08:47", clockOut: "17:10", hours: "8h 23m" },
  { day: "25 Sep", weekday: "Thu", kind: "Leave", clockIn: "—", clockOut: "—", hours: "Approved leave" },
  { day: "24 Sep", weekday: "Wed", kind: "On site", clockIn: "09:12", clockOut: "17:40", hours: "8h 28m" },
  { day: "23 Sep", weekday: "Tue", kind: "Remote", clockIn: "08:58", clockOut: "17:02", hours: "8h 04m" },
  { day: "22 Sep", weekday: "Mon", kind: "Absent", clockIn: "—", clockOut: "—", hours: "Unreported" },
];

export const leaveRequests = [
  { id: "l1", person: "Moses Arfo", initials: "MA", type: "Annual leave", dates: "10 Oct", days: 1, status: "Approved" as const },
  { id: "l2", person: "Chioma Eze", initials: "CE", type: "Study leave", dates: "13–14 Oct", days: 2, status: "Pending" as const },
  { id: "l3", person: "Bello Ibrahim", initials: "BI", type: "Sick leave", dates: "22 Sep", days: 1, status: "Approved" as const },
  { id: "l4", person: "Femi Adeyemi", initials: "FA", type: "Unpaid leave", dates: "20–24 Oct", days: 5, status: "Pending" as const },
];

/* ---------------------------------------------------------------- Messages */

export const threads = [
  { id: "m1", name: "Ada Obi", initials: "AO", preview: "Can you share the handover file before Friday?", when: "09:41", unread: 2 },
  { id: "m2", name: "Design team", initials: "DT", preview: "Tunde: the new tokens are live in the portal", when: "Yesterday", unread: 1 },
  { id: "m3", name: "Kemi Lawal", initials: "KL", preview: "Your October leave has been approved.", when: "Yesterday", unread: 0 },
  { id: "m4", name: "Programmes cohort 4", initials: "P4", preview: "Grace: submitted my week 3 assignment", when: "Mon", unread: 0 },
];

export const conversation = [
  { from: "them", name: "Ada Obi", initials: "AO", text: "Morning Moses — can you share the design system handover file before Friday?", when: "09:32" },
  { from: "me", name: "Moses Arfo", initials: "MA", text: "Morning! Yes, I'm finishing the token documentation today.", when: "09:38" },
  { from: "them", name: "Ada Obi", initials: "AO", text: "Perfect. Add the dark mode notes too, the engineering team asked about it.", when: "09:41" },
];

/* -------------------------------------------------------------- Programmes */

export const programmes = [
  { id: "c1", name: "Design Internship — Cohort 4", members: 6, stage: "Mid-programme", progress: 64, ends: "12 Dec 2026" },
  { id: "c2", name: "Engineering Internship — Cohort 4", members: 8, stage: "Mid-programme", progress: 58, ends: "12 Dec 2026" },
  { id: "c3", name: "Data Students — Autumn", members: 12, stage: "Onboarding", progress: 18, ends: "20 Feb 2027" },
];

export const programmeStages = [
  { name: "Onboarding", done: true },
  { name: "Week 1–4 assignments", done: true },
  { name: "Mid-programme review", done: false },
  { name: "Final project", done: false },
  { name: "Assessment & certificate", done: false },
];

export const certificates = [
  { id: "cert1", person: "Amaka Nwosu", initials: "AN", programme: "Design Internship — Cohort 3", issued: "28 Aug 2026", ref: "CVS-2026-0184" },
  { id: "cert2", person: "Ibrahim Sule", initials: "IS", programme: "Engineering Internship — Cohort 3", issued: "28 Aug 2026", ref: "CVS-2026-0185" },
];

/* ------------------------------------------------------------- Manager view */

export const teamMembers = people
  .filter((person) => ["p2", "p4", "p5", "p8"].includes(person.id))
  .map((person) => ({
    ...person,
    openTasks: person.id === "p2" ? 4 : person.id === "p4" ? 3 : person.id === "p5" ? 2 : 5,
    graded: person.id === "p8" ? false : true,
  }));

export const approvals = [
  { id: "a1", kind: "Leave request", who: "Chioma Eze", initials: "CE", detail: "Study leave, 13–14 Oct", when: "2 hours ago" },
  { id: "a2", kind: "Timesheet", who: "Bello Ibrahim", initials: "BI", detail: "Week 39, 18 hours", when: "Yesterday" },
  { id: "a3", kind: "KPI grade", who: "Grace Peters", initials: "GP", detail: "Week 39 grading not submitted", when: "Yesterday" },
  { id: "a4", kind: "Blog post", who: "Bello Ibrahim", initials: "BI", detail: "“Inside our internship programme”", when: "2 days ago" },
];

/* --------------------------------------------------------------- Admin view */

export const orgStats = [
  { label: "Total members", value: "24", delta: "+3", tone: "success" as Tone, spark: sparkHeadcount, kind: "line" as const },
  { label: "Attendance rate", value: "93%", delta: "+1%", tone: "success" as Tone, spark: sparkAttendance, kind: "line" as const },
  { label: "Open roles", value: "4", delta: "+2", tone: "neutral" as Tone, spark: barAssignments, kind: "bar" as const },
  { label: "Applicants", value: "18", delta: "+27%", tone: "success" as Tone, spark: sparkApplicants, kind: "line" as const },
];

export const headcountByType: { type: EmploymentType; count: number }[] = [
  { type: "Full time", count: 11 },
  { type: "Part time", count: 3 },
  { type: "Internship", count: 6 },
  { type: "Volunteer", count: 2 },
  { type: "Student", count: 2 },
];

/* ------------------------------------------------------------------ Website */

export const blogPosts = [
  { id: "b1", title: "Inside our internship programme", author: "Bello Ibrahim", initials: "BI", status: "In review" as const, category: "Culture", updated: "29 Sep" },
  { id: "b2", title: "How we run weekly KPI check-ins", author: "Ada Obi", initials: "AO", status: "Scheduled" as const, category: "Ways of working", updated: "28 Sep" },
  { id: "b3", title: "Design tokens at CVSpan", author: "Moses Arfo", initials: "MA", status: "Draft" as const, category: "Design", updated: "27 Sep" },
  { id: "b4", title: "Meet the Autumn data cohort", author: "Ngozi Uche", initials: "NU", status: "Published" as const, category: "Programmes", updated: "22 Sep" },
];

export const jobListings = [
  { id: "j1", title: "Senior Frontend Engineer", department: "Engineering", type: "Full time" as EmploymentType, applicants: 8, stage: "Interviewing", posted: "12 Sep" },
  { id: "j2", title: "Product Designer", department: "Design", type: "Full time" as EmploymentType, applicants: 6, stage: "Screening", posted: "18 Sep" },
  { id: "j3", title: "Marketing Intern", department: "Marketing", type: "Internship" as EmploymentType, applicants: 4, stage: "Applied", posted: "24 Sep" },
  { id: "j4", title: "Community Volunteer", department: "Programmes", type: "Volunteer" as EmploymentType, applicants: 0, stage: "Draft", posted: "—" },
];

export const hiringPipeline = [
  { stage: "Applied", count: 18 },
  { stage: "Screening", count: 9 },
  { stage: "Interview", count: 5 },
  { stage: "Offer", count: 2 },
  { stage: "Hired", count: 1 },
];
