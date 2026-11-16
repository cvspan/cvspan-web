import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  customType,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
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

/**
 * Access: super_admin, admin or employee. The database type also still holds "manager" and "member",
 * which the column used before Management and HR became functions of an employee. Nothing writes
 * them any more, so they are left out here.
 */
export const roleEnum = pgEnum("role", ["super_admin", "admin", "employee"]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "internship",
  "volunteer",
  "student",
]);

/**
 * Where someone sits in the organisation, separate from their access role. Heads of department
 * aren't stored: they are whoever a department names as its head, and rank between the CEO and
 * managers (see src/lib/org.ts).
 */
export const orgLevelEnum = pgEnum("org_level", ["ceo", "manager", "member"]);

export const memberStatusEnum = pgEnum("member_status", [
  "invited",
  "active",
  "suspended",
  "alumni",
]);

export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "blocked", "done"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "normal", "high"]);

export const projectStatusEnum = pgEnum("project_status", [
  "not_started",
  "planning",
  "design",
  "development",
  "live",
  "on_hold",
  "cancelled",
]);

export const projectRoleEnum = pgEnum("project_role", ["lead", "contributor", "reviewer"]);

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "not_started",
  "in_progress",
  "done",
]);

/** What a lead reports in a status update; the portal also derives its own from the schedule. */
export const projectHealthEnum = pgEnum("project_health", ["on_track", "at_risk", "off_track"]);

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
  "certificate",
]);

/** A certificate is requested, then an admin decides. Revoking is separate: see `revokedAt`. */
export const objectiveStatusEnum = pgEnum("objective_status", [
  "draft",
  "submitted",
  "approved",
  "changes_requested",
]);

export const certificateStatusEnum = pgEnum("certificate_status", ["pending", "issued", "declined"]);

/* ----------------------------------------------------------------- People */

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Names double as the website's careers filters, so renaming one is visible publicly. */
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  /** Must be a member of the department; cleared when that member leaves it. */
  headId: uuid("head_id").references((): AnyPgColumn => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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
    /** A portable media path (/api/media/<id>) the person uploaded themselves; null shows their initials. */
    avatarUrl: text("avatar_url"),
    /** Access level. Independent of employmentType: an intern can be in management. */
    role: roleEnum("role").default("employee").notNull(),
    /** An employee who supervises people. See lib/roles.ts. */
    isManagement: boolean("is_management").default(false).notNull(),
    /** An employee who runs people operations (people, leave, recruitment, certificates). */
    isHr: boolean("is_hr").default(false).notNull(),
    orgLevel: orgLevelEnum("org_level").default("member").notNull(),
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
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_manager_idx").on(table.managerId),
    index("users_department_idx").on(table.departmentId),
    /** There is one CEO. */
    uniqueIndex("users_single_ceo_idx")
      .on(table.orgLevel)
      .where(sql`${table.orgLevel} = 'ceo'`),
  ],
);

/* ------------------------------------------------------------------- Work */

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** Short unique reference, e.g. WEB, shown beside the name. */
    code: text("code").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").default("not_started").notNull(),
    departmentId: uuid("department_id").references(() => departments.id, { onDelete: "set null" }),
    startDate: date("start_date"),
    targetDate: date("target_date"),
    /** Up to three named links (Figma, repo, brief…). Validated in src/lib/project-links.ts. */
    links: jsonb("links").$type<{ name: string; url: string }[]>().default(sql`'[]'::jsonb`).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("projects_code_idx").on(table.code),
    index("projects_department_idx").on(table.departmentId),
    check("projects_links_check", sql`jsonb_typeof(${table.links}) = 'array' and jsonb_array_length(${table.links}) <= 3`),
    check(
      "projects_dates_check",
      sql`${table.targetDate} is null or ${table.startDate} is null or ${table.targetDate} >= ${table.startDate}`,
    ),
  ],
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: projectRoleEnum("role").default("contributor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("project_members_unique_idx").on(table.projectId, table.userId),
    index("project_members_user_idx").on(table.userId),
  ],
);

/** A phase of a project: it has a window on the timeline and optionally owns tasks. */
export const milestones = pgTable(
  "milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    startDate: date("start_date"),
    dueDate: date("due_date").notNull(),
    status: milestoneStatusEnum("status").default("not_started").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("milestones_project_idx").on(table.projectId),
    check(
      "milestones_dates_check",
      sql`${table.startDate} is null or ${table.dueDate} >= ${table.startDate}`,
    ),
  ],
);

