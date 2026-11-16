import { and, desc, eq } from "drizzle-orm";
import { activeUserId } from "@/lib/session";
import { db } from "@/db";
import { messages, threadMembers } from "@/db/schema";

/**
 * The newest message id in a conversation. The messages screen asks this every few seconds and
 * only reloads its data when the answer changes, so an idle conversation costs one tiny query.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  const userId = await activeUserId();
  if (!userId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const { threadId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(threadId)) return Response.json({ latestId: null });

  /** Only members may see a conversation, even just its newest id. */
  const [membership] = await db
    .select({ id: threadMembers.id })
    .from(threadMembers)
    .where(and(eq(threadMembers.threadId, threadId), eq(threadMembers.userId, userId)))
    .limit(1);
  if (!membership) return Response.json({ error: "Forbidden" }, { status: 403 });

  const [latest] = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(desc(messages.createdAt))
    .limit(1);

  return Response.json({ latestId: latest?.id ?? null }, { headers: { "Cache-Control": "no-store" } });
}
