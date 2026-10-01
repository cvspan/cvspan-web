import { and, asc, eq, ilike, inArray, notInArray, or, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogPosts, departments, projectMembers, projects, tasks, users } from "@/db/schema";
import { atLeast } from "@/lib/roles";

type Item = { id: string; title: string; detail?: string; href: string };
type Group = { label: string; items: Item[] };

const LIMIT = 5;

/**
 * Global search. Results are scoped to what the person could open from the sidebar anyway:
 * people only for managers and above, tasks limited to their own (and their team's), projects
 * they are on, and the website and departments for admins.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ groups: [] }, { status: 401 });

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return Response.json({ groups: [] });

  /** The database is the truth for role and status, not the session token. */
  const [account] = await db
    .select({ role: users.role, status: users.status })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!account || (account.status !== "active" && account.status !== "invited")) {
    return Response.json({ groups: [] }, { status: 401 });
  }

  const me = session.user.id;
  const role = account.role;
  /** Escape LIKE wildcards so "100%" means 100%. */
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;

  const isAdmin = atLeast(role, "admin");

  /** The lookups don't depend on each other, so they run together: one round trip, not five. */
  const taskScope = isAdmin
    ? undefined
    : atLeast(role, "manager")
      ? or(eq(tasks.assigneeId, me), inArray(tasks.assigneeId, db.select({ id: users.id }).from(users).where(eq(users.managerId, me))))
      : eq(tasks.assigneeId, me);

  const [peopleRows, taskRows, projectRows, departmentRows, postRows] = await Promise.all([
    atLeast(role, "manager")
      ? db
          .select({ id: users.id, name: users.name, jobTitle: users.jobTitle, email: users.email })
          .from(users)
          .where(
            and(
              notInArray(users.status, ["alumni", "suspended"]),
              or(ilike(users.name, pattern), ilike(users.email, pattern), ilike(users.jobTitle, pattern)),
            ),
          )
          .orderBy(asc(users.name))
          .limit(LIMIT)
      : Promise.resolve([]),
    db
      .select({ id: tasks.id, title: tasks.title, projectId: tasks.projectId, assignee: users.name })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(ilike(tasks.title, pattern), taskScope))
      .orderBy(asc(tasks.dueAt))
      .limit(LIMIT),
    db
      .select({ id: projects.id, name: projects.name, code: projects.code })
      .from(projects)
      .where(
        and(
          or(ilike(projects.name, pattern), ilike(projects.code, pattern)),
          isAdmin
            ? undefined
            : sql`exists (select 1 from ${projectMembers} where ${projectMembers.projectId} = ${projects.id} and ${projectMembers.userId} = ${me})`,
        ),
      )
      .orderBy(asc(projects.name))
      .limit(LIMIT),
    isAdmin
      ? db
          .select({ id: departments.id, name: departments.name })
          .from(departments)
          .where(ilike(departments.name, pattern))
          .orderBy(asc(departments.name))
          .limit(LIMIT)
      : Promise.resolve([]),
    isAdmin
      ? db
          .select({ id: blogPosts.id, title: blogPosts.title, status: blogPosts.status })
          .from(blogPosts)
          .where(ilike(blogPosts.title, pattern))
          .limit(LIMIT)
      : Promise.resolve([]),
  ]);

  const groups: Group[] = [
    {
      label: "People",
      items: peopleRows.map((row) => ({ id: row.id, title: row.name, detail: row.jobTitle ?? row.email, href: `/people/${row.id}` })),
    },
    {
      label: "Tasks",
      items: taskRows.map((row) => ({
        id: row.id,
        title: row.title,
        detail: row.assignee ?? undefined,
        href: row.projectId ? `/projects/${row.projectId}` : "/tasks",
      })),
    },
    {
      label: "Projects",
      items: projectRows.map((row) => ({ id: row.id, title: row.name, detail: row.code, href: `/projects/${row.id}` })),
    },
    {
      label: "Departments",
      items: departmentRows.map((row) => ({ id: row.id, title: row.name, href: `/departments/${row.id}` })),
    },
    {
      label: "Blog posts",
      items: postRows.map((row) => ({ id: row.id, title: row.title, detail: row.status, href: `/blog/${row.id}` })),
    },
  ];

  return Response.json({ groups: groups.filter((group) => group.items.length > 0) });
}
