/**
 * Gives existing people a starting org level from their access role, so the org chart isn't
 * empty on day one: super admins become executives, admins and managers become managers.
 * Members stay members. It only touches people still at the default level, so it never
 * overwrites a level an admin has chosen, and it is safe to re-run.
 *
 *   npm run db:backfill-org-levels
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const changed = await sql`
    update users
    set org_level = (case role when 'super_admin' then 'executive' else 'manager' end)::org_level
    where org_level = 'member' and role <> 'member'
    returning name, role, org_level::text as org_level
  `;

  if (changed.length === 0) {
    console.log("Nothing to do: every non-member already has a level.");
    return;
  }
  for (const row of changed) console.log(`${row.name.padEnd(18)} ${row.role.padEnd(12)} → ${row.org_level}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
