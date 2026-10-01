"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { departments, users } from "@/db/schema";
import type { Role } from "@/lib/roles";
import { z } from "zod";
import { logActivity, requireRole } from "./guards";
import type { EmploymentType } from "@/lib/format";
import { defaultInternshipEnd } from "@/lib/grading";
import { defaultLevelForRole } from "@/lib/org";
import {
  datesInOrder,
  fail,
  ok,
  optionalDate,
  parseForm,
  requiredId,
  type ActionResult,
} from "@/lib/validation";

export async function inviteMember(formData: FormData) {
  const user = await requireRole("admin");

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

  const inviteRole = (String(formData.get("role") ?? "member") as Role) ?? "member";
  const employmentType = String(formData.get("employmentType") ?? "full_time") as EmploymentType;
  const startDate = String(formData.get("startDate") ?? "") || null;

  /** Internships run for six months unless an end date is given. */
  const endDate =
    String(formData.get("endDate") ?? "") ||
    (employmentType === "internship" && startDate ? defaultInternshipEnd(startDate) : null);

  await db.insert(users).values({
    email,
    name,
    jobTitle: String(formData.get("jobTitle") ?? "").trim() || null,
    role: inviteRole,
    orgLevel: defaultLevelForRole(inviteRole),
    employmentType,
    status: "invited",
    departmentId: department?.id ?? null,
    managerId: String(formData.get("managerId") ?? "") || null,
    startDate,
    endDate,
  });

  await logActivity(user.id, "invited a new member", name);
  revalidatePath("/people");
  revalidatePath("/");
}

export async function updateMemberRole(formData: FormData) {
  const actor = await requireRole("super_admin");

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  if (!userId || !role) return;

  /**
   * Keep the org level in step with the new access role, unless the person is the CEO or an
   * executive: those are chosen on the org chart, not inferred from access.
   */
  const [current] = await db.select({ orgLevel: users.orgLevel }).from(users).where(eq(users.id, userId)).limit(1);
  const keepsLevel = current?.orgLevel === "ceo" || current?.orgLevel === "executive";

  await db
    .update(users)
    .set(keepsLevel ? { role } : { role, orgLevel: defaultLevelForRole(role) })
    .where(eq(users.id, userId));
  await logActivity(actor.id, "changed a role", role);

  revalidatePath("/people");
  revalidatePath("/roles");
}

export async function setMemberStatus(userId: string, status: "active" | "suspended" | "alumni") {
  const actor = await requireRole("admin");
  await db.update(users).set({ status }).where(eq(users.id, userId));
  await logActivity(actor.id, `set a member to ${status}`);
  revalidatePath("/people");
}

/** Start and end dates drive an intern's countdown, so an admin can correct or extend them. */
export async function updateMemberDates(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

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
