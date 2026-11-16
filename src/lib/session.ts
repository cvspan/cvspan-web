import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { employmentLabels, initials, type EmploymentType } from "./format";
import { ROLES, tierOf, type Role } from "./roles";

export const VIEW_ROLE_COOKIE = "cvspan-view-role";

/**
 * The session token is only a claim; the database is the truth. Looked up once per request,
 * so layout, page and action can all call requireUser without repeating the query.
 */
const loadAccount = cache(async (id: string) => {
  const [account] = await db
    .select({
      role: users.role,
      isHr: users.isHr,
      isManagement: users.isManagement,
      status: users.status,
      jobTitle: users.jobTitle,
      avatarUrl: users.avatarUrl,
      employmentType: users.employmentType,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return account ?? null;
});

/**
 * The signed-in user, plus the role the portal should render as.
 * Super admins can preview a lower role; everyone else sees their own.
 *
 * A session is only honoured while its account exists and may still sign in. Otherwise (the
 * account was removed, suspended or moved to alumni) the session is ended, rather than letting
 * writes fail later on a missing foreign key. The role is read from the database, so a demotion
 * takes effect immediately instead of when the token expires.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const account = await loadAccount(session.user.id);
  if (!account || (account.status !== "active" && account.status !== "invited")) {
    redirect("/session-ended");
  }

  const role = tierOf(account);
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
    /** What is stored: the access level, and whether they hold the HR or Management function. */
    access: account.role,
    isHr: account.isHr,
    isManagement: account.isManagement,
    viewRole,
    jobTitle: account.jobTitle ?? "",
    avatarUrl: account.avatarUrl,
    employmentType: employmentLabels[account.employmentType as EmploymentType],
  };
}

/**
 * The tier of whoever is signed in, read from the database. For API routes, which have no layout to
 * go through requireUser; the session token only says who someone was when they signed in.
 */
export async function currentTier() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const account = await loadAccount(session.user.id);
  if (!account || (account.status !== "active" && account.status !== "invited")) return null;
  return { id: session.user.id, role: tierOf(account) };
}
