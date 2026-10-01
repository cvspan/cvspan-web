/*
 * Links between the portal and the public website. The website is its own project (cvspan.com);
 * the portal's blog and careers sections feed it, so each post and role can link to its page there.
 */

const origin = (process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://cvspan.com").replace(/\/+$/, "");

/** A page on the public website: websiteUrl("/careers") → "https://cvspan.com/careers". */
export function websiteUrl(path = "") {
  return `${origin}${path.startsWith("/") || path === "" ? path : `/${path}`}`;
}

/** Where a blog post lives on the website once it is published. */
export const websitePostUrl = (slug: string) => websiteUrl(`/blog/${slug}`);

/** Where a job listing lives on the website once it is open. */
export const websiteJobUrl = (slug: string) => websiteUrl(`/careers/${slug}`);

/**
 * Addresses the website already uses for its own pages under /blog and /careers. A new post or role
 * can't take one of these slugs, or the website's built-in page would answer instead of the portal's.
 */
export const RESERVED_SLUGS = {
  post: ["auth", "dashboard", "author", "blog-post"],
  job: [
    "open-position",
    "front-end",
    "graphic-designer",
    "human-resource",
    "marketing-manager",
    "seo-manager",
    "social-media-manager",
    "volunteers",
  ],
} as const;
