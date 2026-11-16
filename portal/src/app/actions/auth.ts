"use server";

import { auth, signOut } from "@/auth";
import { withBasePath } from "@/lib/base-path";
import { endPresence } from "@/modules/attendance";

export async function signOutAction() {
  /** Signing out is clocking out. A failure here must never stop someone signing out. */
  try {
    const session = await auth();
    if (session?.user) await endPresence(session.user.id);
  } catch (error) {
    console.error("Could not clock out on sign-out", error);
  }
  await signOut({ redirectTo: withBasePath("/login") });
}
