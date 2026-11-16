import { sql } from "drizzle-orm";
import type { SQLWrapper } from "drizzle-orm";
import type { Role } from "@/lib/roles";
import { users } from "./schema";

/** The users table, or an alias of it. */
type UserTable = { role: SQLWrapper; isHr: SQLWrapper; isManagement: SQLWrapper };

/**
 * A person's tier (see lib/roles.ts) worked out in SQL, so a query can select it as `role` and the
 * rest of the code keeps reading `person.role` as Super admin / Admin / HR / Management / Staff.
 * Pass an aliased users table to get the tier of someone joined in, such as a department head.
 */
export const tierSql = (table: UserTable = users) =>
  sql<Role>`(case
    when ${table.role} = 'super_admin' then 'super_admin'
    when ${table.role} = 'admin' then 'admin'
    when ${table.isHr} then 'hr'
    when ${table.isManagement} then 'manager'
    else 'member'
  end)`;
