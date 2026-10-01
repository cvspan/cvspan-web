import { getPublicJob } from "@/db/queries-public";
import { preflight, publicError, publicJson } from "@/lib/public-api";
import { toPublicJob } from "@/lib/public-content";

/** GET /api/public/v1/careers/:slug — one open role, with its description. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getPublicJob(slug);
  if (!job) return publicError(request, 404, "This role isn't open any more.");

  return publicJson(request, { job: toPublicJob(job) });
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
