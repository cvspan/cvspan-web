"use server";

import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { departments, jobListings, projects, teams, users } from "@/db/schema";
import { slugify } from "@/lib/slug";
import {
  fail,
  idList,
  ok,
  optionalId,
  optionalText,
  parseForm,
  requiredId,
  requiredText,
  type ActionResult,
} from "@/lib/validation";
import { isUniqueViolation, logActivity, notify, requireRole } from "./guards";

const departmentSchema = z.object({
  name: requiredText("Department name", 80),
  description: optionalText("Description", 500),
});

function refresh(departmentId?: string) {
  revalidatePath("/departments");
  revalidatePath("/people");
  revalidatePath("/careers");
  revalidatePath("/projects");
  if (departmentId) revalidatePath(`/departments/${departmentId}`);
}

export async function createDepartment(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(departmentSchema, formData);
  if (!parsed.success) return fail(parsed.error);

  const slug = slugify(parsed.data.name);
  if (!slug) return fail("Department name must contain letters or numbers.");

  try {
    await db.insert(departments).values({
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    });
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A department with that name already exists.");
    throw error;
  }

  await logActivity(actor.id, "created a department", parsed.data.name);
  refresh();
  return ok;
}

export async function updateDepartment(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(
    departmentSchema.extend({ id: requiredId("department"), headId: optionalId("head") }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { id, name, description, headId } = parsed.data;

  /** A head has to actually work in the department. */
  if (headId) {
    const [member] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, headId), eq(users.departmentId, id)))
      .limit(1);
    if (!member) return fail("The head must be a member of this department.");
  }

  try {
    await db
      .update(departments)
      .set({ name, slug: slugify(name), description, headId, updatedAt: new Date() })
      .where(eq(departments.id, id));
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A department with that name already exists.");
    throw error;
  }

  await logActivity(actor.id, "updated a department", name);
  refresh(id);
  return ok;
}

export async function deleteDepartment(departmentId: string): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);
  if (!department) return fail("That department no longer exists.");

  /** Refuse rather than silently orphan people, projects or live job listings. */
  const [counts] = await db
    .select({
      members: sql<number>`(select count(*)::int from ${users} where ${users.departmentId} = ${departmentId})`,
      projects: sql<number>`(select count(*)::int from ${projects} where ${projects.departmentId} = ${departmentId})`,
      listings: sql<number>`(select count(*)::int from ${jobListings} where ${jobListings.departmentId} = ${departmentId})`,
      teams: sql<number>`(select count(*)::int from ${teams} where ${teams.departmentId} = ${departmentId})`,
    })
    .from(sql`(select 1) as one`);

  const blockers = [
    counts.members && `${counts.members} ${counts.members === 1 ? "member" : "members"}`,
    counts.projects && `${counts.projects} ${counts.projects === 1 ? "project" : "projects"}`,
    counts.listings && `${counts.listings} job ${counts.listings === 1 ? "listing" : "listings"}`,
    counts.teams && `${counts.teams} ${counts.teams === 1 ? "team" : "teams"}`,
  ].filter(Boolean);

  if (blockers.length > 0) {
    return fail(
      `${department.name} still has ${blockers.join(", ")}. Move them elsewhere before deleting it.`,
    );
  }

  await db.delete(departments).where(eq(departments.id, departmentId));
  await logActivity(actor.id, "deleted a department", department.name);
  refresh();
  return ok;
}

/** Moves people into a department. A person has one department, so this is also a transfer. */
export async function assignToDepartment(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(
    z.object({ departmentId: requiredId("department"), userIds: idList("person") }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { departmentId, userIds } = parsed.data;
  if (userIds.length === 0) return fail("Select at least one person.");

  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);
  if (!department) return fail("That department no longer exists.");

  /** Only people who are not already in it get a notification. */
  const moving = await db
    .select({ id: users.id })
    .from(users)
    .where(and(inArray(users.id, userIds), sql`${users.departmentId} is distinct from ${departmentId}`));
  if (moving.length === 0) return fail("Everyone selected is already in this department.");
  const movingIds = moving.map((row) => row.id);

  await db.batch([
    /** A team belongs to one department, so a transfer leaves the old team behind. */
    db
      .update(users)
      .set({ departmentId, teamId: null })
      .where(inArray(users.id, movingIds)),
    /** Anyone who headed their previous department stops heading it. */
    db
      .update(departments)
      .set({ headId: null, updatedAt: new Date() })
      .where(and(inArray(departments.headId, movingIds), ne(departments.id, departmentId))),
  ]);

  await Promise.all(
    movingIds.map((id) =>
      notify(id, `You were added to the ${department.name} department`, "/settings"),
    ),
  );
  await logActivity(
    actor.id,
    `added ${movingIds.length} ${movingIds.length === 1 ? "person" : "people"} to a department`,
    department.name,
  );

  refresh(departmentId);
  return ok;
}

export async function removeFromDepartment(
  departmentId: string,
  userId: string,
): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const [member] = await db
    .select({ name: users.name })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.departmentId, departmentId)))
    .limit(1);
  if (!member) return fail("That person is not in this department.");

  await db.batch([
    db.update(users).set({ departmentId: null, teamId: null }).where(eq(users.id, userId)),
    db
      .update(departments)
      .set({ headId: null, updatedAt: new Date() })
      .where(and(eq(departments.id, departmentId), eq(departments.headId, userId))),
  ]);

  await logActivity(actor.id, "removed a person from a department", member.name);
  refresh(departmentId);
  return ok;
}
