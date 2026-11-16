import "server-only";
import { and, asc, count, desc, eq, gte, isNull, or, sql } from "drizzle-orm";
import { db } from "./index";
import { blogPosts, categories, departments, jobListings, users } from "./schema";

/**
 * What the public website may see. A post is public once it is published, or scheduled for a time
 * that has now passed (so scheduling works without a background job). A role is public while it is
 * open and its closing date hasn't gone by. Drafts, reviews, and roles being screened never are.
 */
const postIsPublic = sql`((${blogPosts.status} = 'published' and (${blogPosts.publishAt} is null or ${blogPosts.publishAt} <= now())) or (${blogPosts.status} = 'scheduled' and ${blogPosts.publishAt} <= now()))`;

const jobIsOpen = and(
  eq(jobListings.stage, "open"),
  or(isNull(jobListings.closingDate), gte(jobListings.closingDate, sql`current_date`)),
);

const postColumns = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  title: blogPosts.title,
  excerpt: blogPosts.excerpt,
  body: blogPosts.body,
  coverImageUrl: blogPosts.coverImageUrl,
  coverAlt: blogPosts.coverAlt,
  tags: blogPosts.tags,
  readingMinutes: blogPosts.readingMinutes,
  publishAt: blogPosts.publishAt,
  updatedAt: blogPosts.updatedAt,
  categoryName: categories.name,
  categorySlug: categories.slug,
  authorName: users.name,
};

export type PublicPostRow = Awaited<ReturnType<typeof getPublicPost>> extends infer R ? NonNullable<R> : never;

export async function getPublicPosts({
  page,
  pageSize,
  category,
  tag,
  search,
}: {
  page: number;
  pageSize: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  /** Matches the title, excerpt, text, tags, category or author; %, _ and backslashes are escaped so they search as plain characters. */
  const pattern = search ? `%${search.replace(/[\\%_]/g, "\\$&")}%` : null;
  const where = and(
    postIsPublic,
    pattern
      ? sql`(${blogPosts.title} ilike ${pattern} or ${blogPosts.excerpt} ilike ${pattern} or ${blogPosts.body} ilike ${pattern} or array_to_string(${blogPosts.tags}, ' ') ilike ${pattern} or ${categories.name} ilike ${pattern} or ${users.name} ilike ${pattern})`
      : undefined,
    category ? eq(categories.slug, category) : undefined,
    tag ? sql`${tag} = any(${blogPosts.tags})` : undefined,
  );

  const [rows, [total]] = await Promise.all([
    db
      .select(postColumns)
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(where)
      .orderBy(desc(sql`coalesce(${blogPosts.publishAt}, ${blogPosts.updatedAt})`))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: count() })
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(where),
  ]);

  return { rows, total: Number(total?.total ?? 0) };
}

export async function getPublicPost(slug: string) {
  const [row] = await db
    .select(postColumns)
    .from(blogPosts)
    .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(eq(blogPosts.slug, slug), postIsPublic))
    .limit(1);
  return row ?? null;
}

/** Categories that have at least one public post, with how many. */
export async function getPublicCategories() {
  const rows = await db
    .select({ name: categories.name, slug: categories.slug, posts: count() })
    .from(categories)
    .innerJoin(blogPosts, eq(blogPosts.categoryId, categories.id))
    .where(postIsPublic)
    .groupBy(categories.id)
    .orderBy(asc(categories.name));
  return rows.map((row) => ({ ...row, posts: Number(row.posts) }));
}

const jobColumns = {
  id: jobListings.id,
  slug: jobListings.slug,
  title: jobListings.title,
  summary: jobListings.summary,
  description: jobListings.description,
  employmentType: jobListings.employmentType,
  seniority: jobListings.seniority,
  workMode: jobListings.workMode,
  location: jobListings.location,
  experience: jobListings.experience,
  language: jobListings.language,
  openings: jobListings.openings,
  skills: jobListings.skills,
  salaryMin: jobListings.salaryMin,
  salaryMax: jobListings.salaryMax,
  salaryCurrency: jobListings.salaryCurrency,
  salaryPeriod: jobListings.salaryPeriod,
  salaryPublic: jobListings.salaryPublic,
  applyMethod: jobListings.applyMethod,
  applyValue: jobListings.applyValue,
  closingDate: jobListings.closingDate,
  postedAt: jobListings.postedAt,
  departmentName: departments.name,
  departmentSlug: departments.slug,
};

export async function getPublicJobs(department?: string) {
  return db
    .select(jobColumns)
    .from(jobListings)
    .leftJoin(departments, eq(jobListings.departmentId, departments.id))
    .where(and(jobIsOpen, department ? eq(departments.slug, department) : undefined))
    .orderBy(desc(sql`coalesce(${jobListings.postedAt}, ${jobListings.updatedAt})`));
}

export async function getPublicJob(slug: string) {
  const [row] = await db
    .select(jobColumns)
    .from(jobListings)
    .leftJoin(departments, eq(jobListings.departmentId, departments.id))
    .where(and(eq(jobListings.slug, slug), jobIsOpen))
    .limit(1);
  return row ?? null;
}

/** Every department, with how many roles are open in it, so a filter can show all of them. */
export async function getPublicDepartments() {
  const rows = await db
    .select({ name: departments.name, slug: departments.slug, openRoles: count(jobListings.id) })
    .from(departments)
    .leftJoin(jobListings, and(eq(jobListings.departmentId, departments.id), jobIsOpen))
    .groupBy(departments.id)
    .orderBy(asc(departments.name));
  return rows.map((row) => ({ ...row, openRoles: Number(row.openRoles) }));
}
