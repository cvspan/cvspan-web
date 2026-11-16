"use server";

import { asc, eq } from "drizzle-orm";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { websiteTeamMembers } from "@/db/schema";
import { logActivity, requireRole } from "./guards";
import { slugify } from "@/lib/slug";
import { fail, ok, parseForm, requiredText, type ActionResult } from "@/lib/validation";
import { pingWebsite } from "@/lib/website-sync";
import { isTeamPhoto, uniqueSlug } from "@/lib/website-team";

const memberSchema = z.object({
  id: z.string().optional(),
  name: requiredText("Full name"),
  role: requiredText("Role"),
  bio: z
    .string()
    .trim()
    .max(4000, "The bio must be 4000 characters or fewer")
    .transform((value) => value || null),
  photoUrl: z
    .string()
    .trim()
    .min(1, "Add a picture")
    .refine(isTeamPhoto, "That picture can't be used. Upload it again"),
});

/** The pages that show the team: the about page's preview, the full list, and each profile. */
const websitePaths = (slug?: string) => ["/about", "/about/teams", ...(slug ? [`/about/teams/${slug}`] : [])];

function refresh(slug?: string) {
  revalidatePath("/website-team");
  after(() => pingWebsite(websitePaths(slug)));
}

/** Adds a person, or changes one when `id` is given. New people go to the end of the list. */
export async function saveTeamMember(formData: FormData): Promise<ActionResult> {
  const user = await requireRole("admin");

  const parsed = parseForm(memberSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { id, name, role, bio, photoUrl } = parsed.data;

  if (id) {
    const [updated] = await db
      .update(websiteTeamMembers)
      .set({ name, role, bio, photoUrl, updatedAt: new Date() })
      .where(eq(websiteTeamMembers.id, id))
      .returning({ slug: websiteTeamMembers.slug });
    if (!updated) return fail("That person no longer exists.");
    await logActivity(user.id, "updated a website team member", name);
    refresh(updated.slug);
    return ok;
  }

  const existing = await db
    .select({ slug: websiteTeamMembers.slug, sortOrder: websiteTeamMembers.sortOrder })
    .from(websiteTeamMembers);
  const slug = uniqueSlug(slugify(name), existing.map((row) => row.slug));
  const sortOrder = existing.reduce((highest, row) => Math.max(highest, row.sortOrder), 0) + 1;

  try {
    await db.insert(websiteTeamMembers).values({ slug, name, role, bio, photoUrl, sortOrder });
  } catch {
    return fail("Could not add them. Try again.");
  }
  await logActivity(user.id, "added a website team member", name);
  refresh(slug);
  return ok;
}

/** Hidden people stay in the list but are left off the website. */
export async function setTeamMemberVisible(id: string, published: boolean) {
  const user = await requireRole("admin");
  const [row] = await db
    .update(websiteTeamMembers)
    .set({ published, updatedAt: new Date() })
    .where(eq(websiteTeamMembers.id, id))
    .returning({ slug: websiteTeamMembers.slug, name: websiteTeamMembers.name });
  if (!row) return;
  await logActivity(user.id, published ? "showed a team member on the website" : "hid a team member from the website", row.name);
  refresh(row.slug);
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const user = await requireRole("admin");
  const [row] = await db
    .delete(websiteTeamMembers)
    .where(eq(websiteTeamMembers.id, id))
    .returning({ slug: websiteTeamMembers.slug, name: websiteTeamMembers.name });
  if (!row) return fail("That person no longer exists.");
  await logActivity(user.id, "removed a website team member", row.name);
  refresh(row.slug);
  return ok;
}

/** Swaps a person with their neighbour. Positions are rewritten 1..n so they never collide. */
export async function moveTeamMember(id: string, direction: "up" | "down") {
  await requireRole("admin");
  const rows = await db
    .select({ id: websiteTeamMembers.id })
    .from(websiteTeamMembers)
    .orderBy(asc(websiteTeamMembers.sortOrder), asc(websiteTeamMembers.createdAt));

  const from = rows.findIndex((row) => row.id === id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= rows.length) return;

  const order = rows.map((row) => row.id);
  [order[from], order[to]] = [order[to], order[from]];
  await Promise.all(
    order.map((memberId, index) =>
      db.update(websiteTeamMembers).set({ sortOrder: index + 1 }).where(eq(websiteTeamMembers.id, memberId)),
    ),
  );
  refresh();
}
