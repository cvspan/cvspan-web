/**
 * Adds the table behind the website's Team page, so admins can add, edit, reorder and hide the
 * people shown there.
 *
 * Purely additive: one new table, nothing existing is touched. Safe to re-run.
 *
 *   npm run db:migrate-website-team
 */
import { sql } from "./sql";

async function main() {
  await sql`
    create table if not exists website_team_members (
      id uuid primary key default gen_random_uuid(),
      slug text not null unique,
      name text not null,
      role text not null,
      bio text,
      photo_url text,
      sort_order integer not null default 0,
      published boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  const [{ n }] = await sql`select count(*)::int as n from website_team_members`;
  console.log(`website_team_members ready (${n} rows)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
