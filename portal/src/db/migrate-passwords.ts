/**
 * Passwords people can change: two columns on users.
 *   - must_change_password: set when an admin gives someone a temporary password
 *   - password_changed_at: when the password last changed; older sessions are ended
 *
 * Additive and safe to re-run. Nobody is forced to change anything by this migration.
 *
 *   npm run db:migrate-passwords
 */
import { sql } from "./sql";

async function main() {
  await sql`alter table users add column if not exists must_change_password boolean not null default false`;
  await sql`alter table users add column if not exists password_changed_at timestamptz`;
  const [{ n }] = await sql`select count(*)::int as n from users where password_hash is null`;
  console.log(`users ready (${n} without a password yet)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
