"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { approvals, blogPosts, categories, departments, jobListings } from "@/db/schema";
import type { EmploymentType } from "@/lib/format";
import { logActivity, requireRole } from "./guards";
import { requireUser } from "@/lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Strip tags so we can derive an excerpt and a reading time from the body. */
function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFrom(html: string) {
  const text = plainText(html);
  if (text.length <= 160) return text;
  /** Cut on a word boundary so the summary never ends mid-word. */
  return `${text.slice(0, 160).replace(/\s+\S*$/, "")}…`;
}

function readingMinutes(html: string) {
  const words = plainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function resolveCategory(categoryId: string, newCategory: string) {
  const name = newCategory.trim();

  if (name) {
    const slug = slugify(name);
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    if (existing) return existing.id;

    const [created] = await db.insert(categories).values({ name, slug }).returning();
    return created.id;
  }

  return categoryId || null;
}

export async function savePost(formData: FormData) {
  const user = await requireUser();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const intent = String(formData.get("intent") ?? "draft");
  if (!title) return;

  const categoryId = await resolveCategory(
    String(formData.get("categoryId") ?? ""),
    String(formData.get("newCategory") ?? ""),
  );

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  const publishAtRaw = String(formData.get("publishAt") ?? "");

  /** Members draft and submit; only admins publish or schedule directly. */
  const canPublish = user.role === "admin" || user.role === "super_admin";
  const status =
    intent === "publish" && canPublish
      ? publishAtRaw && new Date(publishAtRaw) > new Date()
        ? "scheduled"
        : "published"
      : intent === "review"
        ? "in_review"
        : "draft";

  const values = {
    title,
    body,
    excerpt: excerptFrom(body),
    readingMinutes: readingMinutes(body),
    categoryId,
    tags,
    coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim() || null,
    coverAlt: String(formData.get("coverAlt") ?? "").trim() || null,
    status: status as "draft" | "in_review" | "scheduled" | "published",
    publishAt:
      status === "published"
        ? new Date()
        : publishAtRaw
          ? new Date(publishAtRaw)
          : null,
    updatedAt: new Date(),
  };

  let postId = id;

  if (id) {
    await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
  } else {
    const [created] = await db
      .insert(blogPosts)
      .values({
        ...values,
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        authorId: user.id,
      })
      .returning();
    postId = created.id;
  }

  if (status === "in_review") {
    await db.insert(approvals).values({
      kind: "blog_post",
      subjectId: postId,
      requestedById: user.id,
      detail: `“${title}”`,
    });
    revalidatePath("/approvals");
  }

  await logActivity(
    user.id,
    status === "published" ? "published a blog post" : "saved a blog post",
    title,
  );

  revalidatePath("/blog");
  redirect("/blog");
}

export async function publishPost(postId: string) {
  const user = await requireRole("admin");

  await db
    .update(blogPosts)
    .set({ status: "published", publishAt: new Date(), updatedAt: new Date() })
    .where(eq(blogPosts.id, postId));

  await logActivity(user.id, "published a blog post");
  revalidatePath("/blog");
  revalidatePath("/");
}

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

export async function deletePost(postId: string) {
  const user = await requireRole("admin");
  await db.delete(blogPosts).where(eq(blogPosts.id, postId));
  await logActivity(user.id, "deleted a blog post");
  revalidatePath("/blog");
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
