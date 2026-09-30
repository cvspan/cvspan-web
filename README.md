# CVSpan Portal

Company-wide management portal for CVSpan: people and org structure, tasks and deadlines,
KPIs and grading, attendance, programmes and certification, messaging, and the link-ups to
the CVSpan website (blog and careers).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4, CVSpan tokens as CSS variables |
| Database | Neon (serverless Postgres) via Drizzle ORM |
| Icons | Remix Icon, the same set as the CVSpan design system |

## Design tokens

`src/app/globals.css` holds two layers, mirroring Figma:

- **Palette** (`--cv-*`) — the raw CVSpan Colour ramps.
- **Semantic** (`--surface-*`, `--text-*`, `--border-*`, `--status-*`) — the CVSpan Theme
  collection, redefined under `.dark`.

Tailwind utilities are generated from the semantic layer, so components use `bg-card`,
`text-muted`, `border-line` and never a raw hex. Dark mode is the `dark` class on `<html>`,
applied before paint by a small script in `src/app/layout.tsx`.

Type sizes (`text-h5`, `text-body`, `text-caption`, `text-tiny`) match the CVSpan text styles.
Inter stands in for Aeonik until the licensed font files are added.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Neon connection string and an AUTH_SECRET
npm run db:push              # create the tables
npm run db:seed              # seed a realistic organisation
npm run dev
```

## Sign in

Auth.js with credentials and JWT sessions. Roles ride in the token, and `src/proxy.ts`
(Next 16's replacement for middleware) keeps every route behind a session.

Seeded demo accounts, all with the password `cvspan2026`:

| Email | Role |
|---|---|
| seyi@cvspan.com | Super admin |
| kemi@cvspan.com | Admin / HR |
| ada@cvspan.com | Manager |
| moses@cvspan.com | Member |

Super admins get a "view as" control in the top bar that re-renders the whole portal — data
included — as a lower role. It writes a cookie the server reads, so it is not a client-side
illusion.

Re-running the seed creates new user ids, which invalidates existing sessions. Sign out and
back in after seeding.

## Database

Schema lives in `src/db/schema.ts`, queries in `src/db/queries.ts`. Every page reads through
those queries; there is no mock data left in the app.

Note that `role` (permission level) and `employment_type` are deliberately separate: an intern
can be a team lead, and a full-time member can hold no management rights.

## Roadmap

1. People and org, roles, tasks and deadlines, attendance, messaging, member and manager dashboards.
2. KPIs and grading cycles, approvals inbox, reports.
3. Programmes, internship tracker, certification and automation.
4. Blog and careers link-ups to the CVSpan website.
