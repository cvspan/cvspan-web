"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { authLimiter } from "@/lib/auth-limiter";
import { withBasePath } from "@/lib/base-path";
import { generateTemporaryPassword, passwordProblem } from "@/lib/passwords";
import { atLeast, tierOf } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { fail, type ActionResult } from "@/lib/validation";
import { endPresence } from "@/modules/attendance";
import { logActivity, requireRole } from "./guards";

const COST = 12;

/**
 * Someone changes their own password. They must give the current one, so a stolen session cannot take
 * the account over. On success every session is ended, including this one: they sign in again with the
 * new password. Anyone who had the old password, or an old session, is out.
 */
export async function changePassword(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next) return fail("Fill in all three boxes.");
  if (next !== confirm) return fail("The new password and its confirmation do not match.");

  /** Guessing the current password through this form draws on the same allowance as signing in. */
  const key = user.email.toLowerCase();
  if (authLimiter.isLocked(key)) return fail("Too many wrong passwords. Wait a few minutes and try again.");

  const [account] = await db
    .select({ passwordHash: users.passwordHash, status: users.status })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  if (!account?.passwordHash || !(await bcrypt.compare(current, account.passwordHash))) {
    authLimiter.fail(key);
    return fail("The current password is not right.");
  }

  const problem = passwordProblem(next, { email: user.email, name: user.name, current });
  if (problem) return fail(problem);

  await db
    .update(users)
    .set({
      passwordHash: await bcrypt.hash(next, COST),
      mustChangePassword: false,
      passwordChangedAt: new Date(),
      /** Choosing their own password is what finishes an invitation. */
      ...(account.status === "invited" ? { status: "active" as const } : {}),
    })
    .where(eq(users.id, user.id));
  authLimiter.clear(key);
  await logActivity(user.id, "changed their password");

  try {
    await endPresence(user.id);
  } catch (error) {
    console.error("Could not clock out after a password change", error);
  }
  await signOut({ redirectTo: withBasePath("/login?changed=1") });
  return { ok: true };
}

export type TemporaryPasswordResult = { ok: true; password: string; name: string } | { ok: false; error: string };

/**
 * HR (and above) set a temporary password for someone who has none yet or has forgotten theirs. It is
 * shown once, to the person doing it, to pass on; it is stored only as a hash. The person must choose
 * their own at their next sign-in, and any session they had is ended.
 *
 * Who may reset whom follows the access rules elsewhere: HR can reset staff and Management, an Admin can
 * also reset HR, and only a Super admin can reset an Admin or a Super admin. Nobody uses this on themselves.
 */
export async function setTemporaryPassword(userId: string): Promise<TemporaryPasswordResult> {
  const actor = await requireRole("hr");
  if (userId === actor.id) return { ok: false, error: "Change your own password from Settings." };

  const [target] = await db
    .select({
      name: users.name,
      email: users.email,
      role: users.role,
      isHr: users.isHr,
      isManagement: users.isManagement,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) return { ok: false, error: "That person no longer exists." };

  if (target.status !== "active" && target.status !== "invited") {
    return { ok: false, error: `${target.name} cannot sign in, so a password would not help. Change their status first.` };
  }
  if (target.role !== "employee" && actor.role !== "super_admin") {
    return { ok: false, error: "Only a Super admin can set a password for an Admin." };
  }
  if (tierOf(target) === "hr" && !atLeast(actor.role, "admin")) {
    return { ok: false, error: "Only an Admin can set a password for someone in HR." };
  }

  const password = generateTemporaryPassword();
  await db
    .update(users)
    .set({
      passwordHash: await bcrypt.hash(password, COST),
      mustChangePassword: true,
      passwordChangedAt: new Date(),
    })
    .where(eq(users.id, userId));

  /** A person locked out by too many wrong guesses can use the new password straight away. */
  authLimiter.clear(target.email.toLowerCase());
  /** The password itself is never written down: the log says only that one was set. */
  await logActivity(actor.id, "set a temporary password", target.name);

  revalidatePath(`/people/${userId}`);
  return { ok: true, password, name: target.name };
}
