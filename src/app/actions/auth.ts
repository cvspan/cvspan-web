"use server";

import { signOut } from "@/auth";
import { withBasePath } from "@/lib/base-path";

export async function signOutAction() {
  await signOut({ redirectTo: withBasePath("/login") });
}
