import { absoluteMedia, htmlWithAbsoluteMedia } from "./base-path";
import { employmentLabels, formatSalary, seniorityLabels, workModeLabels, type EmploymentType } from "./format";
import { sanitizeRichText } from "./sanitize";

/*
 * Turns database rows into the shapes the public website receives. Pure, so what is exposed (and
 * what is held back) is easy to test. Nothing internal leaves here: no ids of people, no stages,
 * no hiring manager, and salary only when a listing says it is public.
 */

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  coverImageUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  readingMinutes: number;
  publishAt: Date | null;
  updatedAt: Date;
  categoryName: string | null;
  categorySlug: string | null;
  authorName: string | null;
};

export function toPublicPostSummary(row: PostRow, portalUrl: string) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: absoluteMedia(row.coverImageUrl, portalUrl),
    coverAlt: row.coverAlt,
    category: row.categoryName && row.categorySlug ? { name: row.categoryName, slug: row.categorySlug } : null,
    tags: row.tags,
    author: row.authorName,
    readingMinutes: row.readingMinutes,
    publishedAt: (row.publishAt ?? row.updatedAt).toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toPublicPost(row: PostRow, portalUrl: string) {
  return {
    ...toPublicPostSummary(row, portalUrl),
    /** Images are full URLs, and the HTML has been cleaned for rendering on another site. */
    bodyHtml: sanitizeRichText(htmlWithAbsoluteMedia(row.body ?? "", portalUrl)),
  };
}

type JobRow = {
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  employmentType: EmploymentType;
  seniority: keyof typeof seniorityLabels;
  workMode: keyof typeof workModeLabels;
  location: string | null;
  experience: string | null;
  language: string | null;
  openings: number;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: "year" | "month" | "day" | "hour";
  salaryPublic: boolean;
  applyMethod: "portal" | "email" | "url";
  applyValue: string | null;
  closingDate: string | null;
  postedAt: Date | null;
  departmentName: string | null;
  departmentSlug: string | null;
};

export function toPublicJobSummary(row: JobRow) {
  const showSalary = row.salaryPublic && (row.salaryMin || row.salaryMax);

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    department: row.departmentName && row.departmentSlug ? { name: row.departmentName, slug: row.departmentSlug } : null,
    employmentType: row.employmentType,
    /** "Internship", "Volunteer"… as the website's list shows it. */
    employmentLabel: employmentLabels[row.employmentType],
    seniority: row.seniority,
    seniorityLabel: seniorityLabels[row.seniority],
    workMode: row.workMode,
    workModeLabel: workModeLabels[row.workMode],
    location: row.location,
    experience: row.experience,
    language: row.language,
    openings: row.openings,
    skills: row.skills,
    /** Only a listing that opted in shows pay. */
    salary: showSalary
      ? {
          min: row.salaryMin,
          max: row.salaryMax,
          currency: row.salaryCurrency,
          period: row.salaryPeriod,
          display: formatSalary(row.salaryMin, row.salaryMax, row.salaryCurrency, row.salaryPeriod),
        }
      : null,
    postedAt: row.postedAt?.toISOString() ?? null,
    closingDate: row.closingDate,
    apply: {
      /** "portal": the website posts to our apply endpoint. "email"/"url": send people there instead. */
      method: row.applyMethod,
      target: row.applyMethod === "portal" ? null : row.applyValue,
    },
  };
}

export function toPublicJob(row: JobRow) {
  return { ...toPublicJobSummary(row), descriptionHtml: sanitizeRichText(row.description) };
}
