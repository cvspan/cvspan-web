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

## Environment variables

| App | Variable | Purpose |
| --- | --- | --- |
| Website | `NEXT_PUBLIC_SITE_URL` | Canonical origin. Defaults to `https://www.cvspan.com`. |
| Website, portal | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID. |
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
