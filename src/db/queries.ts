import "server-only";
import { and, asc, count, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "./index";
import {
  applications,
  approvals,
  assignments,
  attendance,
  blogPosts,
  certificates,
  departments,
  enrolments,
  jobListings,
  kpiScores,
  leaveRequests,
  messages,
  notifications,
  programmes,
  submissions,
  tasks,
  threadMembers,
  threads,
  users,
  activityLog,
} from "./schema";

/* ------------------------------------------------------------------ People */

export async function getPeople() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      jobTitle: users.jobTitle,
      role: users.role,
      employmentType: users.employmentType,
      status: users.status,
      startDate: users.startDate,
      department: departments.name,
      managerId: users.managerId,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .orderBy(asc(users.name));
}

export async function getUserById(id: string) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function getDirectReports(managerId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      jobTitle: users.jobTitle,
      employmentType: users.employmentType,
      status: users.status,
      startDate: users.startDate,
    })
    .from(users)
    .where(eq(users.managerId, managerId))
    .orderBy(asc(users.name));
}

export async function getDepartmentSummary() {
  const rows = await db
    .select({
      name: departments.name,
      headcount: count(users.id),
    })
    .from(departments)
    .leftJoin(users, eq(users.departmentId, departments.id))
    .groupBy(departments.id, departments.name)
    .orderBy(asc(departments.name));

  const openRoles = await db
    .select({ departmentId: jobListings.departmentId, open: count() })
    .from(jobListings)
    .where(sql`${jobListings.stage} <> 'closed' and ${jobListings.stage} <> 'draft'`)
    .groupBy(jobListings.departmentId);

  const departmentRows = await db.select().from(departments);
  const openByName = new Map(
    openRoles.map((row) => [
      departmentRows.find((department) => department.id === row.departmentId)?.name ?? "",
      Number(row.open),
    ]),
  );

  return rows.map((row) => ({
    ...row,
    headcount: Number(row.headcount),
    openRoles: openByName.get(row.name) ?? 0,
  }));
}

export async function getHeadcountByType() {
  const rows = await db
    .select({ type: users.employmentType, total: count() })
    .from(users)
    .groupBy(users.employmentType);
  return rows.map((row) => ({ type: row.type, count: Number(row.total) }));
}

/* -------------------------------------------------------------------- Work */

export async function getTasksFor(userId: string) {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      project: tasks.project,
      status: tasks.status,
      priority: tasks.priority,
      dueAt: tasks.dueAt,
      completedAt: tasks.completedAt,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.assigneeId, userId))
    .orderBy(asc(tasks.dueAt));
}

export async function getAllTasks() {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      project: tasks.project,
      status: tasks.status,
      priority: tasks.priority,
      dueAt: tasks.dueAt,
      completedAt: tasks.completedAt,
      assigneeName: users.name,
      assigneeId: tasks.assigneeId,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .orderBy(asc(tasks.dueAt));
}

export async function getTasksForTeam(managerId: string) {
  const reports = await getDirectReports(managerId);
  const ids = reports.map((report) => report.id);
  if (ids.length === 0) return [];
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      project: tasks.project,
      status: tasks.status,
      priority: tasks.priority,
      dueAt: tasks.dueAt,
      assigneeName: users.name,
      assigneeId: tasks.assigneeId,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(inArray(tasks.assigneeId, ids))
    .orderBy(asc(tasks.dueAt));
}

/* -------------------------------------------------------------- Attendance */

export async function getAttendanceFor(userId: string, limit = 10) {
  return db
    .select()
    .from(attendance)
    .where(eq(attendance.userId, userId))
    .orderBy(desc(attendance.day))
    .limit(limit);
}

export async function getAttendanceRate(userId: string) {
  const rows = await db.select().from(attendance).where(eq(attendance.userId, userId));
  if (rows.length === 0) return 0;
  const present = rows.filter((row) => row.kind === "on_site" || row.kind === "remote").length;
  return Math.round((present / rows.length) * 100);
}

export async function getLeaveFor(userId: string) {
  return db
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, userId))
    .orderBy(desc(leaveRequests.createdAt));
}

