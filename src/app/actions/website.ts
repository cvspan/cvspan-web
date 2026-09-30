"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { approvals, blogPosts, departments, jobListings } from "@/db/schema";
import type { EmploymentType } from "@/lib/format";
import { logActivity, requireRole } from "./guards";
import { requireUser } from "@/lib/session";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const [post] = await db
    .insert(blogPosts)
    .values({
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      category: String(formData.get("category") ?? "").trim() || null,
      excerpt: String(formData.get("excerpt") ?? "").trim() || null,
      authorId: user.id,
      status: "draft",
    })
    .returning();

  await logActivity(user.id, "drafted a blog post", post.title);
  revalidatePath("/blog");
}

/** Sends a draft to an admin for approval instead of publishing straight away. */
export async function submitPostForReview(postId: string) {
  const user = await requireUser();

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1);
  if (!post) return;

  await db.update(blogPosts).set({ status: "in_review" }).where(eq(blogPosts.id, postId));
  await db.insert(approvals).values({
    kind: "blog_post",
    subjectId: postId,
    requestedById: user.id,
    detail: `“${post.title}”`,
  });

  revalidatePath("/blog");
  revalidatePath("/approvals");
}

export async function publishPost(postId: string) {
  const user = await requireRole("admin");

  await db
    .update(blogPosts)
    .set({ status: "published", publishAt: new Date() })
    .where(eq(blogPosts.id, postId));

  await logActivity(user.id, "published a blog post");
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function createJobListing(formData: FormData) {
  const user = await requireRole("admin");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const departmentName = String(formData.get("department") ?? "");
  const [department] = departmentName
    ? await db.select().from(departments).where(eq(departments.name, departmentName)).limit(1)
    : [];

  await db.insert(jobListings).values({
    title,
    departmentId: department?.id ?? null,
    employmentType: String(formData.get("employmentType") ?? "full_time") as EmploymentType,
    description: String(formData.get("description") ?? "").trim() || null,
    stage: "open",
    postedAt: new Date(),
  });

  await logActivity(user.id, "opened a job listing", title);
  revalidatePath("/careers");
  revalidatePath("/");
}
