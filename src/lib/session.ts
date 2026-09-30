import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { employmentLabels, initials, type EmploymentType } from "./format";
import { ROLES, type Role } from "./roles";

export const VIEW_ROLE_COOKIE = "cvspan-view-role";

/**
 * The signed-in user, plus the role the portal should render as.
 * Super admins can preview a lower role; everyone else sees their own.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  let viewRole: Role = role;

  if (role === "super_admin") {
    const store = await cookies();
    const preview = store.get(VIEW_ROLE_COOKIE)?.value;
    if (preview && ROLES.includes(preview as Role)) viewRole = preview as Role;
  }

  return {
    id: session.user.id,
    name: session.user.name ?? "CVSpan member",
    email: session.user.email ?? "",
    initials: initials(session.user.name ?? "CV"),
    role,
    viewRole,
    jobTitle: session.user.jobTitle ?? "",
    employmentType: employmentLabels[session.user.employmentType as EmploymentType],
  };
}
