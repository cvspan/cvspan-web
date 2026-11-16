import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { batch, db } from "@/db";
import { applicationResumes, applications, jobListings, users } from "@/db/schema";
import { notify } from "@/app/actions/guards";
import { allowedOrigins, corsHeaders, preflight } from "@/lib/public-api";
import { normalizeUrl } from "@/lib/project-links";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkResume, safeFilename } from "@/lib/resume";

/** A few attempts an hour per address: enough for a real applicant, awkward for a script. */
const limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

const schema = z.object({
  firstName: z.string().trim().min(1, "Tell us your first name").max(60, "That first name is too long"),
  lastName: z.string().trim().min(1, "Tell us your last name").max(60, "That last name is too long"),
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
 * POST /api/public/v1/careers/:slug/apply   multipart/form-data:
 *   firstName, lastName, email, resume (PDF/DOC/DOCX, 4 MB), portfolioUrl?, message?
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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, 400, { error: "Send the application as a form with your resume attached." });
  }

  /** FormData values are strings or files; only text is wanted for the fields. */
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value : undefined;
  };

  const parsed = schema.safeParse({
    firstName: text("firstName") ?? "",
    lastName: text("lastName") ?? "",
    email: text("email") ?? "",
    message: text("message") || undefined,
    portfolioUrl: text("portfolioUrl") || undefined,
    website: text("website"),
  });
  if (!parsed.success) {
    return reply(request, 400, { error: parsed.error.issues[0]?.message ?? "Check the form and try again." });
  }
  const { firstName, lastName, email, message, portfolioUrl, website } = parsed.data;
  const name = `${firstName} ${lastName}`;

  /** A bot filled the hidden field. Say it worked so it learns nothing. */
  if (website) return reply(request, 201, { ok: true });

  let portfolio: string | null = null;
  if (portfolioUrl) {
    portfolio = normalizeUrl(portfolioUrl);
    if (!portfolio) return reply(request, 400, { error: "Enter a valid portfolio link, or leave it blank." });
  }

  const file = form.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return reply(request, 400, { error: "Attach your resume as a PDF, DOC or DOCX file." });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const resume = checkResume(bytes.subarray(0, 8), bytes.byteLength);
  if (!resume.ok) return reply(request, 400, { error: resume.error });

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
  /** One batch, so an application never exists without the CV it came with. */
  const applicationId = crypto.randomUUID();
  await batch((db) => [
    db
      .insert(applications)
      .values({ id: applicationId, jobId: job.id, candidateName: name, candidateEmail: email, notes }),
    db.insert(applicationResumes).values({
      applicationId,
      filename: safeFilename(file.name, resume.extension),
      contentType: resume.contentType,
      size: bytes.byteLength,
      data: Buffer.from(bytes),
    }),
  ]);

  /** Tell whoever is hiring: the hiring manager, else the admins. */
  const recipients = job.hiringManagerId
    ? [job.hiringManagerId]
    : (
        await db
          .select({ id: users.id })
          .from(users)
          .where(and(or(inArray(users.role, ["admin", "super_admin"]), eq(users.isHr, true)), inArray(users.status, ["active", "invited"])))
      ).map((row) => row.id);

  await Promise.all(
    recipients.map((id) => notify(id, `${name} applied for ${job.title}`, `/careers/${job.id}/applicants`, "careers")),
  );

  return reply(request, 201, { ok: true });
}

export const OPTIONS = (request: Request) => preflight(request, { write: true });
