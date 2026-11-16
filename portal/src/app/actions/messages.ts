"use server";

import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { messages, threadMembers, threads, users } from "@/db/schema";
import { requireUser } from "@/lib/session";

export async function sendMessage(formData: FormData) {
  const user = await requireUser();

  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!threadId || !body || body.length > 2000) return;

  /** Only members of a thread may post to it. */
  const [membership] = await db
    .select()
    .from(threadMembers)
    .where(and(eq(threadMembers.threadId, threadId), eq(threadMembers.userId, user.id)))
    .limit(1);
  if (!membership) return;

  await db.insert(messages).values({ threadId, senderId: user.id, body });
  revalidatePath("/messages");
}

/** Opens (or reuses) a group thread with everyone who reports to the signed-in user. */
export async function messageMyTeam() {
  const user = await requireUser();

  const reports = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.managerId, user.id));

  if (reports.length === 0) redirect("/messages");

  const name = `${user.name.split(" ")[0]}'s team`;
  const [existing] = await db.select().from(threads).where(eq(threads.name, name)).limit(1);

  let threadId = existing?.id;
  if (!threadId) {
    const [created] = await db.insert(threads).values({ name }).returning();
    threadId = created.id;
    await db
      .insert(threadMembers)
      .values([user.id, ...reports.map((report) => report.id)].map((id) => ({ threadId: created.id, userId: id })));
  } else {
    /** Add anyone who joined the team after the thread was created. */
    const current = await db
      .select({ userId: threadMembers.userId })
      .from(threadMembers)
      .where(eq(threadMembers.threadId, threadId));
    const have = new Set(current.map((row) => row.userId));
    const missing = [user.id, ...reports.map((r) => r.id)].filter((id) => !have.has(id));
    if (missing.length > 0) {
      await db
        .insert(threadMembers)
        .values(missing.map((id) => ({ threadId: threadId!, userId: id })));
    }
  }

  revalidatePath("/messages");
  redirect(`/messages?thread=${threadId}`);
}

/** Starts, or reuses, a one-to-one thread with another member. */
export async function messagePerson(personId: string) {
  const user = await requireUser();
  if (personId === user.id) redirect("/messages");

  const mine = await db
    .select({ threadId: threadMembers.threadId })
    .from(threadMembers)
    .where(eq(threadMembers.userId, user.id));

  const theirs = await db
    .select({ threadId: threadMembers.threadId })
    .from(threadMembers)
    .where(eq(threadMembers.userId, personId));

  const shared = mine
    .map((row) => row.threadId)
    .filter((id) => theirs.some((row) => row.threadId === id));

  let threadId: string | undefined;
  if (shared.length > 0) {
    /** Reuse a direct thread (unnamed) rather than a group one. */
    const candidates = await db
      .select()
      .from(threads)
      .where(inArray(threads.id, shared));
    threadId = candidates.find((thread) => thread.name === null)?.id;
  }

  if (!threadId) {
    const [created] = await db.insert(threads).values({ name: null }).returning();
    threadId = created.id;
    await db.insert(threadMembers).values([
      { threadId: created.id, userId: user.id },
      { threadId: created.id, userId: personId },
    ]);
  }

  redirect(`/messages?thread=${threadId}`);
}
