/**
 * Moves projects from the old statuses (planning, active, on_hold, completed, cancelled) to the
 * lifecycle (not_started, planning, design, development, live, on_hold, cancelled).
 *
 * Postgres can't remove values from an enum, so the type is replaced inside one transaction:
 * either everything below happens or nothing does. No rows are deleted. Existing projects map:
 *   active    → development   (work under way)
 *   completed → live          (delivered)
 *   the rest keep their name
 * Safe to re-run: it does nothing once the new type is in place.
 *
 *   npm run db:migrate-project-status
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const [{ values }] = await sql`select enum_range(null::project_status)::text as values`;
  if (String(values).includes("live")) {
    console.log("Already migrated:", values);
    return;
  }

  const before = await sql`select status::text as status, count(*)::int as n from projects group by status order by status`;
  console.log("Before:", before.map((row) => `${row.status}=${row.n}`).join(", ") || "no projects");

  await sql.transaction([
    sql`create type project_status_new as enum ('not_started', 'planning', 'design', 'development', 'live', 'on_hold', 'cancelled')`,
    sql`alter table projects alter column status drop default`,
    sql`alter table projects alter column status type project_status_new using (
      case status::text
        when 'active' then 'development'
        when 'completed' then 'live'
        else status::text
      end
    )::project_status_new`,
    sql`alter table projects alter column status set default 'not_started'`,
    sql`drop type project_status`,
    sql`alter type project_status_new rename to project_status`,
  ]);

  const after = await sql`select status::text as status, count(*)::int as n from projects group by status order by status`;
  console.log("After: ", after.map((row) => `${row.status}=${row.n}`).join(", ") || "no projects");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
