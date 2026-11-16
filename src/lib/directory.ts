import type { EmploymentType } from "./format";

/**
 * The directory is the record of everyone CVSpan has had or will have, so people are grouped by
 * where they are in their time with the company, not by the raw account status:
 *   upcoming  invited, not started yet
 *   active    working with CVSpan now
 *   alumni    interns, volunteers and students who have finished
 *   former    full-time and part-time staff who have left
 *   suspended on hold, with no access
 */
export const directoryGroups = ["active", "upcoming", "alumni", "former", "suspended"] as const;
export type DirectoryGroup = (typeof directoryGroups)[number];

export const directoryGroupLabels: Record<DirectoryGroup, string> = {
  active: "Active",
  upcoming: "Upcoming",
  alumni: "Alumni",
  former: "Past employees",
  suspended: "Suspended",
};

/** What the Status badge says: a more natural word than the account status for people who have left. */
export const directoryStatusLabels: Record<DirectoryGroup, string> = {
  active: "Active",
  upcoming: "Invited",
  alumni: "Alumni",
  former: "Past employee",
  suspended: "Suspended",
};

const staffTypes: EmploymentType[] = ["full_time", "part_time"];

export function directoryGroup(person: {
  status: "invited" | "active" | "suspended" | "alumni";
  employmentType: EmploymentType;
}): DirectoryGroup {
  switch (person.status) {
    case "invited":
      return "upcoming";
    case "suspended":
      return "suspended";
    case "alumni":
      return staffTypes.includes(person.employmentType) ? "former" : "alumni";
    default:
      return "active";
  }
}

export function isDirectoryGroup(value: string | undefined): value is DirectoryGroup {
  return (directoryGroups as readonly string[]).includes(value ?? "");
}

export function countByGroup(people: Parameters<typeof directoryGroup>[0][]) {
  const counts = Object.fromEntries(directoryGroups.map((group) => [group, 0])) as Record<DirectoryGroup, number>;
  for (const person of people) counts[directoryGroup(person)] += 1;
  return counts;
}
