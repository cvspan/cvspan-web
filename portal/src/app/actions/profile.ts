"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { batch, db } from "@/db";
import { media, notificationPreferences, users } from "@/db/schema";
import { notificationCategories } from "@/lib/notification-categories";
import { fail, ok, type ActionResult } from "@/lib/validation";
import { requireUser } from "@/lib/session";

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

  await batch((db) =>
    rows.map((row) =>
      db
        .insert(notificationPreferences)
        .values(row)
        .onConflictDoUpdate({
          target: [notificationPreferences.userId, notificationPreferences.category],
          set: { inApp: row.inApp },
        }),
    ),
  );

  revalidatePath("/settings");
  return ok;
}

/**
 * Sets or clears the signed-in person's photo. The photo must be an image they uploaded themselves,
 * so nobody can point their avatar at someone else's file or an outside address.
 */
export async function setAvatar(url: string | null): Promise<ActionResult> {
  const user = await requireUser();

  if (url !== null) {
    const match = /^\/api\/media\/([0-9a-f-]{36})$/i.exec(url);
    if (!match) return fail("That isn't a photo we can use. Upload it again.");

    const [file] = await db
      .select({ uploadedById: media.uploadedById, contentType: media.contentType })
      .from(media)
      .where(eq(media.id, match[1]))
      .limit(1);
    if (!file || file.uploadedById !== user.id || !file.contentType.startsWith("image/")) {
      return fail("That isn't a photo we can use. Upload it again.");
    }
  }

  await db.update(users).set({ avatarUrl: url }).where(eq(users.id, user.id));

  revalidatePath("/", "layout");
  return ok;
}
