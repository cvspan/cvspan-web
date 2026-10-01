import "server-only";
import { and, asc, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { db } from "./index";
import {
  departments,
  milestones,
  projectMembers,
  projectUpdates,
  projects,
  tasks,
  users,
} from "./schema";

/**
 * The aggregates every project row needs. They are correlated subqueries rather than joins, so
 * a project with many tasks and many members never multiplies its own rows.
 */
function summary() {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      code: projects.code,
      description: projects.description,
      status: projects.status,
      departmentId: projects.departmentId,
      departmentName: departments.name,
      startDate: projects.startDate,
      targetDate: projects.targetDate,
      links: projects.links,
      completedAt: projects.completedAt,
      updatedAt: projects.updatedAt,
      leadId: sql<string | null>`(select ${projectMembers.userId} from ${projectMembers} where ${projectMembers.projectId} = ${projects.id} and ${projectMembers.role} = 'lead' order by ${projectMembers.createdAt} limit 1)`,
      leadName: sql<string | null>`(select ${users.name} from ${projectMembers} join ${users} on ${users.id} = ${projectMembers.userId} where ${projectMembers.projectId} = ${projects.id} and ${projectMembers.role} = 'lead' order by ${projectMembers.createdAt} limit 1)`,
      memberCount: sql<number>`(select count(*)::int from ${projectMembers} where ${projectMembers.projectId} = ${projects.id})`,
      tasksTotal: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projects.id})`,
      tasksDone: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projects.id} and ${tasks.status} = 'done')`,
      overdueTasks: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projects.id} and ${tasks.status} <> 'done' and ${tasks.dueAt} < now())`,
      milestonesTotal: sql<number>`(select count(*)::int from ${milestones} where ${milestones.projectId} = ${projects.id})`,
      milestonesDone: sql<number>`(select count(*)::int from ${milestones} where ${milestones.projectId} = ${projects.id} and ${milestones.status} = 'done')`,
      overdueMilestones: sql<number>`(select count(*)::int from ${milestones} where ${milestones.projectId} = ${projects.id} and ${milestones.status} <> 'done' and ${milestones.dueDate} < current_date)`,
    })
    .from(projects)
    .leftJoin(departments, eq(projects.departmentId, departments.id));
}

export type ProjectSummary = Awaited<ReturnType<typeof getProjects>>[number];

/** Active work first, then by nearest deadline, so the list reads in order of urgency. */
const urgency = sql`case ${projects.status} when 'development' then 0 when 'design' then 1 when 'planning' then 2 when 'not_started' then 3 when 'on_hold' then 4 when 'live' then 5 else 6 end`;

export async function getProjects(filter: { memberUserId?: string; departmentId?: string } = {}) {
  const conditions: SQL[] = [];

  if (filter.memberUserId) {
    conditions.push(
      sql`exists (select 1 from ${projectMembers} where ${projectMembers.projectId} = ${projects.id} and ${projectMembers.userId} = ${filter.memberUserId})`,
    );
  }
  if (filter.departmentId) conditions.push(eq(projects.departmentId, filter.departmentId));

  return summary()
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(urgency, sql`${projects.targetDate} asc nulls last`, asc(projects.name));
}

export async function getProject(id: string) {
  const [row] = await summary().where(eq(projects.id, id)).limit(1);
  return row ?? null;
}

/** Avatars for the list view, fetched once for every project on the page. */
export async function getMembersForProjects(projectIds: string[]) {
  if (projectIds.length === 0) return new Map<string, { id: string; name: string }[]>();

  const rows = await db
    .select({ projectId: projectMembers.projectId, id: users.id, name: users.name })
    .from(projectMembers)
    .innerJoin(users, eq(users.id, projectMembers.userId))
    .where(inArray(projectMembers.projectId, projectIds))
    .orderBy(asc(projectMembers.role), asc(users.name));

  const byProject = new Map<string, { id: string; name: string }[]>();
  for (const row of rows) {
    byProject.set(row.projectId, [...(byProject.get(row.projectId) ?? []), { id: row.id, name: row.name }]);
  }
  return byProject;
}

export async function getProjectMembers(projectId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      jobTitle: users.jobTitle,
      departmentName: departments.name,
      userRole: users.role,
      role: projectMembers.role,
      openTasks: sql<number>`(select count(*)::int from ${tasks} where ${tasks.projectId} = ${projectId} and ${tasks.assigneeId} = ${users.id} and ${tasks.status} <> 'done')`,
    })
    .from(projectMembers)
    .innerJoin(users, eq(users.id, projectMembers.userId))
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(
      sql`case ${projectMembers.role} when 'lead' then 0 when 'contributor' then 1 else 2 end`,
      asc(users.name),
    );
}

export async function getMilestones(projectId: string) {
  return db
    .select({
      id: milestones.id,
      title: milestones.title,
      description: milestones.description,
      startDate: milestones.startDate,
      dueDate: milestones.dueDate,
      status: milestones.status,
      completedAt: milestones.completedAt,
      tasksTotal: sql<number>`(select count(*)::int from ${tasks} where ${tasks.milestoneId} = ${milestones.id})`,
      tasksDone: sql<number>`(select count(*)::int from ${tasks} where ${tasks.milestoneId} = ${milestones.id} and ${tasks.status} = 'done')`,
    })
    .from(milestones)
    .where(eq(milestones.projectId, projectId))
    .orderBy(asc(milestones.dueDate), asc(milestones.createdAt));
}

export async function getProjectTasks(projectId: string) {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      dueAt: tasks.dueAt,
      assigneeId: tasks.assigneeId,
      assigneeName: users.name,
      milestoneId: tasks.milestoneId,
      milestoneTitle: milestones.title,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .leftJoin(milestones, eq(tasks.milestoneId, milestones.id))
    .where(eq(tasks.projectId, projectId))
    .orderBy(sql`${tasks.status} = 'done'`, asc(tasks.dueAt));
}

export async function getProjectUpdates(projectId: string, limit = 10) {
  return db
    .select({
      id: projectUpdates.id,
      body: projectUpdates.body,
      health: projectUpdates.health,
      createdAt: projectUpdates.createdAt,
      authorName: users.name,
    })
    .from(projectUpdates)
    .leftJoin(users, eq(projectUpdates.authorId, users.id))
    .where(eq(projectUpdates.projectId, projectId))
    .orderBy(desc(projectUpdates.createdAt))
    .limit(limit);
}

/** Open projects a person can attach a task to. Admins pass no user and see all of them. */
export async function getProjectOptions(memberUserId?: string) {
  return db
    .select({ id: projects.id, name: projects.name, code: projects.code })
    .from(projects)
    .where(
      and(
        inArray(projects.status, ["not_started", "planning", "design", "development", "on_hold"]),
        memberUserId
          ? sql`exists (select 1 from ${projectMembers} where ${projectMembers.projectId} = ${projects.id} and ${projectMembers.userId} = ${memberUserId})`
          : undefined,
      ),
    )
    .orderBy(asc(projects.name));
}

/** The projects one person is on, with their role in each. */
export async function getProjectsForPerson(userId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      code: projects.code,
      status: projects.status,
      role: projectMembers.role,
      targetDate: projects.targetDate,
    })
    .from(projectMembers)
    .innerJoin(projects, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, userId))
    .orderBy(asc(projects.name));
}

export async function getProjectRole(projectId: string, userId: string) {
  const [row] = await db
    .select({ role: projectMembers.role })
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
    .limit(1);
  return row?.role ?? null;
}