export async function getPendingLeave() {
  return db
    .select({
      id: leaveRequests.id,
      type: leaveRequests.type,
      startDate: leaveRequests.startDate,
      endDate: leaveRequests.endDate,
      days: leaveRequests.days,
      status: leaveRequests.status,
      person: users.name,
    })
    .from(leaveRequests)
    .leftJoin(users, eq(leaveRequests.userId, users.id))
    .orderBy(desc(leaveRequests.createdAt));
}

/* ------------------------------------------------------------- Performance */

export async function getKpiTrend(userId: string) {
  return db
    .select({ periodStart: kpiScores.periodStart, score: kpiScores.score })
    .from(kpiScores)
    .where(eq(kpiScores.userId, userId))
    .orderBy(asc(kpiScores.periodStart));
}

export async function getKpiHistory(userId: string) {
  return db
    .select({
      id: kpiScores.id,
      periodStart: kpiScores.periodStart,
      score: kpiScores.score,
      comment: kpiScores.comment,
      gradedBy: users.name,
    })
    .from(kpiScores)
    .leftJoin(users, eq(kpiScores.gradedById, users.id))
    .where(eq(kpiScores.userId, userId))
    .orderBy(desc(kpiScores.periodStart));
}

export async function getLatestKpi(userId: string) {
  const [row] = await db
    .select({ score: kpiScores.score, periodStart: kpiScores.periodStart })
    .from(kpiScores)
    .where(eq(kpiScores.userId, userId))
    .orderBy(desc(kpiScores.periodStart))
    .limit(1);
  return row ?? null;
}

export async function getTeamKpiAverage(managerId: string) {
  const reports = await getDirectReports(managerId);
  if (reports.length === 0) return 0;
  const scores = await Promise.all(reports.map((report) => getLatestKpi(report.id)));
  const values = scores.filter(Boolean).map((row) => row!.score);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/* -------------------------------------------------------------- Programmes */

export async function getProgrammes() {
  const rows = await db
    .select({
      id: programmes.id,
      name: programmes.name,
      stage: programmes.stage,
      endDate: programmes.endDate,
      members: count(enrolments.id),
      progress: sql<number>`coalesce(round(avg(${enrolments.progress})), 0)`,
    })
    .from(programmes)
    .leftJoin(enrolments, eq(enrolments.programmeId, programmes.id))
    .groupBy(programmes.id)
    .orderBy(asc(programmes.name));

  return rows.map((row) => ({
    ...row,
    members: Number(row.members),
    progress: Number(row.progress),
  }));
}

/** Only assignments from programmes the person is enrolled on. */
export async function getAssignmentsFor(userId: string) {
  const rows = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      dueAt: assignments.dueAt,
      status: submissions.status,
      grade: submissions.grade,
    })
    .from(enrolments)
    .innerJoin(assignments, eq(assignments.programmeId, enrolments.programmeId))
    .leftJoin(
      submissions,
      and(eq(submissions.assignmentId, assignments.id), eq(submissions.userId, userId)),
    )
    .where(eq(enrolments.userId, userId))
    .orderBy(asc(assignments.weekNumber));

  return rows.map((row) => ({ ...row, status: row.status ?? ("not_started" as const) }));
}

export async function getCertificates() {
  return db
    .select({
      id: certificates.id,
      reference: certificates.reference,
      issuedAt: certificates.issuedAt,
      person: users.name,
      programme: programmes.name,
    })
    .from(certificates)
    .leftJoin(users, eq(certificates.userId, users.id))
    .leftJoin(programmes, eq(certificates.programmeId, programmes.id))
    .orderBy(desc(certificates.issuedAt));
}

/* --------------------------------------------------------------- Messaging */

