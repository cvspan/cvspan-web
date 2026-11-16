import { getSiteSettings } from "@/db/queries-site";
import { portalPublicUrl, preflight, publicJson } from "@/lib/public-api";
import { toPublicSiteSettings } from "@/lib/public-content";

/**
 * GET /api/public/v1/site-settings
 * What the website needs to describe itself to search engines and analytics: names, share image,
 * verification codes, tracking IDs, robots rules and the custom tags admins added. Nothing private.
 */
export async function GET(request: Request) {
  const settings = await getSiteSettings();
  return publicJson(request, toPublicSiteSettings(settings, portalPublicUrl(request)));
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
