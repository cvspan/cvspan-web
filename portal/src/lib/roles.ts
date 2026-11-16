/*
 * Who can do what. Three things decide it, and they are kept apart on purpose:
 *
 *   1. Access: Super admin, Admin or Employee. The only thing stored as `users.role`.
 *   2. Function (Employees only): Management supervises people; HR runs people operations.
 *      They are switches, so one person can hold both. Everyone else is Staff.
 *   3. Engagement: Full-time, Part-time, Internship or Volunteer. It sets the rules that apply to
 *      a person (leave allowance, the internship period) and has nothing to do with access: an
 *      intern can lead a team.
 *
 * Checks across the portal ask for a *tier*, which is access and function folded into one ranked
 * ladder: Super admin > Admin > HR > Management > Staff. Each tier can do what the ones below it
 * can, so "Admin can do everything HR can, plus system settings" is simply the order of the ladder.
 */

/** What is stored: the access a person has. */
export const ACCESS_LEVELS = ["super_admin", "admin", "employee"] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];

export const accessLabels: Record<AccessLevel, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  employee: "Employee",
};

/** Access and function folded into one ladder. "manager" and "member" are the ids of Management and Staff. */
export const ROLES = ["super_admin", "admin", "hr", "manager", "member"] as const;
export type Role = (typeof ROLES)[number];

export const roleLabels: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  hr: "HR",
  manager: "Management",
  member: "Staff",
};

/** Ordered by breadth of access; a role can do everything below it. */
const rank: Record<Role, number> = {
  super_admin: 5,
  admin: 4,
  hr: 3,
  manager: 2,
  member: 1,
};

export function atLeast(role: Role, minimum: Role) {
  return rank[role] >= rank[minimum];
}

/** The functions an Employee can hold. */
export type Functions = { isHr: boolean; isManagement: boolean };

/** A person's tier from what is stored. HR outranks Management, so someone with both ranks as HR. */
export function tierOf(person: { role: AccessLevel } & Functions): Role {
  if (person.role === "super_admin") return "super_admin";
  if (person.role === "admin") return "admin";
  if (person.isHr) return "hr";
  if (person.isManagement) return "manager";
  return "member";
}

/** The label people see: "Employee · HR and Management", "Admin", "Employee · Staff". */
export function accessSummary(person: { role: AccessLevel } & Functions) {
  if (person.role !== "employee") return accessLabels[person.role];
  const functions = [person.isHr ? "HR" : null, person.isManagement ? "Management" : null].filter(Boolean);
  return `Employee · ${functions.length > 0 ? functions.join(" and ") : "Staff"}`;
}

/** The engagements people choose between. Students are part-time. */
export const ENGAGEMENTS = ["full_time", "part_time", "internship", "volunteer"] as const;
