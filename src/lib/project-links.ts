/* Named links on a project, e.g. "Figma" → a design file. Pure, so it is easy to test. */

export const MAX_PROJECT_LINKS = 3;
export const MAX_LINK_NAME = 40;

export type ProjectLink = { name: string; url: string };

/**
 * Turns what was typed into a safe absolute http(s) URL, or null. A missing scheme is added
 * ("figma.com/file/x" → "https://figma.com/file/x"). Anything else, such as javascript: or
 * data:, is refused, because these links are rendered as clickable anchors.
 */
export function normalizeUrl(raw: string) {
  const text = raw.trim();
  if (!text) return null;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) && !/^[^/]*:\d+(\/|$)/.test(text);
  try {
    const url = new URL(hasScheme ? text : `https://${text}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Pairs up the submitted names and URLs, ignoring blank rows, and checks every rule. */
export function parseProjectLinks(
  names: string[],
  urls: string[],
): { ok: true; links: ProjectLink[] } | { ok: false; error: string } {
  const links: ProjectLink[] = [];
  const rows = Math.max(names.length, urls.length);

  for (let index = 0; index < rows; index++) {
    const name = (names[index] ?? "").trim();
    const rawUrl = (urls[index] ?? "").trim();
    if (!name && !rawUrl) continue;

    if (!name) return { ok: false, error: `Give the link to ${rawUrl} a name, such as Figma.` };
    if (!rawUrl) return { ok: false, error: `Add a URL for “${name}”, or remove it.` };
    if (name.length > MAX_LINK_NAME) {
      return { ok: false, error: `Link names must be ${MAX_LINK_NAME} characters or fewer.` };
    }

    const url = normalizeUrl(rawUrl);
    if (!url) return { ok: false, error: `“${rawUrl}” isn't a valid web address.` };

    links.push({ name, url });
  }

  if (links.length > MAX_PROJECT_LINKS) {
    return { ok: false, error: `A project can have up to ${MAX_PROJECT_LINKS} links.` };
  }
  return { ok: true, links };
}
