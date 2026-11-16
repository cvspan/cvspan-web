import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import { departments, jobListings, projectMembers, projects, teams, users } from "./schema";
import { tierSql } from "./tier";

const head = alias(users, "head");

/**
 * One row per department with its counts computed in the database, so the page needs a single
 * round trip. Alumni are not counted as headcount.
 */
function overview() {
  return db
    .select({
      id: departments.id,
      name: departments.name,
      slug: departments.slug,
      description: departments.description,
      headId: departments.headId,
      headName: head.name,
      updatedAt: departments.updatedAt,
      headcount: sql<number>`(select count(*)::int from ${users} where ${users.departmentId} = ${departments.id} and ${users.status} <> 'alumni')`,
      teamCount: sql<number>`(select count(*)::int from ${teams} where ${teams.departmentId} = ${departments.id})`,
      activeProjects: sql<number>`(select count(*)::int from ${projects} where ${projects.departmentId} = ${departments.id} and ${projects.status} in ('planning', 'design', 'development'))`,
      openRoles: sql<number>`(select count(*)::int from ${jobListings} where ${jobListings.departmentId} = ${departments.id} and ${jobListings.stage} not in ('draft', 'closed'))`,
    })
    .from(departments)
    .leftJoin(head, eq(departments.headId, head.id));
}

export async function getDepartmentsOverview() {
  return overview().orderBy(asc(departments.name));
}

export async function getDepartmentOverview(id: string) {
  const [row] = await overview().where(eq(departments.id, id)).limit(1);
  return row ?? null;
}

export async function getDepartmentMembers(departmentId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      jobTitle: users.jobTitle,
      role: tierSql(),
      employmentType: users.employmentType,
      status: users.status,
      teamName: teams.name,
      projectCount: sql<number>`(select count(*)::int from ${projectMembers} where ${projectMembers.userId} = ${users.id})`,
    })
    .from(users)
    .leftJoin(teams, eq(users.teamId, teams.id))
    .where(eq(users.departmentId, departmentId))
    .orderBy(asc(users.name));
}

/** Everyone who could be assigned somewhere, with where they currently sit. */
export async function getAssignablePeople() {
  return db
    .select({
      id: users.id,
      name: users.name,
      jobTitle: users.jobTitle,
      departmentId: users.departmentId,
      departmentName: departments.name,
      role: tierSql(),
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .where(sql`${users.status} <> 'alumni' and ${users.status} <> 'suspended'`)
    .orderBy(asc(users.name));
}
