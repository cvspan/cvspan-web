/**
 * Roles become Super admin, Admin and Employee, with Management and HR as functions of an employee.
 *
 *   - users.role gains 'employee'; is_management and is_hr are new switches
 *   - old managers become employees with Management on, old members plain employees
 *   - old admins (the "Admin / HR" role) become employees with HR on; Super admins stay as they are
 *   - students become part-time
 *
 * The data is converted only the first time, so an Admin appointed afterwards is never touched by a
 * re-run. Nothing is deleted: the old enum values stay in the database, and every person's previous
 * role and engagement are kept in users.role_before / users.employment_type_before, so this can be undone.
 *
 *   npm run db:migrate-access
 */
import { sql } from "./sql";

async function main() {
  const [{ done }] = await sql`
    select exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'is_hr') as done
  `;

  await sql`alter type role add value if not exists 'employee'`;
  await sql`alter table users add column if not exists is_management boolean not null default false`;
  await sql`alter table users add column if not exists is_hr boolean not null default false`;
  await sql`alter table users alter column role set default 'employee'`;

  if (!done) {
    await sql`alter table users add column if not exists role_before text`;
    await sql`alter table users add column if not exists employment_type_before text`;
    await sql`update users set role_before = role::text, employment_type_before = employment_type::text`;
    await sql`update users set is_management = true, role = 'employee' where role = 'manager'`;
    await sql`update users set is_hr = true, role = 'employee' where role = 'admin'`;
    await sql`update users set role = 'employee' where role = 'member'`;
    await sql`update users set employment_type = 'part_time' where employment_type = 'student'`;
  } else {
    console.log("Already converted; only checking the structure.");
  }

  console.log(
    await sql`select name, role::text, is_management, is_hr, employment_type::text from users order by role, name`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
