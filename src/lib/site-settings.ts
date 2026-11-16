import { Parser } from "htmlparser2";

/*
 * Site settings: what search engines, social networks and analytics are told about the website.
 * Pure, so every rule (what an ID looks like, which tags may go in the head) is tested without a
 * database. Admins type these in; the website renders them, so nothing here trusts its input.
 */

export type SiteSettings = {
  siteName: string | null;
  tagline: string | null;
  description: string | null;
  titleTemplate: string | null;
  defaultShareImage: string | null;
  twitterHandle: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  googleVerification: string | null;
  bingVerification: string | null;
  yandexVerification: string | null;
  facebookDomainVerification: string | null;
  gaMeasurementId: string | null;
  gtmContainerId: string | null;
  metaPixelId: string | null;
  linkedinPartnerId: string | null;
  allowIndexing: boolean;
  robotsExtra: string | null;
  headTags: string | null;
  bodyStartTags: string | null;
  bodyEndTags: string | null;
};

/** Nothing filled in yet: the website behaves as it always did. */
export const EMPTY_SITE_SETTINGS: SiteSettings = {
  siteName: null, tagline: null, description: null, titleTemplate: null, defaultShareImage: null, twitterHandle: null,
  facebookUrl: null, twitterUrl: null, instagramUrl: null, linkedinUrl: null, tiktokUrl: null, youtubeUrl: null,
  googleVerification: null, bingVerification: null, yandexVerification: null, facebookDomainVerification: null,
  gaMeasurementId: null, gtmContainerId: null, metaPixelId: null, linkedinPartnerId: null,
  allowIndexing: true, robotsExtra: null, headTags: null, bodyStartTags: null, bodyEndTags: null,
};

/* ------------------------------------------------------------------ Field rules */

const blank = (value: string | null | undefined) => (value ?? "").trim();

/** Each returns the cleaned value, or an error message. An empty field is fine (null). */
type Checked = { ok: true; value: string | null } | { ok: false; error: string };
const good = (value: string | null): Checked => ({ ok: true, value });
const bad = (error: string): Checked => ({ ok: false, error });

function pattern(label: string, regex: RegExp, example: string) {
  return (raw: string | null | undefined): Checked => {
    const value = blank(raw).toUpperCase();
    if (!value) return good(null);
    return regex.test(value) ? good(value) : bad(`${label} should look like ${example}.`);
  };
}

export const checkGaId = pattern("The Google Analytics measurement ID", /^G-[A-Z0-9]{6,14}$/, "G-ABC123XYZ9");
export const checkGtmId = pattern("The Google Tag Manager container ID", /^GTM-[A-Z0-9]{4,10}$/, "GTM-ABC1234");
export const checkPixelId = pattern("The Meta Pixel ID", /^\d{8,20}$/, "1234567890123456");
export const checkLinkedinId = pattern("The LinkedIn partner ID", /^\d{4,12}$/, "1234567");

/**
 * Webmaster tools give a whole tag (`<meta name="google-site-verification" content="abc…">`) or just
 * the code. Either is accepted; only the code is kept.
 */
export function checkVerification(raw: string | null | undefined): Checked {
  let value = blank(raw);
  if (!value) return good(null);
  const fromTag = /content\s*=\s*["']([^"']+)["']/i.exec(value);
  if (fromTag) value = fromTag[1].trim();
  return /^[A-Za-z0-9_-]{8,128}$/.test(value) ? good(value) : bad("That doesn't look like a verification code. Paste the code or the whole meta tag.");
}

export function checkUrl(label: string, raw: string | null | undefined): Checked {
  const value = blank(raw);
  if (!value) return good(null);
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return bad(`${label} must start with https://`);
    return good(url.toString().replace(/\/$/, ""));
  } catch {
    return bad(`${label} isn't a valid address.`);
  }
}

export function checkHandle(raw: string | null | undefined): Checked {
  const value = blank(raw).replace(/^@/, "");
  if (!value) return good(null);
  return /^[A-Za-z0-9_]{1,15}$/.test(value) ? good(`@${value}`) : bad("A handle is up to 15 letters, numbers or underscores.");
}

export function checkTitleTemplate(raw: string | null | undefined): Checked {
  const value = blank(raw);
  if (!value) return good(null);
  if (!value.includes("%s")) return bad("The title pattern needs %s where the page's own title goes, for example %s | CVSpan.");
  return value.length <= 80 ? good(value) : bad("Keep the title pattern under 80 characters.");
}

export function checkText(label: string, max: number) {
  return (raw: string | null | undefined): Checked => {
    const value = blank(raw).replace(/\s+/g, " ");
    if (!value) return good(null);
    return value.length <= max ? good(value) : bad(`${label} must be ${max} characters or fewer.`);
  };
}

