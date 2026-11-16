import { getPublicPost } from "@/db/queries-public";
import { portalPublicUrl, preflight, publicError, publicJson } from "@/lib/public-api";
import { toPublicPost } from "@/lib/public-content";

/** GET /api/public/v1/blog/:slug — one published post, with its HTML body. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) return publicError(request, 404, "Post not found.");

  return publicJson(request, { post: toPublicPost(post, portalPublicUrl(request)) });
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
