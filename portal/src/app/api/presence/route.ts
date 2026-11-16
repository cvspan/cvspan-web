import { activeUserId } from "@/lib/session";
import { recordPresence } from "@/modules/attendance";

/** The open portal calls this every minute (see PresenceTracker). It is what clocks people in and out. */
export async function POST() {
  /** Only people who may still sign in, with a session that is still good, are recorded. */
  const userId = await activeUserId();
  if (!userId) return new Response(null, { status: 401 });

  try {
    await recordPresence(userId);
  } catch (error) {
    console.error("Could not record presence", error);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
