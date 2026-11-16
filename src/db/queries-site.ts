import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { siteSettings } from "./schema";
import { EMPTY_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings";

/** The one settings row, or the empty defaults if it hasn't been created. */
export async function getSiteSettings(): Promise<SiteSettings & { updatedAt: Date | null }> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, "site")).limit(1);
  if (!row) return { ...EMPTY_SITE_SETTINGS, updatedAt: null };
  const { id: _id, updatedById, ...rest } = row;
  /** The row exists from the migration; it only counts as saved once someone has saved it. */
  return { ...rest, updatedAt: updatedById ? rest.updatedAt : null };
}