export async function getThreadsFor(userId: string) {
  const memberships = await db
    .select({ threadId: threadMembers.threadId })
    .from(threadMembers)
    .where(eq(threadMembers.userId, userId));

  const ids = memberships.map((row) => row.threadId);
  if (ids.length === 0) return [];

  const rows = await db.select().from(threads).where(inArray(threads.id, ids));

  /** One pass over this person's messages beats a correlated subquery per thread. */
  const recent = await db
    .select({
      threadId: messages.threadId,
      body: messages.body,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(inArray(messages.threadId, ids))
    .orderBy(desc(messages.createdAt));

  const latest = new Map<string, { body: string; createdAt: Date }>();
  for (const message of recent) {
    if (!latest.has(message.threadId)) {
      latest.set(message.threadId, { body: message.body, createdAt: message.createdAt });
    }
  }

  return rows
    .map((thread) => ({
      id: thread.id,
      name: thread.name,
      lastMessage: latest.get(thread.id)?.body ?? null,
      lastAt: latest.get(thread.id)?.createdAt ?? null,
    }))
    .sort((a, b) => (b.lastAt?.getTime() ?? 0) - (a.lastAt?.getTime() ?? 0));
}

export async function getMessages(threadId: string) {
  return db
    .select({
      id: messages.id,
      body: messages.body,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.threadId, threadId))
    .orderBy(asc(messages.createdAt));
}

/* ----------------------------------------------------------------- Website */

export async function getBlogPosts() {
  return db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      category: blogPosts.category,
      status: blogPosts.status,
      updatedAt: blogPosts.updatedAt,
      author: users.name,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .orderBy(desc(blogPosts.updatedAt));
}

export async function getJobListings() {
  const rows = await db
    .select({
      id: jobListings.id,
      title: jobListings.title,
      employmentType: jobListings.employmentType,
      stage: jobListings.stage,
      postedAt: jobListings.postedAt,
      department: departments.name,
      applicants: count(applications.id),
    })
    .from(jobListings)
    .leftJoin(departments, eq(jobListings.departmentId, departments.id))
    .leftJoin(applications, eq(applications.jobId, jobListings.id))
    .groupBy(jobListings.id, departments.name)
    .orderBy(desc(jobListings.postedAt));

  return rows.map((row) => ({ ...row, applicants: Number(row.applicants) }));
}

export async function getHiringPipeline() {
  const rows = await db
    .select({ stage: applications.stage, total: count() })
    .from(applications)
    .groupBy(applications.stage);

  const order = ["applied", "screening", "interview", "offer", "hired"] as const;
  return order.map((stage) => ({
    stage,
    count: Number(rows.find((row) => row.stage === stage)?.total ?? 0),
  }));
}

/* ----------------------------------------------------- Approvals and alerts */

export async function getApprovalsFor(userId: string) {
  return db
    .select({
      id: approvals.id,
      kind: approvals.kind,
      detail: approvals.detail,
      createdAt: approvals.createdAt,
      requestedBy: users.name,
    })
    .from(approvals)
    .leftJoin(users, eq(approvals.requestedById, users.id))
    .where(and(eq(approvals.assignedToId, userId), isNull(approvals.resolvedAt)))
    .orderBy(desc(approvals.createdAt));
}

export async function getOpenApprovals() {
  return db
    .select({
      id: approvals.id,
      kind: approvals.kind,
      detail: approvals.detail,
      createdAt: approvals.createdAt,
      requestedBy: users.name,
    })
    .from(approvals)
    .leftJoin(users, eq(approvals.requestedById, users.id))
    .where(isNull(approvals.resolvedAt))
    .orderBy(desc(approvals.createdAt));
}

export async function getNotificationsFor(userId: string, limit = 8) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return Number(row?.total ?? 0);
}

export async function getRecentActivity(limit = 8) {
  return db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      subject: activityLog.subject,
      createdAt: activityLog.createdAt,
      actor: users.name,
    })
    .from(activityLog)
    .leftJoin(users, eq(activityLog.actorId, users.id))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}

/* ----------------------------------------------------------------- Counters */

export async function getOrgCounts() {
  const [people] = await db.select({ total: count() }).from(users);
  const [open] = await db
    .select({ total: count() })
    .from(jobListings)
    .where(sql`${jobListings.stage} not in ('draft','closed')`);
  const [applicants] = await db.select({ total: count() }).from(applications);
  const [activeProgrammes] = await db
    .select({ total: count() })
    .from(programmes)
    .where(gte(programmes.endDate, new Date().toISOString().slice(0, 10)));

  return {
    people: Number(people?.total ?? 0),
    openRoles: Number(open?.total ?? 0),
    applicants: Number(applicants?.total ?? 0),
    programmes: Number(activeProgrammes?.total ?? 0),
  };
}