export const projectUpdates = pgTable(
  "project_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    health: projectHealthEnum("health").default("on_track").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("project_updates_project_idx").on(table.projectId)],
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    /**
     * @deprecated Free-text project name from before projects were real records.
     * Nothing reads or writes it any more; drop it once the data is confirmed migrated.
     */
    project: text("project"),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "set null" }),
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    status: taskStatusEnum("status").default("todo").notNull(),
    priority: taskPriorityEnum("priority").default("normal").notNull(),
    /** Order within a board column: lower is higher up. New tasks take the current time, so they land at the bottom. */
    position: doublePrecision("position").default(0).notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("tasks_project_idx").on(table.projectId),
    index("tasks_milestone_idx").on(table.milestoneId),
    index("tasks_assignee_idx").on(table.assigneeId),
  ],
);

/* ------------------------------------------------------------- Attendance */

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    day: date("day").notNull(),
    kind: attendanceKindEnum("kind").default("on_site").notNull(),
    /** Recorded automatically: the first signal of the day from the open portal. */
    clockIn: timestamp("clock_in", { withTimezone: true }),
    /** Set when they sign out, or filled in from `lastSeenAt` once their signals stop. */
    clockOut: timestamp("clock_out", { withTimezone: true }),
    /** The last time the open portal told us someone was there. */
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    /** Time spent away between clocking out and coming back the same day, taken off the hours. */
    awaySeconds: integer("away_seconds").default(0).notNull(),
    note: text("note"),
  },
  (table) => [uniqueIndex("attendance_user_day_idx").on(table.userId, table.day)],
);

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
},
  (table) => [
    index("leave_requests_user_status_idx").on(table.userId, table.status),
  ],
);

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
},
  (table) => [
    index("kpi_scores_user_period_idx").on(table.userId, table.periodStart),
  ],
);

/** A person's own view of how a month went, written before (and shown to) their manager. */
export const selfAssessments = pgTable(
  "self_assessments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    /** First day of the month it covers, like kpi_scores. */
    periodStart: date("period_start").notNull(),
    score: integer("score").notNull(),
    comment: text("comment"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("self_assessments_user_period_idx").on(table.userId, table.periodStart),
    check("self_assessments_score_check", sql`${table.score} between 0 and 100`),
  ],
);

/* -------------------------------------------------------------- Programmes */

export const programmes = pgTable("programmes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  stage: text("stage"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  /** Whether finishing it earns a certificate; completions then appear in the admin's Approvals queue. */
  issuesCertificate: boolean("issues_certificate").default(true).notNull(),
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
},
  (table) => [
    index("enrolments_user_idx").on(table.userId),
  ],
);

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
},
  (table) => [
    index("submissions_user_idx").on(table.userId),
  ],
);

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  /** Null for an internship certificate; set for a programme certificate. */
  programmeId: uuid("programme_id").references(() => programmes.id, { onDelete: "set null" }),
  reference: text("reference").notNull().unique(),
  status: certificateStatusEnum("status").default("issued").notNull(),
  /** Who asked for it (a manager recommending someone) and what they said about the work. */
  requestedById: uuid("requested_by_id").references(() => users.id, { onDelete: "set null" }),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
  requestNote: text("request_note"),
  /** The admin who approved or declined it, and why. */
  decidedById: uuid("decided_by_id").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decisionNote: text("decision_note"),
  /** Set when an admin approves; the date printed on the certificate. Null while pending or declined. */
  issuedAt: timestamp("issued_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
},
  (table) => [
    index("certificates_user_idx").on(table.userId),
  ],
);

/* ------------------------------------------------------- Objectives (OKRs) */

