"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/session";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim() || null;
  if (!name) return;

  /** Email and role are deliberately not editable here — those are admin actions. */
  await db.update(users).set({ name, jobTitle }).where(eq(users.id, user.id));

  revalidatePath("/settings");
  revalidatePath("/", "layout");
}
