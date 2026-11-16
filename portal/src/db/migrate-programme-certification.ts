/**
 * Lets a programme say whether finishing it earns a certificate, so completions can be put in the
 * admins' Approvals queue automatically.
 *
 * Purely additive: one column, defaulting to true so every existing programme keeps issuing
 * certificates as before. Safe to re-run.
 *
 *   npm run db:migrate-programme-certification
 */
import { sql } from "./sql";

async function main() {
  await sql`alter table programmes add column if not exists issues_certificate boolean not null default true`;
  console.log(await sql`select name, issues_certificate from programmes order by name`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
