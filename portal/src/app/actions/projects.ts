"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ensureManagerAccess, reconcileOrg, refreshOrg } from "./org-sync";
import { atLeast } from "@/lib/roles";
import { batch, db } from "@/db";
import {
  milestones,
  projectMembers,
  projectUpdates,
  projects,
  users,
} from "@/db/schema";
import {
  deriveProjectCode,
  milestoneStatuses,
  projectRoleLabels,
  projectRoles,
  projectStatuses,
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/project";
import { parseProjectLinks } from "@/lib/project-links";
import {
  datesInOrder,
  fail,
  idList,
  ok,
  optionalDate,
  optionalId,
  optionalText,
  parseForm,
  requiredId,
  requiredText,
  type ActionResult,
} from "@/lib/validation";
import {
  isUniqueViolation,
  logActivity,
  notify,
  requireProjectManager,
  requireRole,
} from "./guards";

function refresh(projectId?: string) {
  revalidatePath("/projects");
  revalidatePath("/departments");
  revalidatePath("/tasks");
  revalidatePath("/");
  if (projectId) revalidatePath(`/projects/${projectId}`);
}

async function uniqueCode(name: string) {
  const taken = new Set(
    (await db.select({ code: projects.code }).from(projects)).map((row) => row.code),
  );
  return deriveProjectCode(name, taken);
}

const dateOrderMessage = "The target date can't be before the start date.";

const projectFields = z.object({
  name: requiredText("Project name", 100),
  code: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
    z
      .string()
      .regex(/^([A-Z0-9]{2,8})?$/, "Use 2–8 letters or numbers for the code.")
      .optional(),
  ),
  description: optionalText("Description", 1000),
  departmentId: optionalId("department"),
  status: z.enum(projectStatuses, "Choose a status"),
  startDate: optionalDate("Start date"),
  targetDate: optionalDate("Target date"),
});

export async function createProject(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");

  const parsed = parseForm(
    projectFields.extend({ leadId: optionalId("lead") }).refine(
      (data) => datesInOrder(data.startDate, data.targetDate),
      { message: dateOrderMessage, path: ["targetDate"] },
    ),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { leadId, code, ...values } = parsed.data;

  const links = parseProjectLinks(formData.getAll("linkName").map(String), formData.getAll("linkUrl").map(String));
  if (!links.ok) return fail(links.error);

  /**
   * The project manager runs the people and the schedule, so they need manager access. When an
   * admin picks a member, they become a Manager.
   */
  let promoted = false;
  if (leadId) {
    const access = await ensureManagerAccess(leadId, actor.role);
    if (!access.ok) return fail(access.error);
    promoted = access.promoted;
  }

  const projectId = crypto.randomUUID();
  const finalCode = code || (await uniqueCode(values.name));

  try {
    await batch((db) => [
      db.insert(projects).values({
        id: projectId,
        ...values,
        links: links.links,
        code: finalCode,
        completedAt: values.status === "live" ? new Date() : null,
        createdById: actor.id,
      }),
      ...(leadId
        ? [db.insert(projectMembers).values({ projectId, userId: leadId, role: "lead" })]
        : []),
    ]);
  } catch (error) {
    if (isUniqueViolation(error)) return fail(`The code ${finalCode} is already used by another project.`);
    throw error;
  }

  if (leadId && leadId !== actor.id) {
    await notify(leadId, `You were made project manager of ${values.name}`, `/projects/${projectId}`, "projects");
  }
  await logActivity(actor.id, "created a project", values.name);
  if (leadId) {
    /** Their new project's members, and the manager's own line, follow from this. */
    await reconcileOrg();
    if (promoted) refreshOrg();
  }
  refresh(projectId);
  return ok;
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(
    projectFields.extend({ id: requiredId("project") }).refine(
      (data) => datesInOrder(data.startDate, data.targetDate),
      { message: dateOrderMessage, path: ["targetDate"] },
    ),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { id, code, ...values } = parsed.data;

  /** Admins and this project's manager may edit it. */
  const actor = await requireProjectManager(id);

  const links = parseProjectLinks(formData.getAll("linkName").map(String), formData.getAll("linkUrl").map(String));
  if (!links.ok) return fail(links.error);

  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!existing) return fail("That project no longer exists.");

  try {
    await db
      .update(projects)
      .set({
        ...values,
        links: links.links,
        code: code || existing.code,
        completedAt:
          values.status === "live" ? (existing.completedAt ?? new Date()) : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));
  } catch (error) {
    if (isUniqueViolation(error)) return fail("That code is already used by another project.");
    throw error;
  }

  await logActivity(actor.id, "updated a project", values.name);
  refresh(id);
  return ok;
}

/** Moves a project along its lifecycle. Available to admins and the project manager. */
export async function setProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<ActionResult> {
  const actor = await requireProjectManager(projectId);
  if (!projectStatuses.includes(status)) return fail("Unknown status.");

  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!existing) return fail("That project no longer exists.");

  await db
    .update(projects)
    .set({
      status,
      completedAt: status === "live" ? (existing.completedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));

  await logActivity(actor.id, `marked a project ${projectStatusLabels[status].toLowerCase()}`, existing.name);
  refresh(projectId);
  return ok;
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const actor = await requireRole("hr");

  const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!existing) return fail("That project no longer exists.");

  /** Milestones, members and updates go with it; its tasks stay, just detached. */
  await db.delete(projects).where(eq(projects.id, projectId));
  await logActivity(actor.id, "deleted a project", existing.name);
  refresh();
  return ok;
}

