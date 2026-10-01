"use server";

import { eq } from "drizzle-orm";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { approvals, blogPosts, categories, departments, jobListings } from "@/db/schema";
import type { EmploymentType } from "@/lib/format";
import { logActivity, requireRole } from "./guards";
import { slugify } from "@/lib/slug";
import { pingWebsite } from "@/lib/website-sync";
import { RESERVED_SLUGS } from "@/lib/website";
import { requireUser } from "@/lib/session";

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

/**
 * A readable, unique slug for a public URL: "product-designer", then "product-designer-2" if that
 * is taken. These become cvspan.com/careers/<slug> and cvspan.com/blog/<slug>.
 */
async function uniqueSlug(kind: "post" | "job", title: string) {
  const base = slugify(title) || kind;
  const table = kind === "post" ? blogPosts : jobListings;

  for (let attempt = 1; attempt <= 25; attempt++) {
    const candidate = attempt === 1 ? base : `${base}-${attempt}`;
    if ((RESERVED_SLUGS[kind] as readonly string[]).includes(candidate)) continue;
    const [taken] = await db.select({ id: table.id }).from(table).where(eq(table.slug, candidate)).limit(1);
    if (!taken) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/** The website pages a post or role appears on: its list and its own page. */
async function websitePaths(kind: "post" | "job", slug: string | null | undefined) {
  const list = kind === "post" ? "/blog" : "/careers";
  return slug ? [list, `${list}/${slug}`] : [list];
}

async function slugOf(kind: "post" | "job", id: string | null | undefined) {
  if (!id) return null;
  const table = kind === "post" ? blogPosts : jobListings;
  const [row] = await db.select({ slug: table.slug }).from(table).where(eq(table.id, id)).limit(1);
  return row?.slug ?? null;
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
        slug: await uniqueSlug("post", title),
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
  after(async () => pingWebsite(await websitePaths("post", await slugOf("post", postId))));
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
  after(async () => pingWebsite(await websitePaths("post", await slugOf("post", postId))));
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
  const slug = await slugOf("post", postId);
  await db.delete(blogPosts).where(eq(blogPosts.id, postId));
  await logActivity(user.id, "deleted a blog post");
  revalidatePath("/blog");
  after(async () => pingWebsite(await websitePaths("post", slug)));
}

export async function saveJob(formData: FormData) {
  const user = await requireRole("admin");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const intent = String(formData.get("intent") ?? "draft");
  if (!title) return;

  /** A department can be created while writing the listing, like blog categories. */
  const newDepartment = String(formData.get("newDepartment") ?? "").trim();
  let departmentId = String(formData.get("departmentId") ?? "") || null;

  if (newDepartment) {
    const slug = slugify(newDepartment);
    const [existing] = await db
      .select()
      .from(departments)
      .where(eq(departments.slug, slug))
      .limit(1);
    departmentId =
      existing?.id ??
      (await db.insert(departments).values({ name: newDepartment, slug }).returning())[0].id;
  }
  const number = (key: string) => {
    const raw = String(formData.get(key) ?? "").replace(/[^0-9]/g, "");
    return raw ? Number(raw) : null;
  };

  const values = {
    title,
    description: String(formData.get("description") ?? ""),
    summary: String(formData.get("summary") ?? "").trim() || null,
    departmentId,
    employmentType: String(formData.get("employmentType") ?? "full_time") as EmploymentType,
    seniority: String(formData.get("seniority") ?? "mid") as
      | "intern"
      | "junior"
      | "mid"
      | "senior"
      | "lead",
    location: String(formData.get("location") ?? "").trim() || null,
    experience: String(formData.get("experience") ?? "").trim() || null,
    language: String(formData.get("language") ?? "").trim() || "English",
    workMode: String(formData.get("workMode") ?? "on_site") as "on_site" | "hybrid" | "remote",
    openings: Math.max(1, number("openings") ?? 1),
    skills: String(formData.get("skills") ?? "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 12),
    salaryMin: number("salaryMin"),
    salaryMax: number("salaryMax"),
    salaryCurrency: String(formData.get("salaryCurrency") ?? "NGN"),
    salaryPeriod: String(formData.get("salaryPeriod") ?? "month") as
      | "year"
      | "month"
      | "day"
      | "hour",
    salaryPublic: formData.get("salaryPublic") === "on",
    hiringManagerId: String(formData.get("hiringManagerId") ?? "") || null,
    applyMethod: String(formData.get("applyMethod") ?? "portal") as "portal" | "email" | "url",
    applyValue: String(formData.get("applyValue") ?? "").trim() || null,
    closingDate: String(formData.get("closingDate") ?? "") || null,
    stage: (intent === "publish" ? "open" : intent === "close" ? "closed" : "draft") as
      | "draft"
      | "open"
      | "closed",
    updatedAt: new Date(),
  };

  let jobId = id;

  if (id) {
    /** Keep the original posting date once a listing has gone live. */
    const [existing] = await db.select().from(jobListings).where(eq(jobListings.id, id)).limit(1);
    await db
      .update(jobListings)
      .set({
        ...values,
        postedAt:
          values.stage === "open" ? (existing?.postedAt ?? new Date()) : existing?.postedAt ?? null,
      })
      .where(eq(jobListings.id, id));
  } else {
    const [created] = await db
      .insert(jobListings)
      .values({
        ...values,
        slug: await uniqueSlug("job", title),
        postedAt: values.stage === "open" ? new Date() : null,
      })
      .returning({ id: jobListings.id });
    jobId = created.id;
  }

  await logActivity(
    user.id,
    values.stage === "open" ? "opened a job listing" : "saved a job listing",
    title,
  );

  revalidatePath("/careers");
  revalidatePath("/");
  after(async () => pingWebsite(await websitePaths("job", await slugOf("job", jobId))));
  redirect("/careers");
}

export async function setJobStage(
  jobId: string,
  stage: "draft" | "open" | "screening" | "interviewing" | "closed",
) {
  const user = await requireRole("admin");

  const [existing] = await db.select().from(jobListings).where(eq(jobListings.id, jobId)).limit(1);

  await db
    .update(jobListings)
    .set({
      stage,
      updatedAt: new Date(),
      postedAt: stage === "open" ? (existing?.postedAt ?? new Date()) : existing?.postedAt,
    })
    .where(eq(jobListings.id, jobId));

  await logActivity(user.id, `moved a listing to ${stage}`, existing?.title ?? undefined);
  revalidatePath("/careers");
  revalidatePath("/");
  after(async () => pingWebsite(await websitePaths("job", await slugOf("job", jobId))));
}

export async function deleteJob(jobId: string) {
  const user = await requireRole("admin");
  const slug = await slugOf("job", jobId);
  await db.delete(jobListings).where(eq(jobListings.id, jobId));
  await logActivity(user.id, "deleted a job listing");
  revalidatePath("/careers");
  after(async () => pingWebsite(await websitePaths("job", slug)));
}
