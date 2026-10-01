import { atLeast, type Role } from "./roles";

/*
 * The organisation hierarchy: CEO → heads of department (the executives: CTO, COO, CFO…) →
 * managers → members.
 *
 * Who reports to whom is `users.managerId`, and most of it is automatic:
 *   - heads of department report to the CEO;
 *   - managers report to the head of their department;
 *   - members report to a manager (an admin can choose, and it defaults to their project
 *     manager, else their department head).
 * A head of department isn't a stored level: whoever a department names as its head ranks as a
 * head, so the Departments page stays the one place that says who heads what. All pure, so the
 * rules are easy to test.
 */

/** What is stored on the person. */
export const orgLevels = ["ceo", "manager", "member"] as const;
export type StoredLevel = (typeof orgLevels)[number];
export type Level = StoredLevel | "head";

/** What an admin chooses between. "head" means heading the department they are in. */
export const positionLevels = ["ceo", "head", "manager", "member"] as const;
export type PositionLevel = (typeof positionLevels)[number];

/** Lower is more senior. A person must report to someone strictly more senior than themselves. */
export const levelRank: Record<Level, number> = {
  ceo: 1,
  head: 2,
  manager: 3,
  member: 4,
};

export const levelLabels: Record<Level, string> = {
  ceo: "CEO",
  head: "Department head",
  manager: "Manager",
  member: "Member",
};

export const positionLevelLabels: Record<PositionLevel, string> = {
  ceo: "CEO",
  head: "Department head (executives)",
  manager: "Manager",
  member: "Member",
};

export type OrgPerson = {
  id: string;
  name: string;
  jobTitle: string | null;
  role: Role;
  orgLevel: StoredLevel;
  managerId: string | null;
  departmentId: string | null;
  departmentName: string | null;
  /** Names of the departments this person heads. */
  headOf: string[];
};

export function levelOf(person: Pick<OrgPerson, "orgLevel" | "headOf">): Level {
  if (person.orgLevel === "ceo") return "ceo";
  return person.headOf.length > 0 ? "head" : person.orgLevel;
}

/** A sensible starting level from someone's access role, until an admin sets it. */
export function defaultLevelForRole(role: Role): StoredLevel {
  return role === "member" ? "member" : "manager";
}

/** "Head of Design", "CEO", "Manager": the label shown next to a name. */
export function levelBadge(person: Pick<OrgPerson, "orgLevel" | "headOf">) {
  const level = levelOf(person);
  return level === "head" ? `Head of ${person.headOf.join(" & ")}` : levelLabels[level];
}

/* ------------------------------------------------------------------- Tree */

type ById<T extends OrgPerson = OrgPerson> = Map<string, T>;

export const indexPeople = <T extends OrgPerson>(people: T[]): ById<T> =>
  new Map(people.map((person) => [person.id, person]));

/** A manager who isn't in the list (left the company, say) counts as no manager. */
function managerIn(person: OrgPerson, byId: ById<OrgPerson>) {
  return person.managerId && byId.has(person.managerId) ? person.managerId : null;
}

export function childrenMap<T extends OrgPerson>(people: T[]) {
  const byId = indexPeople(people);
  const children = new Map<string | null, T[]>();

  for (const person of people) {
    const key = managerIn(person, byId);
    children.set(key, [...(children.get(key) ?? []), person]);
  }
  for (const list of children.values()) {
    list.sort((a, b) => levelRank[levelOf(a)] - levelRank[levelOf(b)] || a.name.localeCompare(b.name));
  }
  return children;
}

/** The chain above someone, nearest manager first, ending at the top. Safe against loops. */
export function reportingLine<T extends OrgPerson>(personId: string, byId: ById<T>) {
  const line: T[] = [];
  const seen = new Set<string>([personId]);
  let current = byId.get(personId);

  while (current) {
    const managerId = managerIn(current, byId);
    if (!managerId || seen.has(managerId)) break;
    seen.add(managerId);
    const manager = byId.get(managerId)!;
    line.push(manager);
    current = manager;
  }
  return line;
}

