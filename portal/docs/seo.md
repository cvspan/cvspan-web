# Search and analytics

CVSpan is two apps on one domain: the **website** (`www.cvspan.com`, repo `website-frontend`) and the
**portal** (`www.cvspan.com/portal`). Search engines see one site. This page says what is meant to be
found, what is deliberately kept out, and how everything stays up to date without anyone editing a list.

## What is indexed

| Area | Indexed | Notes |
| --- | --- | --- |
| Website pages (home, services, industries, work, about, careers, contact, legal) | Yes | Canonical URL, title, description, Open Graph and structured data on every page. |
| Team profiles `/about/teams/<id>` | Yes | Unknown ids return 404. |
| Blog `/blog` and every post `/blog/<slug>` | Yes | Server-rendered; `BlogPosting` data; RSS at `/blog/rss.xml`; "More from the blog" links on each post. |
| Careers: list and every open role | Yes | `JobPosting` data with the full description, closing date (`validThrough`) and public salary. A role leaves the sitemap when it closes. |
| Portal sign-in `/portal/login` | Yes | The only public page of the portal, so "CVSpan portal" finds the way in. |
| Everything else in the portal | **No** | Staff data. Blocked by sign-in, by `robots.txt`, by `noindex` meta and by an `X-Robots-Tag` header. |
| `/blog/auth`, `/blog/dashboard`, `/blog/author`, `/api` | No | Private or placeholder. |

## How the sitemap stays current

`/sitemap.xml` (website) is generated from three live sources:

1. **Every public page in `src/app`.** `scripts/generate-routes.mjs` scans the folders before `npm run dev` and
   `npm run build`, so a new page appears in the sitemap with no edit. A page is skipped if it has a dynamic
   segment, sits under a private area, or marks itself `noindex`. Last-modified comes from git.
2. **Team profiles** from the site's own data.
3. **Blog posts and open roles** from the portal's public API, with all pages of posts followed.

Publishing in the portal also pings the website (`WEBSITE_REVALIDATE_URL`), which refreshes the changed page, the
sitemap and the RSS feed immediately and, if configured, tells Bing and other IndexNow engines. With no ping, the
sitemap rebuilds within a minute anyway.

## One host

The canonical host is **`https://www.cvspan.com`** everywhere (`SITE_URL` on the website,
`NEXT_PUBLIC_WEBSITE_URL` on the portal). Redirect the bare domain `cvspan.com` to it permanently at your host or
DNS, otherwise every page exists twice and ranking is split.

## Analytics (Google Analytics 4)

One GA4 property for both apps, so a visit that moves from the site into `/portal` is a single journey.

1. Create a GA4 property and copy the measurement ID (`G-…`).
2. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` on **both** the website and the portal.
3. Redeploy. Nothing is sent until the ID is set.

Behaviour:

- **Consent Mode.** Storage is denied by default. The website shows a small Accept / Decline notice; the choice is
  saved in `localStorage` on the shared origin and the portal honours it. Declining keeps analytics cookieless.
- **Portal privacy.** No user id or email is sent. Page views carry the path only, never the query string.
- **Events** (website): `generate_lead` (a job application is submitted), `share` (an article share or copy-link),
  `search` (blog search). Mark `generate_lead` as a key event in GA4.

## Search Console and Bing

1. Add the property `https://www.cvspan.com` in Google Search Console. Choose "HTML tag" and put the code in
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on the website. Do the same for Bing with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
2. Submit `https://www.cvspan.com/sitemap.xml` in both.
3. Optional, faster indexing on Bing/Yandex: set `INDEXNOW_KEY` on the website (any 8 to 128 letters, numbers or
   dashes). The key is served at `/api/indexnow-key` and every portal publish submits the changed URLs.

## Site settings (managed in the portal)

Admins manage search and tracking from **Website → Site settings** in the portal, with no deploy. The website
reads them from `/api/public/v1/site-settings` (cached for a minute; saving pings the site so it shows at once).
Anything left empty keeps the website's built-in value, and if the portal is unreachable the website uses its
built-ins, so a portal outage never changes how the site looks to search engines.

| Section | What it controls |
| --- | --- |
| Site identity | Site name, tagline, page-title pattern (`%s | CVSpan`), default description, default share image, X handle. |
| Social profiles | Six profile URLs, published as the Organization's `sameAs` in structured data. |
| Search engines | An **indexing switch** (off = `Disallow: /` in robots.txt and `noindex` on every page, for staging or pre-launch), verification codes for Google, Bing, Yandex and Facebook (paste the code or the whole meta tag), and extra robots.txt rules. |
| Analytics and tracking | Google Analytics 4 ID (also used by the portal, so one property sees both), Google Tag Manager container, Meta Pixel and LinkedIn Insight. GA and GTM start with storage denied (Consent Mode); the Meta and LinkedIn pixels do not load at all until a visitor accepts cookies. |
| Custom tags | Raw tags for the head, the start of the body and the end of the body. |

Custom tags are checked when saved and **parsed into plain data**: only `script` (https source), `meta`, `link`
(a short list of `rel` values), `style` and `noscript` are accepted, refresh redirects and `on…` handlers are
refused, and the website renders real elements instead of trusting raw HTML. They run for every visitor, so only
paste code from tools you trust. They are never added to the portal, which holds staff data.

The Health list beside the form says what is still missing (description length, share image, analytics,
verification, social profiles) and the previews show the result as it would appear in Google and when shared.

### What is tracked

Beyond page views, the website records (to Google Analytics and the Tag Manager data layer, after consent):
`click_outbound`, `click_email`, `click_phone`, `file_download`, `form_submit`, `scroll_depth` (50 and 90 percent),
and the existing `generate_lead`, `share` and `search`. The portal records `share` (certificate shares) and page
views. No names, emails, ids or form values are sent.

### Auditing

`node scripts/seo-audit.mjs [site url]` in the website repo fetches every public page and reports missing or badly
sized titles and descriptions, canonicals, `noindex`, the number of `h1`s, Open Graph and Twitter tags, structured
data and images without alt text. It exits non-zero on any problem, so it can run in CI.

## Environment variables

| App | Variable | Purpose |
| --- | --- | --- |
| Website | `NEXT_PUBLIC_SITE_URL` | Canonical origin. Defaults to `https://www.cvspan.com`. |
| Website, portal | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID. Site settings overrides it when set. |
| Website | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Webmaster tool ownership. |
| Website | `INDEXNOW_KEY` | Enables IndexNow. |
| Website | `REVALIDATE_SECRET` | Lets the portal refresh pages and the sitemap on publish. |
| Portal | `NEXT_PUBLIC_WEBSITE_URL` | Canonical origin used for links and the sign-in page's canonical. |
| Portal | `WEBSITE_REVALIDATE_URL`, `WEBSITE_REVALIDATE_SECRET` | The publish ping. |

## Checks worth running after a release

- `https://www.cvspan.com/sitemap.xml` lists the new page or post.
- `https://www.cvspan.com/robots.txt` still allows `/portal/login` and blocks the rest of `/portal/`.
- Google's Rich Results Test on one blog post and one open role.
- A portal app page (for example `/portal/people`) answers with `X-Robots-Tag: noindex`.
