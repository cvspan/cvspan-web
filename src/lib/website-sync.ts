import "server-only";
import { websiteUrl } from "./website";

/**
 * Tells the public website its content changed so it can refresh now instead of waiting for its
 * cache. Optional: it only runs when WEBSITE_REVALIDATE_URL is set, it never blocks or fails an
 * action, and it sends paths, not data (the website fetches what it needs from the public API).
 */
export async function pingWebsite(paths: string[]) {
  const url = process.env.WEBSITE_REVALIDATE_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WEBSITE_REVALIDATE_SECRET
          ? { authorization: `Bearer ${process.env.WEBSITE_REVALIDATE_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ paths, site: websiteUrl() }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (error) {
    console.warn("Could not notify the website of a content change", error);
  }
}