/* ------------------------------------------------------------------- Team */

export async function addProjectMembers(formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(
    z.object({
      projectId: requiredId("project"),
      userIds: idList("person"),
      role: z.enum(projectRoles, "Choose a role"),
    }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { projectId, userIds, role } = parsed.data;
  if (userIds.length === 0) return fail("Select at least one person.");

  const actor = await requireProjectManager(projectId);

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project) return fail("That project no longer exists.");

  /** A project manager needs manager access: an admin can promote a member, a project manager can't. */
  let promotedAny = false;
  if (role === "lead") {
    for (const id of userIds) {
      const access = await ensureManagerAccess(id, actor.role);
      if (!access.ok) return fail(access.error);
      promotedAny ||= access.promoted;
    }
  }

  const existing = await db
    .select({ userId: projectMembers.userId })
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), inArray(projectMembers.userId, userIds)));
  const already = new Set(existing.map((row) => row.userId));
  const added = userIds.filter((id) => !already.has(id));
  if (added.length === 0) return fail("Everyone selected is already on this project.");

  await db
    .insert(projectMembers)
    .values(added.map((userId) => ({ projectId, userId, role })))
    .onConflictDoNothing();

  await Promise.all(
    added
      .filter((id) => id !== actor.id)
      .map((id) => notify(id, `You were added to ${project.name}`, `/projects/${projectId}`, "projects")),
  );
  await logActivity(
    actor.id,
    `added ${added.length} ${added.length === 1 ? "person" : "people"} to a project`,
    project.name,
  );
  /** Newcomers with no manager report to this project's manager. */
  await reconcileOrg();
  if (promotedAny) refreshOrg();
  refresh(projectId);
  return ok;
}

