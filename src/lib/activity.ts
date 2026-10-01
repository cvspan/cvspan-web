import "server-only";
import { db } from "@/db";
import { portalActivity } from "@/db/schema";
import { companyDay } from "./dates";

/** Days already written by this server process, so a busy day costs one query, not one per page. */
const recorded = new Set<string>();

/** Notes that a person opened the portal today. Feeds the "daily login" criterion. */
export async function recordPortalActivity(userId: string) {
  const day = companyDay();
  const key = `${userId}:${day}`;
  if (recorded.has(key)) return;

  try {
    await db.insert(portalActivity).values({ userId, day }).onConflictDoNothing();
    recorded.add(key);
    /** Keep the set from growing for ever on a long-lived process. */
    if (recorded.size > 5000) recorded.clear();
  } catch (error) {
    /** Tracking is best-effort: a failed write must never break the page that triggered it. */
    console.error("Could not record portal activity", error);
  }
}
