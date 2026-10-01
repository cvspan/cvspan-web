import { getPublicCategories, getPublicPosts } from "@/db/queries-public";
import { portalPublicUrl, preflight, publicJson } from "@/lib/public-api";
import { toPublicPostSummary } from "@/lib/public-content";

const intParam = (value: string | null, fallback: number, min: number, max: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

/**
 * GET /api/public/v1/blog?page=1&pageSize=9&category=culture&tag=remote
 * Published posts, newest first, plus the categories that have any.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = intParam(params.get("page"), 1, 1, 1000);
  const pageSize = intParam(params.get("pageSize"), 9, 1, 24);

  const [{ rows, total }, categories] = await Promise.all([
    getPublicPosts({
      page,
      pageSize,
      category: params.get("category")?.slice(0, 80) || undefined,
      tag: params.get("tag")?.slice(0, 60) || undefined,
    }),
    getPublicCategories(),
  ]);

  const portalUrl = portalPublicUrl(request);
  return publicJson(request, {
    posts: rows.map((row) => toPublicPostSummary(row, portalUrl)),
    categories,
    pagination: { page, pageSize, total, pages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
