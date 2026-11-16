import { eq } from "drizzle-orm";
import { activeUserId } from "@/lib/session";
import { db } from "@/db";
import { applicationResumes, users } from "@/db/schema";
import { atLeast, tierOf } from "@/lib/roles";

/**
 * A candidate's CV, for staff who can see applicants. Never cached or served publicly: it is
 * personal data sent by someone outside the company.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await activeUserId();
  if (!userId) return new Response("Unauthorised", { status: 401 });

  /** The database decides the role, not the token. */
  const [account] = await db
    .select({ role: users.role, isHr: users.isHr, isManagement: users.isManagement, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!account || (account.status !== "active" && account.status !== "invited") || !atLeast(tierOf(account), "hr")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });

  const [row] = await db.select().from(applicationResumes).where(eq(applicationResumes.applicationId, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data), {
    headers: {
      "content-type": row.contentType,
      "content-length": String(row.size),
      "content-disposition": `attachment; filename="${row.filename}"`,
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
    },
  });
}
