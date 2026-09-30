import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Phase 1 schema: people and org, work, attendance.
 * Performance, programmes and website link-ups follow in later phases.
 */

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

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "blocked",
  "done",
]);

export const taskPriorityEnum = pgEnum("task_priority", ["low", "normal", "high"]);

export const attendanceKindEnum = pgEnum("attendance_kind", [
  "on_site",
  "remote",
  "leave",
  "absent",
]);

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
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    /** Permission level. Independent of employmentType: an intern can be a manager. */
    role: roleEnum("role").default("member").notNull(),
    employmentType: employmentTypeEnum("employment_type").default("full_time").notNull(),
    status: memberStatusEnum("status").default("invited").notNull(),
    jobTitle: text("job_title"),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    managerId: uuid("manager_id"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("normal").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

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
  definitionId: uuid("definition_id")
    .references(() => kpiDefinitions.id, { onDelete: "cascade" })
    .notNull(),
  gradedById: uuid("graded_by_id").references(() => users.id, { onDelete: "set null" }),
  /** Period start; weekly or monthly cycles both anchor on this date. */
  periodStart: date("period_start").notNull(),
  score: integer("score").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
