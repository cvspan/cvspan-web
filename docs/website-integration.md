# Website integration

The CVSpan website (`cvspan.com`, repo `website-frontend`) and the portal (`cvspan.com/portal`) are two
separate Next.js projects that share one domain. The portal is where the team writes blog posts and
opens roles; the website reads them through a small public API and sends job applications back.

```
 cvspan.com/blog, /careers  ──GET──▶  cvspan.com/portal/api/public/v1/…   (published content only)
 cvspan.com/careers/<role>  ──POST─▶  …/careers/<slug>/apply              (lands in the portal's Applicants page)
 portal publish / edit      ──POST─▶  cvspan.com/api/revalidate            (optional: refresh the site now)
```

## How the two sites share a domain

The portal is built to live under `/portal` (`basePath` in `next.config.ts`, from `src/lib/base-path.ts`).
In production the website proxies that prefix to the portal's own deployment:

```js
// website-frontend/next.config.mjs (already in place)
rewrites: () => [{ source: '/portal/:path*', destination: `${process.env.PORTAL_ORIGIN}/portal/:path*` }]
```

The website has two rewrite rules for this. The first one, for requests carrying an `_rsc` query, puts that
value back when proxying: the portal runs a newer Next.js than the website, checks `_rsc` on every client-side
navigation, and the website strips it, which otherwise ends in an endless redirect (ERR_TOO_MANY_REDIRECTS,
Next's "1 Issue" badge in development). Keep that rule if you edit `next.config.mjs`.

Set `PORTAL_ORIGIN` on the website to wherever the portal is deployed (for example
`https://cvspan-portal.vercel.app`). Visitors only ever see `cvspan.com`. The same rewrite makes the
apply form same-origin, so it needs no CORS in production.

## Environment variables

**Portal** (see `.env.example`)

| Variable | Production value | Purpose |
| --- | --- | --- |
| `AUTH_URL` | `https://cvspan.com` | Origin only. The `/portal` prefix is added in code. |
| `PORTAL_PUBLIC_URL` | `https://cvspan.com/portal` | Turns stored image paths into URLs the website can load. |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://cvspan.com` | "View on website" links in Blog and Careers. |
| `WEBSITE_ORIGINS` | `https://cvspan.com,https://www.cvspan.com` | Origins allowed to **submit applications**. Reading is open to any site. |
| `WEBSITE_REVALIDATE_URL` | `https://cvspan.com/api/revalidate` | Optional. Where to ping after a publish. |
| `WEBSITE_REVALIDATE_SECRET` | any long random string | Optional. Sent as a bearer token. |

**Website**

| Variable | Value | Purpose |
| --- | --- | --- |
| `PORTAL_ORIGIN` | the portal's deployment URL | Enables the `/portal` rewrite. Leave unset in local development. |
| `NEXT_PUBLIC_PORTAL_API_URL` | defaults to `https://cvspan.com/portal/api/public/v1` | Locally: `http://localhost:3000/portal/api/public/v1`. |
| `REVALIDATE_SECRET` | same value as `WEBSITE_REVALIDATE_SECRET` | Lets the portal refresh pages. |

Local development: portal on `:3000`, website on `:2000`, `NEXT_PUBLIC_PORTAL_API_URL` in the website's `.env.local`.

## Endpoints

Base: `/portal/api/public/v1`. All responses are JSON. GETs are cached by a CDN for 60 seconds
(`s-maxage=60, stale-while-revalidate=300`) and are open to any origin.

### `GET /blog?page=1&pageSize=9&category=<slug>&tag=<tag>&q=<text>`

```json
{
  "posts": [{
    "slug": "meet-the-autumn-data-cohort", "title": "…", "excerpt": "…",
    "coverImageUrl": "https://cvspan.com/portal/api/media/…", "coverAlt": "…",
    "category": { "name": "Programmes", "slug": "programmes" }, "tags": ["data"],
    "author": "Ada Obi", "readingMinutes": 3,
    "publishedAt": "2026-09-30T09:00:00.000Z", "updatedAt": "…"
  }],
  "categories": [{ "name": "Programmes", "slug": "programmes" }],
  "pagination": { "page": 1, "pageSize": 9, "total": 12, "pages": 2 }
}
```

`pageSize` is capped at 24. `q` matches the title or excerpt.

### `GET /blog/:slug`

`{ "post": { …summary fields, "bodyHtml": "<p>…</p>" } }`. `404` when the post is not public.
`bodyHtml` is cleaned (allow-listed tags only, no scripts or handlers) and its images are absolute URLs.

### `GET /careers?department=<slug>`

```json
{
  "jobs": [{
    "slug": "marketing-intern", "title": "Marketing Intern", "summary": "…",
    "department": { "name": "Marketing", "slug": "marketing" },
    "employmentType": "internship", "employmentLabel": "Internship",
    "seniorityLabel": "Intern", "workModeLabel": "Remote", "location": "Remote Worldwide",
    "experience": "1–2 years", "language": "English", "openings": 1, "skills": ["Writing"],
    "salary": null, "postedAt": "…", "closingDate": "2026-10-07",
    "apply": { "method": "portal", "target": null }
  }],
  "departments": [{ "name": "Marketing", "slug": "marketing", "openRoles": 1 }]
}
```

`salary` is `null` unless the listing is marked "show salary publicly".

### `GET /careers/:slug`

`{ "job": { …summary fields, "descriptionHtml": "…" } }`. `404` when the role is not open.

### `POST /careers/:slug/apply`

`multipart/form-data` (the resume is a file, so this is not JSON):

| Field | Required | Notes |
| --- | --- | --- |
| `firstName`, `lastName` | yes | Stored together as the candidate's name. |
| `email` | yes | |
| `resume` | yes | PDF, DOC or DOCX, up to 4 MB. Judged by the file's first bytes, not its name. |
| `portfolioUrl` | no | Portfolio or LinkedIn link. |
| `message` | no | Up to 2,000 characters. |
| `website` | no | Hidden honeypot: leave it empty. |

| Status | Meaning |
| --- | --- |
| `201 { ok: true }` | Saved with its resume. The hiring manager (or the admins) get a notification. Applying again with the same email also answers `201` and is not stored twice. |
| `400 { error }` | Validation message, safe to show to the applicant (missing field, wrong file type, file too large). |
| `403` | Called from an origin that is not in `WEBSITE_ORIGINS`. |
| `404` | The role is not open (closed, past its closing date, or never published). |
| `409` | The role takes applications by email or a link instead; use `apply.target`. |
| `429` | More than 5 applications an hour from one address. |

Resumes are kept in the `application_resumes` table, never in the public `media` store. Staff download them from the
portal's Applicants page (`/api/applications/:id/resume`, admins and above only, never cached).

A filled `website` honeypot is silently dropped and still answers `201`.
Roles whose `apply.method` is `email` or `url` should send people to `apply.target` instead; the website does this.

## What is public

- **Posts**: status `published`, or `scheduled` with a publish date in the past. Drafts and posts in review never appear.
- **Roles**: stage `open` and a closing date that has not passed. Screening, interviewing, closed and draft roles never appear.
- Never exposed: hiring manager, applicants, internal notes, stages, and salary unless made public.

## Slugs the website already owns

New post and role slugs skip addresses the website has built-in pages for (`RESERVED_SLUGS` in
`src/lib/website.ts`): `auth`, `dashboard`, `author`, `blog-post`, and the seven legacy role pages
(`front-end`, `graphic-designer`, …). If a website page is added under `/blog` or `/careers`, add its name there.

## Refreshing the website immediately

The website caches API data for a minute. If `WEBSITE_REVALIDATE_URL` is set, the portal also calls it after a
post or role is published, edited, closed or deleted:

```http
POST https://cvspan.com/api/revalidate
Authorization: Bearer <WEBSITE_REVALIDATE_SECRET>
{ "paths": ["/blog", "/blog/meet-the-autumn-data-cohort"], "site": "https://cvspan.com" }
```

It never blocks or fails a save: if the website is unreachable the change simply appears within the minute.

## Known limits

- The apply rate limit is held in memory, per server instance, so on serverless hosting it is a best-effort brake
  rather than a hard cap. Move it to a shared store (Upstash or the database) if applications are ever abused.
- Applicants are not turned into portal accounts yet; hiring someone is a manual step.
- The website's top navigation "Blog" link still points at `read.cvspan.com`.
