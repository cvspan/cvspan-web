/**
 * Adds the approval step to certificates.
 *
 * Purely additive, so nothing is deleted or rewritten and old code keeps working against it:
 *   - a `certificate` value on approval_kind, so a request can sit in the Approvals queue
 *   - a certificate_status type (pending / issued / declined) and a `status` column, defaulting
 *     to `issued`, so every certificate that already exists stays valid exactly as it was
 *   - who requested it, what they said, and who decided and why
 *   - issued_at becomes nullable: a request has no issue date until an admin approves it
 * Safe to re-run: each step checks before it changes anything.
 *
 *   npm run db:migrate-certificates
 */
import { sql } from "./sql";

async function main() {
  const [{ has }] = await sql`select exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid where t.typname = 'approval_kind' and e.enumlabel = 'certificate') as has`;
  if (!has) {
    await sql`alter type approval_kind add value 'certificate'`;
    console.log("Added approval_kind 'certificate'");
  }

  await sql`do $$ begin create type certificate_status as enum ('pending', 'issued', 'declined'); exception when duplicate_object then null; end $$`;

  await sql`alter table certificates add column if not exists status certificate_status not null default 'issued'`;
  await sql`alter table certificates add column if not exists requested_by_id uuid references users(id) on delete set null`;
  await sql`alter table certificates add column if not exists requested_at timestamptz not null default now()`;
  await sql`alter table certificates add column if not exists request_note text`;
  await sql`alter table certificates add column if not exists decided_by_id uuid references users(id) on delete set null`;
  await sql`alter table certificates add column if not exists decided_at timestamptz`;
  await sql`alter table certificates add column if not exists decision_note text`;
  await sql`alter table certificates alter column issued_at drop not null`;
  await sql`alter table certificates alter column issued_at drop default`;

  const rows = await sql`select status::text as status, count(*)::int as n from certificates group by status order by status`;
  console.log("Certificates now:", rows.map((row) => `${row.status}=${row.n}`).join(", ") || "none");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
