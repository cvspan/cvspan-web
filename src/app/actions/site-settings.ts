"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { logActivity, requireRole } from "./guards";
import {
  checkGaId,
  checkGtmId,
  checkHandle,
  checkImagePath,
  checkLinkedinId,
  checkPixelId,
  checkRobotsExtra,
  checkText,
  checkTitleTemplate,
  checkUrl,
  checkVerification,
  parseCustomTags,
  type Placement,
} from "@/lib/site-settings";
import { fail, ok, type ActionResult } from "@/lib/validation";
import { pingWebsite } from "@/lib/website-sync";

const value = (formData: FormData, key: string) => String(formData.get(key) ?? "");

/** Saves the site's search and tracking settings. Admins only; every field is checked and the first problem is reported. */
export async function saveSiteSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireRole("admin");

  const problems: string[] = [];
  const take = <T extends { ok: boolean }>(result: T & ({ ok: true; value: string | null } | { ok: false; error: string })) => {
    if (!result.ok) {
      problems.push((result as { error: string }).error);
      return null;
    }
    return (result as { value: string | null }).value;
  };

  const tags = (key: string, placement: Placement, label: string) => {
    const raw = value(formData, key).trim();
    const { problems: found } = parseCustomTags(raw, placement);
    for (const problem of found) problems.push(`${label}: ${problem}`);
    return raw || null;
  };

  const values = {
    siteName: take(checkText("The site name", 60)(value(formData, "siteName"))),
    tagline: take(checkText("The tagline", 100)(value(formData, "tagline"))),
    description: take(checkText("The description", 320)(value(formData, "description"))),
    titleTemplate: take(checkTitleTemplate(value(formData, "titleTemplate"))),
    defaultShareImage: take(checkImagePath(value(formData, "defaultShareImage"))),
    twitterHandle: take(checkHandle(value(formData, "twitterHandle"))),
    facebookUrl: take(checkUrl("The Facebook address", value(formData, "facebookUrl"))),
    twitterUrl: take(checkUrl("The X address", value(formData, "twitterUrl"))),
    instagramUrl: take(checkUrl("The Instagram address", value(formData, "instagramUrl"))),
    linkedinUrl: take(checkUrl("The LinkedIn address", value(formData, "linkedinUrl"))),
    tiktokUrl: take(checkUrl("The TikTok address", value(formData, "tiktokUrl"))),
    youtubeUrl: take(checkUrl("The YouTube address", value(formData, "youtubeUrl"))),
    googleVerification: take(checkVerification(value(formData, "googleVerification"))),
    bingVerification: take(checkVerification(value(formData, "bingVerification"))),
    yandexVerification: take(checkVerification(value(formData, "yandexVerification"))),
    facebookDomainVerification: take(checkVerification(value(formData, "facebookDomainVerification"))),
    gaMeasurementId: take(checkGaId(value(formData, "gaMeasurementId"))),
    gtmContainerId: take(checkGtmId(value(formData, "gtmContainerId"))),
    metaPixelId: take(checkPixelId(value(formData, "metaPixelId"))),
    linkedinPartnerId: take(checkLinkedinId(value(formData, "linkedinPartnerId"))),
    /** The form sends "0" first and "1" when ticked, so look at every value, not the first. */
    allowIndexing: formData.getAll("allowIndexing").includes("1"),
    robotsExtra: take(checkRobotsExtra(value(formData, "robotsExtra"))),
    headTags: tags("headTags", "head", "Head tags"),
    bodyStartTags: tags("bodyStartTags", "bodyStart", "Start of body tags"),
    bodyEndTags: tags("bodyEndTags", "bodyEnd", "End of body tags"),
  };

  if (problems.length > 0) return fail(problems.length === 1 ? problems[0] : `${problems[0]} (and ${problems.length - 1} more to fix)`);

  await db
    .insert(siteSettings)
    .values({ id: "site", ...values, updatedById: user.id })
    .onConflictDoUpdate({ target: siteSettings.id, set: { ...values, updatedAt: new Date(), updatedById: user.id } });

  await logActivity(user.id, "changed the site's search and tracking settings");
  revalidatePath("/site-settings");
  revalidatePath("/", "layout");
  /** The website caches settings for a minute; this makes a change (or a switch-off) show straight away. */
  after(() => pingWebsite(["/", "/robots.txt"]));
  return ok;
}
