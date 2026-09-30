"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { departments, users } from "@/db/schema";
import type { Role } from "@/lib/roles";
import { logActivity, requireRole } from "./guards";
import type { EmploymentType } from "@/lib/format";

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

  await db.insert(users).values({
    email,
    name,
    jobTitle: String(formData.get("jobTitle") ?? "").trim() || null,
    role: (String(formData.get("role") ?? "member") as Role) ?? "member",
    employmentType: String(formData.get("employmentType") ?? "full_time") as EmploymentType,
    status: "invited",
    departmentId: department?.id ?? null,
    managerId: String(formData.get("managerId") ?? "") || null,
    startDate: String(formData.get("startDate") ?? "") || null,
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

  await db.update(users).set({ role }).where(eq(users.id, userId));
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