/** A share image is one we stored, or a path on the website. Nothing else, so a setting can't point at a stranger's file. */
export function checkImagePath(raw: string | null | undefined): Checked {
  const value = blank(raw);
  if (!value) return good(null);
  const stored = /^\/api\/media\/[0-9a-f-]{36}$/i.test(value);
  const onSite = /^\/[\w./-]+$/.test(value) && !value.includes("..") && !value.startsWith("//");
  return stored || onSite ? good(value) : bad("Upload the share image again.");
}

/* ----------------------------------------------------------------------- robots.txt */

const ROBOTS_LINE = /^(user-agent|disallow|allow|sitemap|crawl-delay)\s*:\s*\S.*$/i;

/** Extra robots.txt lines: only the standard directives, so the setting can't write anything else into the file. */
export function checkRobotsExtra(raw: string | null | undefined): Checked {
  const lines = blank(raw)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return good(null);
  const wrong = lines.find((line) => !ROBOTS_LINE.test(line) && !line.startsWith("#"));
  if (wrong) return bad(`"${wrong.slice(0, 40)}" isn't a robots.txt rule. Use User-agent, Allow, Disallow, Sitemap or Crawl-delay.`);
  return good(lines.join("\n"));
}

/* ------------------------------------------------------------------------ Custom tags */

export type CustomTag = {
  tag: "script" | "meta" | "link" | "style" | "noscript";
  attrs: Record<string, string>;
  /** The text inside a script or style, or the inner HTML of a noscript. */
  content?: string;
};

export type Placement = "head" | "bodyStart" | "bodyEnd";

const ALLOWED: Record<Placement, CustomTag["tag"][]> = {
  head: ["script", "meta", "link", "style", "noscript"],
  bodyStart: ["script", "noscript", "style"],
  bodyEnd: ["script", "noscript", "style"],
};

const LINK_RELS = new Set(["stylesheet", "preconnect", "dns-prefetch", "preload", "prefetch", "icon", "apple-touch-icon", "manifest", "alternate"]);
const SAFE_ATTR = /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/;
const MAX_TAG_TEXT = 20_000;
/** Void elements have no closing tag, so they never hold content. */
const VOID = new Set(["meta", "link"]);

const isSafeUrl = (value: string) => /^https:\/\//i.test(value) || (/^\/(?!\/)/.test(value) && !/^\/\\/.test(value));

/**
 * Turns the HTML an admin pasted (a GTM snippet, a verification meta, a pixel) into a list of tags the
 * website can render as real elements. Anything that isn't one of the allowed tags, or that points at a
 * non-https address, is reported instead of stored, and the website never receives raw HTML.
 */
export function parseCustomTags(html: string | null | undefined, placement: Placement): { tags: CustomTag[]; problems: string[] } {
  const source = blank(html);
  const tags: CustomTag[] = [];
  const problems: string[] = [];
  if (!source) return { tags, problems };
  if (source.length > MAX_TAG_TEXT) return { tags, problems: [`Keep this box under ${MAX_TAG_TEXT.toLocaleString()} characters.`] };

  type Open = { tag: CustomTag["tag"]; attrs: Record<string, string>; innerStart: number; text: string };
  let open: Open | null = null;
  let depth = 0;
  const allowed = ALLOWED[placement];

  const parser = new Parser(
    {
      onopentag(name, attribs) {
        if (open) {
          depth += 1;
          return;
        }
        const tag = name.toLowerCase() as CustomTag["tag"];
        if (!allowed.includes(tag)) {
          problems.push(`<${name}> can't be used here. Allowed: ${allowed.map((item) => `<${item}>`).join(", ")}.`);
          return;
        }

        const attrs: Record<string, string> = {};
        for (const [key, value] of Object.entries(attribs)) {
          if (!SAFE_ATTR.test(key)) continue;
          if (tag !== "script" && tag !== "noscript" && /^on/i.test(key)) continue;
          attrs[key.toLowerCase()] = value;
        }

        if (tag === "script" && attrs.src && !/^https:\/\//i.test(attrs.src)) {
          problems.push(`A script address must start with https:// (found "${attrs.src.slice(0, 40)}").`);
          return;
        }
        if (tag === "link") {
          const rel = (attrs.rel ?? "").toLowerCase();
          if (!LINK_RELS.has(rel)) problems.push(`<link rel="${rel}"> isn't allowed. Allowed: ${[...LINK_RELS].join(", ")}.`);
          else if (!attrs.href || !isSafeUrl(attrs.href)) problems.push(`A link's address must start with https:// or /.`);
          else tags.push({ tag, attrs });
          return;
        }
        if (tag === "meta") {
          if (/^refresh$/i.test(attrs["http-equiv"] ?? "")) problems.push("A refresh meta tag redirects visitors, so it isn't allowed.");
          else if (!attrs.name && !attrs.property && !attrs["http-equiv"] && !attrs.charset && !attrs.itemprop) problems.push("A meta tag needs a name or property.");
          else tags.push({ tag, attrs });
          return;
        }

        open = { tag, attrs, innerStart: parser.endIndex + 1, text: "" };
        depth = 0;
      },
      ontext(text) {
        if (open && depth === 0 && (open.tag === "script" || open.tag === "style")) open.text += text;
        else if (!open && text.trim()) problems.push(`Text outside a tag was ignored: "${text.trim().slice(0, 30)}".`);
      },
      onclosetag(name) {
        if (!open) return;
        if (depth > 0) {
          depth -= 1;
          return;
        }
        if (VOID.has(name)) return;
        const finished = open;
        open = null;
        const content = finished.tag === "noscript" ? source.slice(finished.innerStart, parser.startIndex).trim() : finished.text.trim();
        tags.push({ tag: finished.tag, attrs: finished.attrs, ...(content ? { content } : {}) });
      },
    },
    { recognizeSelfClosing: true, decodeEntities: false },
  );
  parser.write(source);
  parser.end();

  if (open) problems.push("A tag isn't closed. Check for a missing closing tag.");
  return { tags, problems: [...new Set(problems)] };
}

