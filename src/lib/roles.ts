export const ROLES = ["super_admin", "admin", "manager", "member"] as const;
export type Role = (typeof ROLES)[number];

export const roleLabels: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin / HR",
  manager: "Manager",
  member: "Member",
};

/** Ordered by breadth of access; a role can see everything below it. */
const rank: Record<Role, number> = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  member: 1,
};

export function atLeast(role: Role, minimum: Role) {
  return rank[role] >= rank[minimum];
}