export const performanceCycles = pgTable("performance_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const objectives = pgTable(
  "objectives",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cycleId: uuid("cycle_id")
      .references(() => performanceCycles.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    /** Percent of the person's total for the cycle; their objectives add up to 100. */
    weight: integer("weight").notNull(),
    status: objectiveStatusEnum("status").default("draft").notNull(),
    /** Who was asked to review it when it was submitted. */
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    reviewedById: uuid("reviewed_by_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("objectives_user_cycle_idx").on(table.userId, table.cycleId),
    check("objectives_weight_range", sql`${table.weight} between 1 and 100`),
  ],
);

export const keyResults = pgTable("key_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  objectiveId: uuid("objective_id")
    .references(() => objectives.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  /** What done looks like, in `unit`s, e.g. 12 "designs shipped". */
  target: integer("target").notNull(),
  current: integer("current").default(0).notNull(),
  unit: text("unit"),
  position: integer("position").default(0).notNull(),
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
},
  (table) => [
    index("thread_members_user_idx").on(table.userId),
  ],
);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .references(() => threads.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
  (table) => [
    index("messages_thread_created_idx").on(table.threadId, table.createdAt),
  ],
);

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

/** The people shown on the website's Team page, kept here so admins can change them without a deploy. */
export const websiteTeamMembers = pgTable("website_team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** The address of their profile on the website: cvspan.com/about/teams/<slug>. Fixed once created. */
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  /** Optional. Paragraphs are separated by a blank line; with a bio, the website links the card to a profile page. */
  bio: text("bio"),
  /** An uploaded picture (/api/media/<id>) or, for people added before this existed, a path on the website. */
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  /** Hidden people stay here but are left off the website. */
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Site-wide search and tracking settings, one row (id "site"). Admins edit them in the portal; the
 * website reads the public part through /api/public/v1/site-settings.
 */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("site"),
  siteName: text("site_name"),
  tagline: text("tagline"),
  description: text("description"),
  /** Page title pattern, with %s for the page's own title: "%s | CVSpan". */
  titleTemplate: text("title_template"),
  /** A stored image path (/api/media/<id>) or a path on the website. */
  defaultShareImage: text("default_share_image"),
  twitterHandle: text("twitter_handle"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  tiktokUrl: text("tiktok_url"),
  youtubeUrl: text("youtube_url"),
  googleVerification: text("google_verification"),
  bingVerification: text("bing_verification"),
  yandexVerification: text("yandex_verification"),
  facebookDomainVerification: text("facebook_domain_verification"),
  gaMeasurementId: text("ga_measurement_id"),
  gtmContainerId: text("gtm_container_id"),
  metaPixelId: text("meta_pixel_id"),
  linkedinPartnerId: text("linkedin_partner_id"),
  /** Turn off to ask search engines not to index the whole website (for a staging copy, say). */
  allowIndexing: boolean("allow_indexing").default(true).notNull(),
  /** Extra lines for robots.txt, one rule per line. */
  robotsExtra: text("robots_extra"),
  /** Raw tags for the head, the start of the body and the end of the body, as an admin typed them. */
  headTags: text("head_tags"),
  bodyStartTags: text("body_start_tags"),
  bodyEndTags: text("body_end_tags"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  updatedById: uuid("updated_by_id").references(() => users.id, { onDelete: "set null" }),
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
  /** An admin's feedback when a post is sent back. It stays on the draft until the author resubmits. */
  reviewNote: text("review_note"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
},
  (table) => [
    index("blog_posts_author_idx").on(table.authorId),
    index("blog_posts_status_publish_idx").on(table.status, table.publishAt),
  ],
);

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
},
  (table) => [
    index("applications_job_idx").on(table.jobId),
  ],
);

/**
 * A candidate's CV. Kept apart from `applications` so listing applicants never loads the file,
 * and apart from `media` because that table is served publicly; a CV must only reach staff.
 */
export const applicationResumes = pgTable("application_resumes", {
  applicationId: uuid("application_id")
    .primaryKey()
    .references(() => applications.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------ Weekly reviews */

/**
 * One review per person per week, written by their reviewer (a manager grades members; a
 * department head grades managers). `weekStart` is always the Monday of that week.
 */
export const weeklyReviews = pgTable(
  "weekly_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    weekStart: date("week_start").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("weekly_reviews_user_week_idx").on(table.userId, table.weekStart),
    index("weekly_reviews_reviewer_idx").on(table.reviewerId),
    check("weekly_reviews_monday_check", sql`extract(isodow from ${table.weekStart}) = 1`),
  ],
);

/** A 1–5 rating per criterion. The criterion is a key from src/lib/grading.ts, so adding one needs no migration. */
export const reviewRatings = pgTable(
  "review_ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .references(() => weeklyReviews.id, { onDelete: "cascade" })
      .notNull(),
    criterion: text("criterion").notNull(),
    rating: integer("rating").notNull(),
  },
  (table) => [
    uniqueIndex("review_ratings_review_criterion_idx").on(table.reviewId, table.criterion),
    check("review_ratings_range_check", sql`${table.rating} between 1 and 5`),
  ],
);

/** The days a person opened the portal. It feeds the "daily login" criterion. */
export const portalActivity = pgTable(
  "portal_activity",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    day: date("day").notNull(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);

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
},
  (table) => [
    index("approvals_assignee_open_idx").on(table.assignedToId, table.resolvedAt),
    index("approvals_subject_idx").on(table.kind, table.subjectId),
  ],
);

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
},
  (table) => [
    index("notifications_user_created_idx").on(table.userId, table.createdAt),
  ],
);

/**
 * Which kinds of notification someone wants in the portal. A category with no row is on, so
 * people only store what they have switched off.
 */
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    category: text("category").notNull(),
    inApp: boolean("in_app").default(true).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.category] })],
);

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  subject: text("subject"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
  (table) => [
    index("activity_log_created_idx").on(table.createdAt),
  ],
);

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
