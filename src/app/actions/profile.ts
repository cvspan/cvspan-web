"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { notificationPreferences, users } from "@/db/schema";
import { notificationCategories } from "@/lib/notification-categories";
import { ok, type ActionResult } from "@/lib/validation";
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

/**
 * Saves which notifications someone wants in the portal. Every category is written, on or off,
 * so what the form shows is exactly what is stored.
 */
export async function saveNotificationPreferences(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const wanted = new Set(formData.getAll("category").map(String));
  const rows = notificationCategories.map((category) => ({
    userId: user.id,
    category: category.key,
    inApp: wanted.has(category.key),
  }));

  const [first, ...rest] = rows.map((row) =>
    db
      .insert(notificationPreferences)
      .values(row)
      .onConflictDoUpdate({
        target: [notificationPreferences.userId, notificationPreferences.category],
        set: { inApp: row.inApp },
      }),
  );
  await db.batch([first, ...rest]);

  revalidatePath("/settings");
  return ok;
}
