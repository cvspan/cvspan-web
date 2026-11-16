# Architecture and scale review

Written 2026-10-30. It covers the CVSpan Portal and the public pieces it feeds (the website API, the share
images). It says what would break first as traffic grows, what was changed now without changing behaviour,
and what is deliberately left as a plan.

**Where the system is today.** 12 people, one Neon Postgres database, Next.js on serverless functions, JWT
sessions. Most of the code is already shaped well for scaling: the business rules live in pure, tested
functions (`src/lib/leave.ts`, `grading.ts`, `certificates.ts`, `objectives.ts`, `roles.ts`,
`src/modules/attendance/domain`) with no framework or database in them. The weak spots are in data access and
in two places where the app stores or serves too much itself (media in Postgres, work done on page views).

"1,000,000 users" has two very different meanings here, and the answer differs:

- **Staff using the portal** is bounded by headcount. Even a very large company is tens of thousands. That is
  comfortably within what this design handles once the changes below are made.
- **Public traffic** (website blog, careers, team, certificate verify pages and share images) can be huge.
  That is a read-mostly workload and is solved by caching at the CDN, not by the database.

## 1. Folder structure

The code already separates a pure core (`src/lib`) from adapters (`src/db`, `src/app`). The target is to make
that explicit per business area, one module at a time, without a big-bang move. `src/modules/attendance` is the
first and is the pattern to copy.

```
src/
  modules/<area>/            attendance, leave, certificates, performance, people, website, access
    domain/                  pure rules and types. No imports from next, drizzle, react or node.
    application/             use cases. Take their dependencies as arguments (ports).
      ports.ts               interfaces: repositories, throttle, clock, queue, notifier
    infrastructure/          adapters: drizzle repositories, redis, object storage
    index.ts                 composition root: the only place that picks adapters
  app/                       routes, pages, server actions. Thin: parse input, call a use case, render.
  db/                        schema, migrations, shared SQL helpers
  components/                UI only
```

Rules that keep it honest: `domain` imports nothing outside itself; `application` imports only `domain` and its
own ports; only `infrastructure` and `index.ts` know about the database; pages and actions call the module's
`index.ts`.

## 2. Bottlenecks and how each is handled

| # | Where | What fails as it grows | Status |
|---|-------|------------------------|--------|
| 1 | Presence pings (`/api/presence`) | One ping per open tab per minute, each doing up to four queries. 10,000 people online is about 170 pings a second and 700 queries a second against one table. Several tabs multiply it. | **Reduced now.** Pings within 45 seconds collapse into one write (`COALESCE_WINDOW_MS`), behind a `PresenceThrottle` port. **Plan:** a Redis adapter for the throttle and for the last-seen time, flushed to Postgres every few minutes, makes the write rate independent of the number of tabs. |
| 2 | Missing indexes | Every per-person list (notifications, KPI scores, leave, certificates, enrolments, the approvals queue, message threads, the activity log) scanned its whole table. Invisible at a dozen people. | **Fixed now.** 16 indexes, `npm run db:migrate-indexes`, declared in `schema.ts` too so they are not dropped by a schema push. |
| 3 | `getAttendanceRate` | Loaded every attendance row for a person into memory to count them. | **Fixed now.** One aggregate query. Same result. |
| 4 | Share image and verify page | The Satori render is CPU work and repeated for every crawler hit. | **Fixed now.** `Cache-Control` on the image (5 minutes valid, 1 minute otherwise) so the CDN serves repeats. The public API already sends `s-maxage=60`. |
| 5 | Uploaded images and CVs stored in Postgres (`media`, `application_resumes`, `bytea`) | Each request loads the whole file into function memory; the database becomes the file server, backups balloon, and a viral image saturates the database. The one-year `immutable` header protects the CDN path only. | **Plan, biggest remaining risk.** Move to object storage (S3, R2, Vercel Blob) behind the existing `/api/upload` and `/api/media` URLs, which already hide the storage choice from callers. |
| 6 | `getPeople()` and `getTeamPresence()` | Unbounded: every page that lists people loads all of them. Fine for thousands, wrong for tens of thousands. | **Plan.** Cursor pagination and server-side search; presence for a manager is already limited to their reports. |
| 7 | Global search (`/api/search`) | `ILIKE '%term%'` cannot use a normal index. | **Plan.** `pg_trgm` GIN indexes on the searched columns. |
| 8 | Work done on page views | `ensureDueCertificateRequests()` runs when an admin opens Approvals or Certificates. Several admins opening it at once race each other (the unique reference column makes that safe, not cheap). | **Plan.** A scheduled job (Vercel Cron or a queue worker) running the same function. |
| 9 | Fan-out in loops | Notifications are sent one `await` at a time (`for (...) await notify(...)`). A post sent for review to many admins, or a cohort certificate run, serialises into many round trips. | **Plan.** Batch insert in one statement, then a queue for anything slow. |
| 10 | `nextReference` / `getAllReferences` | Reads every certificate reference to pick the next number. | **Plan.** A Postgres sequence per year. |
| 11 | In-memory rate limit on the apply endpoint | Per instance, so the limit multiplies with the number of instances. | **Plan.** Shared counter (Upstash Redis). |
| 12 | `requireUser` | One primary-key lookup per request to trust the database over the token. Correct and cheap; `cache()` already dedupes it within a request. | Fine. A 30-second shared cache is available if it ever shows in profiles. |

What is already right for scale: JWT sessions (no session store to scale), the Neon HTTP driver (no connection
pool to exhaust, each call stateless), a unique index per person per day so concurrent writes cannot duplicate,
idempotent migrations, and pure domain logic that can be unit-tested without infrastructure.

## 3. What changed (behaviour is unchanged)

- `src/modules/attendance`: presence moved to ports and adapters. `domain/presence.ts` (pure rules, moved from
  `lib/attendance.ts`), `application/record-presence.ts` (the use case), `application/ports.ts`
  (`AttendanceRepository`, `PresenceThrottle`), `infrastructure/` (Drizzle repository, bounded in-memory
  throttle, sign-out), `index.ts` (composition root). The use case is tested against an in-memory store with no
  database.
- 16 indexes (`src/db/migrate-indexes.ts`).
- `getAttendanceRate` as a single aggregate.
- Cache headers on the certificate share image.

## 4. Micro-optimisations and why

- **Coalescing writes** instead of caching reads: the heartbeat is a write path, so the saving is in not writing.
- **Bounded in-memory structures** (`makeMemoryThrottle(maxEntries)`) so a long-lived server cannot grow without
  limit, and a reset beats an out-of-memory crash.
- **Counting in SQL** (`count(*) filter (...)`) moves work to where the data is and sends one row back instead of
  thousands.
- **Composite indexes ordered by the query** (`user_id, created_at`) serve both the filter and the sort.
- **Dependency injection through function arguments**, not a framework container: nothing to configure, nothing
  to start up, tree-shakes, and costs no memory per request.

## Order to do the plan items in

1. Object storage for media and CVs (#5): the largest memory and cost risk.
2. Scheduled job for due certificates (#8) and batch notifications (#9).
3. Redis for the presence throttle and last-seen (#1), the apply rate limit (#11) and, if wanted, a short
   `requireUser` cache (#12).
4. Pagination and trigram search (#6, #7) when headcount makes them matter.
