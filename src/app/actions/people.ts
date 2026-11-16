"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { departments, users } from "@/db/schema";
import { ACCESS_LEVELS, ENGAGEMENTS, accessSummary, atLeast, roleLabels, tierOf, type AccessLevel } from "@/lib/roles";
import { z } from "zod";
import { logActivity, notify, requireRole } from "./guards";
import { reconcileOrg, refreshOrg } from "./org-sync";
import type { EmploymentType } from "@/lib/format";
import { defaultInternshipEnd } from "@/lib/grading";
import { defaultLevelForRole } from "@/lib/org";
import {
  datesInOrder,
  fail,
  ok,
  optionalDate,
  optionalText,
  parseForm,
  requiredId,
  requiredText,
  type ActionResult,
} from "@/lib/validation";

export async function inviteMember(formData: FormData) {
  const user = await requireRole("hr");

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !name) return;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return;

  const departmentName = String(formData.get("department") ?? "");
  const [department] = departmentName
    ? await db.select().from(departments).where(eq(departments.name, departmentName)).limit(1)
    : [];

  /**
   * Employee is the default. Only a super admin makes an Admin; HR is given by an admin; Management by HR.
   * The two functions only apply to employees.
   */
  const access: AccessLevel = formData.get("access") === "admin" && user.role === "super_admin" ? "admin" : "employee";
  const isHr = access === "employee" && formData.get("isHr") === "1" && atLeast(user.role, "admin");
  const isManagement = access === "employee" && formData.get("isManagement") === "1";
  const inviteTier = tierOf({ role: access, isHr, isManagement });
  const requested = String(formData.get("employmentType") ?? "full_time");
  const employmentType = (ENGAGEMENTS as readonly string[]).includes(requested) ? (requested as EmploymentType) : "full_time";
  const startDate = String(formData.get("startDate") ?? "") || null;

  /** Internships run for six months unless an end date is given. */
  const endDate =
    String(formData.get("endDate") ?? "") ||
    (employmentType === "internship" && startDate ? defaultInternshipEnd(startDate) : null);

  await db.insert(users).values({
    email,
    name,
    jobTitle: String(formData.get("jobTitle") ?? "").trim() || null,
    role: access,
    isHr,
    isManagement,
    orgLevel: defaultLevelForRole(inviteTier),
    employmentType,
    status: "invited",
    departmentId: department?.id ?? null,
    managerId: String(formData.get("managerId") ?? "") || null,
    startDate,
    endDate,
  });

  await logActivity(user.id, "invited a new member", name);
  /** A new member with no manager reports to their department head. */
  await reconcileOrg();
  refreshOrg();
  revalidatePath("/people");
  revalidatePath("/");
}

const detailsSchema = z.object({
  userId: requiredId("person"),
  name: requiredText("Full name"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  jobTitle: optionalText("Job title", 120),
});

/**
 * Name, work email and job title are set by an admin: people can't change their own, so what the
 * portal, the org chart and certificates show about someone is what HR recorded.
 */
export async function updateMemberDetails(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");

  const parsed = parseForm(detailsSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, name, email, jobTitle } = parsed.data;

  const [target] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);
  if (!target) return fail("That person no longer exists.");

  const [taken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, userId)))
    .limit(1);
  if (taken) return fail("Someone else already uses that email address.");

  await db.update(users).set({ name, email, jobTitle }).where(eq(users.id, userId));
  await logActivity(actor.id, "updated a member's details", name);

  revalidatePath("/people");
  revalidatePath(`/people/${userId}`);
  revalidatePath("/", "layout");
  return ok;
}

/** A tick box that sends "0" first, so an unticked box still says so. */
const flag = z.preprocess((value) => (Array.isArray(value) ? value.includes("1") : value === "1"), z.boolean());

const accessSchema = z.object({
  userId: requiredId("person"),
  access: z.enum(ACCESS_LEVELS, "Choose an access level"),
  isHr: flag,
  isManagement: flag,
  status: z.enum(["active", "suspended", "alumni"], "Choose a status"),
});

/**
 * Changes someone's access, their functions and whether they can sign in.
 *   - Super admins are the only ones who can make or change an Admin or Super admin.
 *   - Admins give and take away HR; HR (and above) give and take away Management.
 *   - HR can suspend people or move them to alumni, but not other HR (that's for an admin) or admins.
 * Two safeguards keep the portal reachable: nobody changes their own access, and the last active
 * super admin can't be demoted or suspended.
 */
