"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ROLES, type Role } from "@/lib/roles";
import { VIEW_ROLE_COOKIE } from "@/lib/session";

/** Only a super admin may preview the portal as another role. */
export async function setViewRole(role: Role) {
  const session = await auth();
  if (session?.user?.role !== "super_admin") return;
  if (!ROLES.includes(role)) return;

  const store = await cookies();
  store.set(VIEW_ROLE_COOKIE, role, { httpOnly: false, sameSite: "lax", path: "/" });
  revalidatePath("/", "layout");
}