export async function setProjectMemberRole(
  projectId: string,
  userId: string,
  role: (typeof projectRoles)[number],
): Promise<ActionResult> {
  const actor = await requireProjectManager(projectId);
  if (!projectRoles.includes(role)) return fail("Unknown role.");

  /** A project manager can't demote themselves out of the project; an admin can reassign it. */
  if (userId === actor.id && !atLeast(actor.role, "hr") && role !== "lead") {
    return fail("Ask an admin to change your own role on this project.");
  }

  let promoted = false;
  if (role === "lead") {
    const access = await ensureManagerAccess(userId, actor.role);
    if (!access.ok) return fail(access.error);
    promoted = access.promoted;
  }

  await db
    .update(projectMembers)
    .set({ role })
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));

  await logActivity(actor.id, "changed a project role", projectRoleLabels[role]);
  if (role === "lead") {
    await reconcileOrg();
    if (promoted) refreshOrg();
  }
  refresh(projectId);
  return ok;
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<ActionResult> {
  const actor = await requireProjectManager(projectId);

  if (userId === actor.id && !atLeast(actor.role, "hr")) {
    return fail("Ask an admin to take you off this project.");
  }

  const [member] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));

  await logActivity(actor.id, "removed a person from a project", member?.name);
  refresh(projectId);
  return ok;
}

/* ------------------------------------------------------------- Milestones */

const milestoneSchema = z
  .object({
    id: optionalId("milestone"),
    projectId: requiredId("project"),
    title: requiredText("Milestone title", 120),
    description: optionalText("Description", 500),
    startDate: optionalDate("Start date"),
    dueDate: z.iso.date("Due date must be a valid date"),
    status: z.enum(milestoneStatuses, "Choose a status"),
  })
  .refine((data) => datesInOrder(data.startDate, data.dueDate), {
    message: "The due date can't be before the start date.",
    path: ["dueDate"],
  });

export async function saveMilestone(formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(milestoneSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { id, projectId, ...values } = parsed.data;

  const actor = await requireProjectManager(projectId);

  const completedAt = values.status === "done" ? new Date() : null;

  if (id) {
    /** Scoped to the project, so a forged id can't edit another project's milestone. */
    await db
      .update(milestones)
      .set({ ...values, completedAt })
      .where(and(eq(milestones.id, id), eq(milestones.projectId, projectId)));
  } else {
    await db.insert(milestones).values({ projectId, ...values, completedAt });
  }

  await logActivity(actor.id, id ? "updated a milestone" : "added a milestone", values.title);
  refresh(projectId);
  return ok;
}

export async function setMilestoneStatus(
  milestoneId: string,
  status: (typeof milestoneStatuses)[number],
): Promise<ActionResult> {
  if (!milestoneStatuses.includes(status)) return fail("Unknown status.");

  const [milestone] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
    .limit(1);
  if (!milestone) return fail("That milestone no longer exists.");

  const actor = await requireProjectManager(milestone.projectId);

  await db
    .update(milestones)
    .set({ status, completedAt: status === "done" ? new Date() : null })
    .where(eq(milestones.id, milestoneId));

  await logActivity(actor.id, `marked a milestone ${status.replace("_", " ")}`, milestone.title);
  refresh(milestone.projectId);
  return ok;
}

export async function deleteMilestone(milestoneId: string): Promise<ActionResult> {
  const [milestone] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
    .limit(1);
  if (!milestone) return fail("That milestone no longer exists.");

  const actor = await requireProjectManager(milestone.projectId);

  /** Its tasks stay on the project and simply lose their milestone. */
  await db.delete(milestones).where(eq(milestones.id, milestoneId));
  await logActivity(actor.id, "deleted a milestone", milestone.title);
  refresh(milestone.projectId);
  return ok;
}

/* --------------------------------------------------------- Status updates */

export async function postProjectUpdate(formData: FormData): Promise<ActionResult> {
  const parsed = parseForm(
    z.object({
      projectId: requiredId("project"),
      health: z.enum(["on_track", "at_risk", "off_track"], "Choose how the project is going"),
      body: requiredText("Update", 1500),
    }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);

  const actor = await requireProjectManager(parsed.data.projectId);

  await db.insert(projectUpdates).values({ ...parsed.data, authorId: actor.id });
  await logActivity(actor.id, "posted a project update");
  refresh(parsed.data.projectId);
  return ok;
}
