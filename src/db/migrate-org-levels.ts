/**
 * Removes the "executive" org level. Executives are department heads now, and "head" is derived
 * from the department itself, so the stored levels become: ceo, manager, member.
 *
 * Postgres can't drop an enum value, so the type is replaced in one transaction (all or
 * nothing, no rows deleted). The partial unique index that allows a single CEO mentions the
 * column, so it is dropped and recreated around the change. Anyone who was an executive becomes
 * a manager; an admin then names the CEO and the heads of department.
 * Safe to re-run: it does nothing once "executive" is gone.
 *
 *   npm run db:migrate-org-levels
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const [{ values }] = await sql`select enum_range(null::org_level)::text as values`;
  if (!String(values).includes("executive")) {
    console.log("Already migrated:", values);
    return;
  }

  const before = await sql`select org_level::text as level, count(*)::int as n from users group by org_level order by org_level`;
  console.log("Before:", before.map((row) => `${row.level}=${row.n}`).join(", "));

  await sql.transaction([
    sql`drop index if exists users_single_ceo_idx`,
    sql`create type org_level_new as enum ('ceo', 'manager', 'member')`,
    sql`alter table users alter column org_level drop default`,
    sql`alter table users alter column org_level type org_level_new using (
      case org_level::text when 'executive' then 'manager' else org_level::text end
    )::org_level_new`,
    sql`alter table users alter column org_level set default 'member'`,
    sql`drop type org_level`,
    sql`alter type org_level_new rename to org_level`,
    sql`create unique index users_single_ceo_idx on users (org_level) where org_level = 'ceo'`,
  ]);

  const after = await sql`select org_level::text as level, count(*)::int as n from users group by org_level order by org_level`;
  console.log("After: ", after.map((row) => `${row.level}=${row.n}`).join(", "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
