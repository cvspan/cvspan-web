import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data), {
    headers: {
      "content-type": row.contentType,
      "content-length": String(row.size),
      /** Rows are immutable once written, so this can be cached hard. */
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
