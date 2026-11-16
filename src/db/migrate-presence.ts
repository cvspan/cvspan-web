/**
 * Attendance by presence: two columns for the signal the open portal sends, and a unique record per
 * person per day so two tabs signing in at once can't write the day twice.
 *
 * Additive: existing rows keep their clock-in and clock-out as they were. Safe to re-run.
 *
 *   npm run db:migrate-presence
 */
import { sql } from "./sql";

async function main() {
  await sql`alter table attendance add column if not exists last_seen_at timestamptz`;
  await sql`alter table attendance add column if not exists away_seconds integer not null default 0`;
  await sql`create unique index if not exists attendance_user_day_idx on attendance (user_id, day)`;
  const [{ n }] = await sql`select count(*)::int as n from attendance`;
  console.log(`attendance ready (${n} rows)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
