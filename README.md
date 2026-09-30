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
cp .env.example .env.local   # add your Neon connection string
npm run dev
```

The member dashboard is the current home page and runs on placeholder data from
`src/lib/mock-data.ts`.

## Database

Schema lives in `src/db/schema.ts` (people and org, tasks, attendance, KPI definitions and
scores). With `DATABASE_URL` set:

```bash
npx drizzle-kit push
```

Note that `role` (permission level) and `employment_type` are deliberately separate: an intern
can be a team lead, and a full-time member can hold no management rights.

## Roadmap

1. People and org, roles, tasks and deadlines, attendance, messaging, member and manager dashboards.
2. KPIs and grading cycles, approvals inbox, reports.
3. Programmes, internship tracker, certification and automation.
4. Blog and careers link-ups to the CVSpan website.