/** Everyone beneath someone, at any depth. */
export function descendantIds<T extends OrgPerson>(personId: string, children: Map<string | null, T[]>) {
  const found = new Set<string>();
  const queue = [personId];

  while (queue.length > 0) {
    for (const child of children.get(queue.shift()!) ?? []) {
      if (!found.has(child.id) && child.id !== personId) {
        found.add(child.id);
        queue.push(child.id);
      }
    }
  }
  return found;
}

/**
 * Where the chart starts. With a CEO it is the CEO alone; with none, the heads of department who
 * report to nobody. Anyone else with no manager hasn't been placed yet.
 */
export function chartRoots<T extends OrgPerson>(people: T[]) {
  const byId = indexPeople(people);
  const hasCeo = people.some((person) => person.orgLevel === "ceo");

  const topless = people.filter((person) => !managerIn(person, byId));
  const isRoot = (person: T) =>
    person.orgLevel === "ceo" || (!hasCeo && levelOf(person) === "head");

  const sort = (list: T[]) =>
    list.sort((a, b) => levelRank[levelOf(a)] - levelRank[levelOf(b)] || a.name.localeCompare(b.name));

  return {
    roots: sort(topless.filter(isRoot)),
    unplaced: sort(topless.filter((person) => !isRoot(person))),
  };
}

/* ------------------------------------------------------------- Validation */

export type PositionChange = { subjectId: string; level: PositionLevel; managerId: string | null };

/** The level someone would have after a change. Heading a department is what makes a head. */
const resultingLevel = (level: PositionLevel): Level => level;

/**
 * Checks a proposed change to someone's level and, where it is theirs to choose, their reporting
 * line. Returns the problem in plain words, or null when it is fine. The server runs this; the
 * form uses it to narrow its choices.
 */
export function validatePosition(change: PositionChange, people: OrgPerson[]): string | null {
  const byId = indexPeople(people);
  const subject = byId.get(change.subjectId);
  if (!subject) return "That person no longer exists.";

  if (change.level === "ceo") {
    const current = people.find((person) => person.orgLevel === "ceo" && person.id !== subject.id);
    if (current) return `${current.name} is already the CEO. Change their level first.`;
    return null; // the CEO reports to no one
  }

  if (change.level === "head") {
    if (!subject.departmentId) {
      return `${subject.name} isn't in a department. Add them to one first, then make them its head.`;
    }
    return null; // heads report to the CEO automatically
  }

  const proposed = resultingLevel(change.level);

  /** Anyone who reports to them must stay more junior than they become. */
  const children = childrenMap(people);
  for (const report of children.get(subject.id) ?? []) {
    if (levelRank[levelOf(report)] <= levelRank[proposed]) {
      return `${report.name} reports to ${subject.name} and would no longer be more junior. Move them first.`;
    }
  }

  if (!change.managerId) return null;

  const manager = byId.get(change.managerId);
  if (!manager) return "Choose a manager from the list.";
  if (manager.id === subject.id) return "Nobody reports to themselves.";

  if (descendantIds(subject.id, children).has(manager.id)) {
    return `${manager.name} already reports to ${subject.name}, so that would make a loop.`;
  }
  if (!atLeast(manager.role, "manager")) {
    return `${manager.name} is a member. Someone who has people reporting to them must be a manager or an admin.`;
  }
  if (levelRank[levelOf(manager)] >= levelRank[proposed]) {
    return `${manager.name} (${levelLabels[levelOf(manager)]}) must be more senior than ${subject.name} (${levelLabels[proposed]}).`;
  }
  return null;
}

/** Who could `subject` report to at this level? Used to fill the form's list. */
export function managerCandidates<T extends OrgPerson>(subject: OrgPerson, level: PositionLevel, people: T[]) {
  if (level === "ceo" || level === "head") return [];
  return people.filter(
    (person) =>
      person.id !== subject.id &&
      validatePosition({ subjectId: subject.id, level, managerId: person.id }, people) === null,
  );
}

