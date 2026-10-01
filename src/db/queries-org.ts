import "server-only";
import { asc, notInArray, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { departments, users } from "./schema";
import type { OrgPerson } from "@/lib/org";

export type OrgMember = OrgPerson & {
  status: "invited" | "active" | "suspended" | "alumni";
  employmentType: "full_time" | "part_time" | "internship" | "volunteer" | "student";
};

/** Everyone currently in the organisation, with the departments each one heads. */
export async function getOrgPeople(): Promise<OrgMember[]> {
  const [rows, heads] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        jobTitle: users.jobTitle,
        role: users.role,
        orgLevel: users.orgLevel,
        managerId: users.managerId,
        departmentId: users.departmentId,
        departmentName: departments.name,
        status: users.status,
        employmentType: users.employmentType,
      })
      .from(users)
      .leftJoin(departments, eq(users.departmentId, departments.id))
      .where(notInArray(users.status, ["alumni", "suspended"]))
      .orderBy(asc(users.name)),
    db
      .select({ headId: departments.headId, name: departments.name })
      .from(departments)
      .where(sql`${departments.headId} is not null`),
  ]);

  const headOf = new Map<string, string[]>();
  for (const head of heads) {
    if (head.headId) headOf.set(head.headId, [...(headOf.get(head.headId) ?? []), head.name]);
  }

  return rows.map((row) => ({ ...row, headOf: headOf.get(row.id) ?? [] }));
}
