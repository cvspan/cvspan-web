/**
 * Adds objectives and key results (OKRs) for the Performance section.
 *
 * Purely additive: three new tables and one enum, nothing existing is touched. It also creates a
 * first cycle covering the current quarter, so people can start straight away; admins can add
 * more later. Safe to re-run.
 *
 *   npm run db:migrate-objectives
 */
import { sql } from "./sql";

async function main() {
  await sql`do $$ begin create type objective_status as enum ('draft', 'submitted', 'approved', 'changes_requested'); exception when duplicate_object then null; end $$`;

  await sql`create table if not exists performance_cycles (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    start_date date not null,
    end_date date not null,
    created_at timestamptz not null default now()
  )`;

  await sql`create table if not exists objectives (
    id uuid primary key default gen_random_uuid(),
    cycle_id uuid not null references performance_cycles(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    title text not null,
    description text,
    weight integer not null,
    status objective_status not null default 'draft',
    reviewer_id uuid references users(id) on delete set null,
    submitted_at timestamptz,
    reviewed_by_id uuid references users(id) on delete set null,
    reviewed_at timestamptz,
    review_note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint objectives_weight_range check (weight between 1 and 100)
  )`;
  await sql`create index if not exists objectives_user_cycle_idx on objectives (user_id, cycle_id)`;

  await sql`create table if not exists key_results (
    id uuid primary key default gen_random_uuid(),
    objective_id uuid not null references objectives(id) on delete cascade,
    title text not null,
    target integer not null,
    current integer not null default 0,
    unit text,
    position integer not null default 0
  )`;

  const [{ n }] = await sql`select count(*)::int as n from performance_cycles`;
  if (n === 0) {
    const now = new Date();
    const quarter = Math.floor(now.getUTCMonth() / 3);
    const year = now.getUTCFullYear();
    const start = new Date(Date.UTC(year, quarter * 3, 1)).toISOString().slice(0, 10);
    const end = new Date(Date.UTC(year, quarter * 3 + 3, 0)).toISOString().slice(0, 10);
    await sql`insert into performance_cycles (name, start_date, end_date) values (${`Q${quarter + 1} ${year}`}, ${start}, ${end})`;
    console.log(`Created the first cycle: Q${quarter + 1} ${year} (${start} to ${end})`);
  }

  console.log("Cycles:", await sql`select name, start_date, end_date from performance_cycles order by start_date`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