/* ------------------------------------------------------- Automatic lines */

export type OrgContext = {
  ceoId: string | null;
  /** The head of each department, by department id. */
  departmentHeads: Map<string, string>;
};

/**
 * Who someone reports to when the structure decides it:
 *   - the CEO reports to no one (null);
 *   - a head of department reports to the CEO;
 *   - a manager reports to the head of their department, when it has one.
 * Returns undefined when it is a choice rather than a rule: a member's manager, or a manager in
 * a department that has no head yet.
 */
export function automaticManagerId(
  person: Pick<OrgPerson, "id" | "orgLevel" | "headOf" | "departmentId">,
  level: Level,
  context: OrgContext,
): string | null | undefined {
  if (level === "ceo") return null;
  if (level === "head") return context.ceoId && context.ceoId !== person.id ? context.ceoId : null;

  if (level === "manager" && person.departmentId) {
    const head = context.departmentHeads.get(person.departmentId);
    if (head && head !== person.id) return head;
  }
  return undefined;
}

export type LineChange = { id: string; managerId: string | null };

/**
 * Works out which reporting lines need to change to match the rules above. Idempotent: run it
 * after anything that could move someone (a new head, a department change, a project manager),
 * and an already-correct organisation produces no changes.
 *   - The CEO, heads and managers are always brought into line.
 *   - A member keeps a manager they already have. One with none (or whose manager has gone)
 *     gets their project manager, else their department head.
 */
export function planReportingLines(
  people: OrgPerson[],
  context: OrgContext,
  projectManagerOf: Map<string, string>,
): LineChange[] {
  const byId = indexPeople(people);
  const changes: LineChange[] = [];

  for (const person of people) {
    const level = levelOf(person);
    const current = person.managerId && byId.has(person.managerId) ? person.managerId : null;
    let target: string | null | undefined = automaticManagerId(person, level, context);

    if (target === undefined && level === "member" && current === null) {
      const options = [projectManagerOf.get(person.id), person.departmentId ? context.departmentHeads.get(person.departmentId) : undefined];
      target = options.find((candidate) => candidate && candidate !== person.id && byId.has(candidate)) ?? null;
    }

    if (target !== undefined && target !== current) changes.push({ id: person.id, managerId: target });
  }
  return changes;
}

/* ----------------------------------------------------------------- Health */

export type HierarchyIssue = { kind: "no-ceo" | "unplaced" | "rank" | "loop"; message: string; personIds: string[] };

/** Things worth an admin's attention. Edits can't cause these, but a department head change can. */
export function hierarchyIssues(people: OrgPerson[]): HierarchyIssue[] {
  const issues: HierarchyIssue[] = [];
  const byId = indexPeople(people);

  if (!people.some((person) => person.orgLevel === "ceo")) {
    issues.push({ kind: "no-ceo", message: "No CEO is set yet.", personIds: [] });
  }

  const { unplaced } = chartRoots(people);
  if (unplaced.length > 0) {
    issues.push({
      kind: "unplaced",
      message:
        unplaced.length === 1
          ? `${unplaced[0].name} has no reporting line yet.`
          : `${unplaced.length} people have no reporting line yet.`,
      personIds: unplaced.map((person) => person.id),
    });
  }

  for (const person of people) {
    const managerId = managerIn(person, byId);
    const manager = managerId ? byId.get(managerId) : null;
    if (manager && levelRank[levelOf(manager)] >= levelRank[levelOf(person)]) {
      issues.push({
        kind: "rank",
        message: `${person.name} reports to ${manager.name}, who is not more senior.`,
        personIds: [person.id, manager.id],
      });
    }
    if (managerId && reportingLine(person.id, byId).some((above) => above.id === person.id)) {
      issues.push({ kind: "loop", message: `${person.name} is in a reporting loop.`, personIds: [person.id] });
    }
  }
  return issues;
}