/* ------------------------------------------------------------------- Health checks */

export type Check = { key: string; level: "ok" | "warn" | "todo"; label: string; detail: string };

/** What to fix first, in plain words: the list shown beside the form. */
export function seoChecks(settings: Pick<SiteSettings, "description" | "siteName" | "defaultShareImage" | "gaMeasurementId" | "gtmContainerId" | "googleVerification" | "bingVerification" | "titleTemplate" | "allowIndexing" | "facebookUrl" | "twitterUrl" | "instagramUrl" | "linkedinUrl" | "tiktokUrl" | "youtubeUrl">): Check[] {
  const description = blank(settings.description);
  const socials = [settings.facebookUrl, settings.twitterUrl, settings.instagramUrl, settings.linkedinUrl, settings.tiktokUrl, settings.youtubeUrl].filter(Boolean).length;

  return [
    settings.allowIndexing
      ? { key: "indexing", level: "ok", label: "Search engines can index the site", detail: "Pages are open to Google and Bing." }
      : { key: "indexing", level: "warn", label: "The site is hidden from search engines", detail: "Indexing is switched off. Turn it back on before launch." },
    !description
      ? { key: "description", level: "todo", label: "Add a site description", detail: "It is the default text under your link in search results." }
      : description.length < 70 || description.length > 160
        ? { key: "description", level: "warn", label: "Tune the description length", detail: `${description.length} characters. Between 70 and 160 shows in full without being cut off.` }
        : { key: "description", level: "ok", label: "Description is a good length", detail: `${description.length} characters.` },
    blank(settings.siteName)
      ? { key: "name", level: "ok", label: "Site name is set", detail: blank(settings.siteName) }
      : { key: "name", level: "todo", label: "Add the site name", detail: "Used in titles, share cards and structured data." },
    blank(settings.titleTemplate)
      ? { key: "title", level: "ok", label: "Page titles follow a pattern", detail: blank(settings.titleTemplate) }
      : { key: "title", level: "todo", label: "Set a title pattern", detail: "For example %s | CVSpan, so every page title ends the same way." },
    blank(settings.defaultShareImage)
      ? { key: "image", level: "ok", label: "Default share image is set", detail: "Shown when a page without its own image is shared." }
      : { key: "image", level: "todo", label: "Upload a default share image", detail: "1200 × 630 works on every network." },
    blank(settings.gaMeasurementId) || blank(settings.gtmContainerId)
      ? { key: "analytics", level: "ok", label: "Analytics is connected", detail: blank(settings.gtmContainerId) ? "Through Google Tag Manager." : "Google Analytics 4." }
      : { key: "analytics", level: "todo", label: "Connect analytics", detail: "Add a Google Analytics 4 measurement ID or a Tag Manager container." },
    blank(settings.googleVerification) || blank(settings.bingVerification)
      ? { key: "verification", level: "ok", label: "Search Console verification is set", detail: "You can submit the sitemap." }
      : { key: "verification", level: "todo", label: "Verify the site with Google or Bing", detail: "Needed to see search performance and submit the sitemap." },
    socials >= 3
      ? { key: "social", level: "ok", label: "Social profiles are linked", detail: `${socials} profiles are shared with search engines.` }
      : { key: "social", level: "warn", label: "Link your social profiles", detail: "They help search engines connect the site to your brand." },
  ];
}
