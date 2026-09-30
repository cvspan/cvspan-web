import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** Postgres bytea, so uploads live with the data rather than a second service. */
const bytea = customType<{ data: Buffer; notNull: true; default: false }>({
  dataType() {
    return "bytea";
  },
});

/* ------------------------------------------------------------------ Enums */

export const roleEnum = pgEnum("role", ["super_admin", "admin", "manager", "member"]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "internship",
  "volunteer",
  "student",
]);

export const memberStatusEnum = pgEnum("member_status", [
  "invited",
  "active",
  "suspended",
  "alumni",
]);

export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "blocked", "done"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "normal", "high"]);

export const attendanceKindEnum = pgEnum("attendance_kind", [
  "on_site",
  "remote",
  "leave",
  "absent",
]);

export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "declined"]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "in_review",
  "scheduled",
  "published",
]);

export const jobStageEnum = pgEnum("job_stage", [
  "draft",
  "open",
  "screening",
  "interviewing",
  "closed",
]);

export const applicationStageEnum = pgEnum("application_stage", [
  "applied",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
]);

export const workModeEnum = pgEnum("work_mode", ["on_site", "hybrid", "remote"]);

export const seniorityEnum = pgEnum("seniority", [
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
]);

export const salaryPeriodEnum = pgEnum("salary_period", ["year", "month", "day", "hour"]);

export const applyMethodEnum = pgEnum("apply_method", ["portal", "email", "url"]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "not_started",
  "submitted",
  "graded",
]);

export const approvalKindEnum = pgEnum("approval_kind", [
  "leave",
  "timesheet",
  "kpi_grade",
  "blog_post",
]);

/* ----------------------------------------------------------------- People */

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  departmentId: uuid("department_id")
    .references(() => departments.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  leadId: uuid("lead_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash"),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    /** Permission level. Independent of employmentType: an intern can be a manager. */
    role: roleEnum("role").default("member").notNull(),
    employmentType: employmentTypeEnum("employment_type").default("full_time").notNull(),
    status: memberStatusEnum("status").default("invited").notNull(),
    jobTitle: text("job_title"),
    departmentId: uuid("department_id").references(() => departments.id, { onDelete: "set null" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    managerId: uuid("manager_id"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

/* ------------------------------------------------------------------- Work */

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  project: text("project"),
  assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("normal").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------- Attendance */

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  day: date("day").notNull(),
  kind: attendanceKindEnum("kind").default("on_site").notNull(),
  clockIn: timestamp("clock_in", { withTimezone: true }),
  clockOut: timestamp("clock_out", { withTimezone: true }),
  note: text("note"),
});

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").default("pending").notNull(),
  decidedById: uuid("decided_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------ Performance */

export const kpiDefinitions = pgTable("kpi_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  weight: integer("weight").default(1).notNull(),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
  active: boolean("active").default(true).notNull(),
});

export const kpiScores = pgTable("kpi_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  definitionId: uuid("definition_id").references(() => kpiDefinitions.id, { onDelete: "cascade" }),
  gradedById: uuid("graded_by_id").references(() => users.id, { onDelete: "set null" }),
  /** Period start; weekly and monthly cycles both anchor on this date. */
  periodStart: date("period_start").notNull(),
  /** Overall percentage for the period, so trends need no aggregation. */
  score: integer("score").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------------------------------------------------- Programmes */

export const programmes = pgTable("programmes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  stage: text("stage"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const enrolments = pgTable("enrolments", {
  id: uuid("id").primaryKey().defaultRandom(),
  programmeId: uuid("programme_id")
    .references(() => programmes.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  progress: integer("progress").default(0).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  programmeId: uuid("programme_id")
    .references(() => programmes.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  weekNumber: integer("week_number"),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .references(() => assignments.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: submissionStatusEnum("status").default("not_started").notNull(),
  grade: integer("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  gradedById: uuid("graded_by_id").references(() => users.id, { onDelete: "set null" }),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  programmeId: uuid("programme_id").references(() => programmes.id, { onDelete: "set null" }),
  reference: text("reference").notNull().unique(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

/* --------------------------------------------------------------- Messaging */

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Null for direct messages; set for named group conversations. */
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const threadMembers = pgTable("thread_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .references(() => threads.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .references(() => threads.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ----------------------------------------------------------------- Website */

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  uploadedById: uuid("uploaded_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  /** Derived from the body on save; never typed by hand. */
  excerpt: text("excerpt"),
  /** Rich text, stored as HTML from the editor. */
  body: text("body"),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  tags: text("tags").array().default([]).notNull(),
  coverImageUrl: text("cover_image_url"),
  coverAlt: text("cover_alt"),
  readingMinutes: integer("reading_minutes").default(1).notNull(),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  status: postStatusEnum("status").default("draft").notNull(),
  publishAt: timestamp("publish_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const jobListings = pgTable("job_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  departmentId: uuid("department_id").references(() => departments.id, { onDelete: "set null" }),
  employmentType: employmentTypeEnum("employment_type").default("full_time").notNull(),
  seniority: seniorityEnum("seniority").default("mid").notNull(),
  /** Rich text: the role, the work, what we look for, benefits. */
  description: text("description"),
  summary: text("summary"),
  location: text("location"),
  workMode: workModeEnum("work_mode").default("on_site").notNull(),
  /** Shown on the website meta line, e.g. "1–2 years" and "English". */
  experience: text("experience"),
  language: text("language").default("English"),
  openings: integer("openings").default(1).notNull(),
  skills: text("skills").array().default([]).notNull(),

  /** Ranges are optional, and only shown publicly when salaryPublic is set. */
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: text("salary_currency").default("NGN").notNull(),
  salaryPeriod: salaryPeriodEnum("salary_period").default("month").notNull(),
  salaryPublic: boolean("salary_public").default(false).notNull(),

  hiringManagerId: uuid("hiring_manager_id").references(() => users.id, { onDelete: "set null" }),
  applyMethod: applyMethodEnum("apply_method").default("portal").notNull(),
  /** Email address or external URL, depending on applyMethod. */
  applyValue: text("apply_value"),
  closingDate: date("closing_date"),

  stage: jobStageEnum("stage").default("draft").notNull(),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .references(() => jobListings.id, { onDelete: "cascade" })
    .notNull(),
  candidateName: text("candidate_name").notNull(),
  candidateEmail: text("candidate_email").notNull(),
  stage: applicationStageEnum("stage").default("applied").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ----------------------------------------------------- Approvals and alerts */

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: approvalKindEnum("kind").notNull(),
  /** Row in the originating table (leave request, submission, post…). */
  subjectId: uuid("subject_id"),
  requestedById: uuid("requested_by_id").references(() => users.id, { onDelete: "cascade" }),
  assignedToId: uuid("assigned_to_id").references(() => users.id, { onDelete: "set null" }),
  detail: text("detail"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  body: text("body"),
  href: text("href"),
  readAt: timestamp("read_at", { withTimezone: true }),
  emailedAt: timestamp("emailed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  subject: text("subject"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------------------------------------------------- Relations */

export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  team: one(teams, { fields: [users.teamId], references: [teams.id] }),
  manager: one(users, { fields: [users.managerId], references: [users.id], relationName: "manager" }),
  tasks: many(tasks),
  kpiScores: many(kpiScores),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
}));

export const kpiScoresRelations = relations(kpiScores, ({ one }) => ({
  user: one(users, { fields: [kpiScores.userId], references: [users.id] }),
  gradedBy: one(users, { fields: [kpiScores.gradedById], references: [users.id] }),
}));