export async function updateAccess(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");

  const parsed = parseForm(accessSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, status } = parsed.data;

  if (userId === actor.id) return fail("You can't change your own access. Ask another admin.");

  const [target] = await db
    .select({
      name: users.name,
      role: users.role,
      isHr: users.isHr,
      isManagement: users.isManagement,
      status: users.status,
      orgLevel: users.orgLevel,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) return fail("That person no longer exists.");

  /** Admin and Super admin have all of HR's and Management's powers already, so the switches only mean something for employees. */
  const access = parsed.data.access;
  const isHr = access === "employee" && parsed.data.isHr;
  const isManagement = access === "employee" && parsed.data.isManagement;

  const accessChanged = access !== target.role;
  const hrChanged = isHr !== target.isHr;
  const managementChanged = isManagement !== target.isManagement;
  /** "invited" isn't something an admin sets, so leaving it alone counts as unchanged. */
  const statusChanged = status !== target.status && !(target.status === "invited" && status === "active");

  if (!accessChanged && !hrChanged && !managementChanged && !statusChanged) return fail("Nothing to change.");
  if (target.role !== "employee" && actor.role !== "super_admin") {
    return fail("Only a super admin can change an Admin or Super admin.");
  }
  if (accessChanged && actor.role !== "super_admin") return fail("Only a super admin can make someone an Admin.");
  if ((hrChanged || (target.isHr && statusChanged)) && !atLeast(actor.role, "admin")) {
    return fail("Only an admin can change someone in HR.");
  }

  /** Would this leave the portal without an active super admin? */
  const losesSuperAdmin =
    target.role === "super_admin" && ((accessChanged && access !== "super_admin") || (statusChanged && status !== "active"));
  if (losesSuperAdmin) {
    const [others] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(users)
      .where(and(eq(users.role, "super_admin"), eq(users.status, "active"), ne(users.id, userId)));
    if (!others || others.n === 0) return fail("There has to be at least one active super admin.");
  }

  const before = tierOf(target);
  const after = tierOf({ role: access, isHr, isManagement });
  const tierChanged = before !== after;

  /** The org level follows the new tier, except for the CEO, who is chosen on the org chart. */
  await db
    .update(users)
    .set({
      ...(accessChanged ? { role: access } : {}),
      isHr,
      isManagement,
      ...(tierChanged && target.orgLevel !== "ceo" ? { orgLevel: defaultLevelForRole(after) } : {}),
      ...(statusChanged ? { status } : {}),
    })
    .where(eq(users.id, userId));

  await logActivity(
    actor.id,
    [
      tierChanged ? `changed access to ${roleLabels[after]}` : null,
      hrChanged || managementChanged ? `set functions to ${accessSummary({ role: access, isHr, isManagement })}` : null,
      statusChanged ? `set a member to ${status}` : null,
    ]
      .filter(Boolean)
      .join(" and "),
    target.name,
  );

  await reconcileOrg();
  refreshOrg();
  revalidatePath("/people");
  revalidatePath(`/people/${userId}`);
  revalidatePath("/roles");
  return ok;
}

/** Start and end dates drive an intern's countdown, so an admin can correct or extend them. */
export async function updateMemberDates(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");

  const parsed = parseForm(
    z
      .object({
        userId: requiredId("person"),
        startDate: optionalDate("Start date"),
        endDate: optionalDate("End date"),
      })
      .refine((data) => datesInOrder(data.startDate, data.endDate), {
        message: "The end date can't be before the start date.",
        path: ["endDate"],
      }),
    formData,
  );
  if (!parsed.success) return fail(parsed.error);
  const { userId, startDate, endDate } = parsed.data;

  const [person] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);
  if (!person) return fail("That person no longer exists.");

  await db.update(users).set({ startDate, endDate }).where(eq(users.id, userId));

  await logActivity(actor.id, "updated a member's dates", person.name);
  revalidatePath(`/people/${userId}`);
  revalidatePath("/people");
  revalidatePath("/reviews");
  revalidatePath("/");
  return ok;
}

/**
 * Super admins make Admins and take Admin away. An Admin can do everything HR and Management can,
 * plus the website, Site settings and giving out HR, so this is the most trusted thing a person can be given.
 * Their HR and Management switches are left as they were: Admin outranks them, and if Admin is
 * taken away the person goes back to exactly what they were.
 */
async function changeAdmin(userId: string, becomeAdmin: boolean): Promise<ActionResult> {
  const actor = await requireRole("super_admin");
  if (userId === actor.id) return fail("You can't change your own access.");

  const [target] = await db
    .select({ name: users.name, role: users.role, isHr: users.isHr, isManagement: users.isManagement, status: users.status, orgLevel: users.orgLevel })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) return fail("That person no longer exists.");
  if (target.role === "super_admin") return fail("A super admin can't be made an Admin. Change their access from their profile.");

  if (becomeAdmin) {
    if (target.role === "admin") return fail(`${target.name} is already an Admin.`);
    if (target.status !== "active" && target.status !== "invited") return fail(`${target.name} can't sign in, so they can't be an Admin.`);
  } else if (target.role !== "admin") {
    return fail(`${target.name} isn't an Admin.`);
  }

  const after = tierOf({ role: becomeAdmin ? "admin" : "employee", isHr: target.isHr, isManagement: target.isManagement });
  await db
    .update(users)
    .set({
      role: becomeAdmin ? "admin" : "employee",
      ...(target.orgLevel !== "ceo" ? { orgLevel: defaultLevelForRole(after) } : {}),
    })
    .where(eq(users.id, userId));

  await notify(
    userId,
    becomeAdmin ? "You are now an Admin" : "Your Admin access was removed",
    "/",
    "organisation",
  );
  await logActivity(actor.id, becomeAdmin ? "made someone an Admin" : "removed someone's Admin access", target.name);

  await reconcileOrg();
  refreshOrg();
  revalidatePath("/roles");
  revalidatePath("/people");
  revalidatePath(`/people/${userId}`);
  return ok;
}

export async function addAdmin(formData: FormData): Promise<ActionResult> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return fail("Choose who to make an Admin.");
  return changeAdmin(userId, true);
}

export async function removeAdmin(userId: string): Promise<ActionResult> {
  return changeAdmin(userId, false);
}
