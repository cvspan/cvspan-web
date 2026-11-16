import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { recordPresence } from "@/modules/attendance";

/** The open portal calls this every minute (see PresenceTracker). It is what clocks people in and out. */
export async function POST() {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  /** Only people who may still sign in are recorded, like everywhere else in the portal. */
  const [account] = await db.select({ status: users.status }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!account || (account.status !== "active" && account.status !== "invited")) return new Response(null, { status: 403 });

  try {
    await recordPresence(session.user.id);
  } catch (error) {
    console.error("Could not record presence", error);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
