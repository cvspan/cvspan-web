/*
 * The portal lives at cvspan.com/portal, so every URL it hands to the browser must carry that
 * prefix. Next adds it to <Link>, router calls and redirects by itself; this file covers what it
 * doesn't: plain <a href>, fetch(), and the media URLs stored in blog posts.
 *
 * Set NEXT_PUBLIC_BASE_PATH to change it ("/" or "" serves the portal from the root).
 */

const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portal";

export const BASE_PATH = raw === "/" ? "" : raw.replace(/\/+$/, "");

/** "/api/export/people" → "/portal/api/export/people". Absolute URLs and already-prefixed paths pass through. */
export function withBasePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * Uploaded images are stored as portable paths ("/api/media/<id>"), so the database never
 * depends on where the portal is mounted. These helpers add or remove the prefix at the edges.
 */
export const MEDIA_PREFIX = "/api/media/";

/** A stored image path, ready for an <img> inside the portal. */
export function mediaSrc(src: string) {
  return src.startsWith(MEDIA_PREFIX) ? `${BASE_PATH}${src}` : src;
}

/** Stored post HTML → what the editor should display. */
export function htmlForEditor(html: string) {
  return BASE_PATH ? html.replaceAll(`src="${MEDIA_PREFIX}`, `src="${BASE_PATH}${MEDIA_PREFIX}`) : html;
}

/** Editor HTML → what gets stored, with the prefix taken back off. */
export function htmlForStorage(html: string) {
  return BASE_PATH ? html.replaceAll(`src="${BASE_PATH}${MEDIA_PREFIX}`, `src="${MEDIA_PREFIX}`) : html;
}

/** Stored HTML → HTML for another site, with every uploaded image as a full URL. */
export function htmlWithAbsoluteMedia(html: string, portalUrl: string) {
  return html.replaceAll(`src="${MEDIA_PREFIX}`, `src="${portalUrl}${MEDIA_PREFIX}`);
}

/** A stored image path as a full URL for another site. Other hosts (e.g. Unsplash) are left alone. */
export function absoluteMedia(src: string | null, portalUrl: string) {
  if (!src) return null;
  return src.startsWith(MEDIA_PREFIX) ? `${portalUrl}${src}` : src;
}
