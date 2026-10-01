/**
 * Turns the free-text project names that used to live on tasks into real projects.
 *
 * Non-destructive and safe to re-run: it only inserts projects and members, and sets
 * `tasks.project_id` on tasks that don't have one yet. The legacy `tasks.project` column is left
 * alone; drop it once you're happy with the result.
 *
 *   npm run db:backfill-projects
 */
import { neon } from "@neondatabase/serverless";
import { and, inArray, isNotNull, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { deriveProjectCode } from "../lib/project";
import * as schema from "./schema";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
const { tasks, projects, projectMembers, users } = schema;

/** The value that appears most often, or null for an empty list. */
function mostCommon<T>(values: T[]) {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

async function main() {
  const legacy = await db
    .select()
    .from(tasks)
    .where(and(isNotNull(tasks.project), isNull(tasks.projectId)));

  if (legacy.length === 0) {
    console.log("Nothing to backfill: every task with a project name already has a project.");
    return;
  }

  const people = await db.select().from(users);
  const personById = new Map(people.map((person) => [person.id, person]));

  const existing = await db.select().from(projects);
  const byName = new Map(existing.map((project) => [project.name.toLowerCase(), project]));
  const takenCodes = new Set(existing.map((project) => project.code));

  /** Group by name, ignoring case and stray whitespace. */
  const groups = new Map<string, typeof legacy>();
  for (const task of legacy) {
    const key = task.project!.trim().toLowerCase();
    if (key) groups.set(key, [...(groups.get(key) ?? []), task]);
  }

  for (const [key, groupTasks] of groups) {
    const name = groupTasks[0].project!.trim();
    const taskIds = groupTasks.map((task) => task.id);

    const assigneeIds = groupTasks.flatMap((task) => (task.assigneeId ? [task.assigneeId] : []));
    const creatorIds = groupTasks.flatMap((task) => (task.createdById ? [task.createdById] : []));
    const involved = [...new Set([...assigneeIds, ...creatorIds])].filter((id) => personById.has(id));

    /** Whoever created most of the work is the closest thing to a lead. */
    const leadId = mostCommon(creatorIds.filter((id) => personById.has(id)));
    const departmentId = mostCommon(
      assigneeIds.map((id) => personById.get(id)?.departmentId).filter((id): id is string => Boolean(id)),
    );

    const created = groupTasks.map((task) => task.createdAt).sort((a, b) => +a - +b)[0];
    const dues = groupTasks.flatMap((task) => (task.dueAt ? [task.dueAt] : []));
    const startDate = dateOnly(created);
    const latestDue = dues.length ? dateOnly(new Date(Math.max(...dues.map(Number)))) : null;
    const targetDate = latestDue && latestDue >= startDate ? latestDue : null;

    const allDone = groupTasks.every((task) => task.status === "done");

    const found = byName.get(key);
    const projectId = found?.id ?? crypto.randomUUID();
    const code = found?.code ?? deriveProjectCode(name, takenCodes);
    takenCodes.add(code);

    const memberWrites = involved.length
      ? [
          db
            .insert(projectMembers)
            .values(
              involved.map((userId) => ({
                projectId,
                userId,
                role: userId === leadId ? ("lead" as const) : ("contributor" as const),
              })),
            )
            .onConflictDoNothing(),
        ]
      : [];
    const linkTasks = db.update(tasks).set({ projectId }).where(inArray(tasks.id, taskIds));

    /** One atomic batch per project, so a failure never leaves a half-linked project behind. */
    if (found) {
      await db.batch([linkTasks, ...memberWrites]);
    } else {
      await db.batch([
        db.insert(projects).values({
          id: projectId,
          name,
          code,
          status: allDone ? "completed" : "active",
          departmentId,
          startDate,
          targetDate,
          completedAt: allDone ? new Date() : null,
        }),
        ...memberWrites,
        linkTasks,
      ]);
    }

    console.log(
      `${found ? "Linked to" : "Created"} ${code.padEnd(5)} ${name.padEnd(28)} ${taskIds.length} tasks, ${involved.length} people`,
    );
  }

  console.log("\nDone. The legacy tasks.project column is untouched.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
