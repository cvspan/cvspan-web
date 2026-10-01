import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, jobListings, users } from "@/db/schema";
import { notify } from "@/app/actions/guards";
import { allowedOrigins, corsHeaders, preflight } from "@/lib/public-api";
import { normalizeUrl } from "@/lib/project-links";
import { createRateLimiter } from "@/lib/rate-limit";

/** A few attempts an hour per address: enough for a real applicant, awkward for a script. */
const limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(100, "That name is too long"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  message: z.string().trim().max(2000, "Keep your message under 2,000 characters").optional(),
  portfolioUrl: z.string().trim().max(300).optional(),
  /** A hidden field real people never fill in. */
  website: z.string().optional(),
});

function reply(request: Request, status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { ...corsHeaders(request, { write: true }), "Cache-Control": "no-store" },
  });
}

/**
 * POST /api/public/v1/careers/:slug/apply   { name, email, message?, portfolioUrl? }
 * A candidate applying from the website. It lands in the portal's applicant list for that role
 * and the hiring manager (or the admins) are told.
 */
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  /** Browsers announce where they are calling from; only the website itself may submit. */
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins().includes(origin)) {
    return reply(request, 403, { error: "This site isn't allowed to submit applications." });
  }

  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.allow(address)) {
    return reply(request, 429, { error: "Too many applications from your connection. Please try again later." });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return reply(request, 400, { error: "Send the application as JSON." });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return reply(request, 400, { error: parsed.error.issues[0]?.message ?? "Check the form and try again." });
  }
  const { name, email, message, portfolioUrl, website } = parsed.data;

  /** A bot filled the hidden field. Say it worked so it learns nothing. */
  if (website) return reply(request, 201, { ok: true });

  let portfolio: string | null = null;
  if (portfolioUrl) {
    portfolio = normalizeUrl(portfolioUrl);
    if (!portfolio) return reply(request, 400, { error: "Enter a valid portfolio link, or leave it blank." });
  }

  const { slug } = await params;
  const [job] = await db
    .select({
      id: jobListings.id,
      title: jobListings.title,
      applyMethod: jobListings.applyMethod,
      hiringManagerId: jobListings.hiringManagerId,
    })
    .from(jobListings)
    .where(
      and(
        eq(jobListings.slug, slug),
        eq(jobListings.stage, "open"),
        or(isNull(jobListings.closingDate), sql`${jobListings.closingDate} >= current_date`),
      ),
    )
    .limit(1);

  if (!job) return reply(request, 404, { error: "This role isn't open any more." });
  if (job.applyMethod !== "portal") {
    return reply(request, 409, { error: "This role takes applications another way. Use the link on the listing." });
  }

  /** Applying twice with the same email isn't an error for the candidate, and isn't stored twice. */
  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.jobId, job.id), eq(applications.candidateEmail, email)))
    .limit(1);
  if (existing) return reply(request, 201, { ok: true });

  const notes = [message, portfolio ? `Portfolio: ${portfolio}` : null].filter(Boolean).join("\n\n") || null;
  await db.insert(applications).values({ jobId: job.id, candidateName: name, candidateEmail: email, notes });

  /** Tell whoever is hiring: the hiring manager, else the admins. */
  const recipients = job.hiringManagerId
    ? [job.hiringManagerId]
    : (
        await db
          .select({ id: users.id })
          .from(users)
          .where(and(inArray(users.role, ["admin", "super_admin"]), inArray(users.status, ["active", "invited"])))
      ).map((row) => row.id);

  await Promise.all(
    recipients.map((id) => notify(id, `${name} applied for ${job.title}`, `/careers/${job.id}/applicants`, "careers")),
  );

  return reply(request, 201, { ok: true });
}

export const OPTIONS = (request: Request) => preflight(request, { write: true });
