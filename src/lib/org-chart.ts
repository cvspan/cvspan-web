import { levelBadge, levelOf, reportingLine, type Level, type OrgPerson } from "./org";

/*
 * Turns the flat list of people into the tree the org chart draws. Pure, so the shape is easy to
 * test. A chart node carries everything the card needs, and flags that explain where the viewer
 * sits: "you", "path" (someone above you, up to the top), "teammate" (reports to your manager).
 */

export type ChartNode<T extends OrgPerson = OrgPerson> = {
  person: T;
  level: Level;
  /** "CEO", "Head of Design", "Manager" or "Member". */
  label: string;
  you: boolean;
  /** On the line from the top of the organisation down to you. */
  path: boolean;
  /** Shares your manager. */
  teammate: boolean;
  /** Works in your department. */
  inDepartment: boolean;
  /** Everyone beneath them, at any depth, whether or not they are drawn. */
  teamSize: number;
  children: ChartNode<T>[];
};

type Children<T extends OrgPerson> = Map<string | null, T[]>;

function teamSizes<T extends OrgPerson>(byManager: Children<T>) {
  const sizes = new Map<string, number>();
  const size = (id: string, seen: Set<string>): number => {
    if (sizes.has(id)) return sizes.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    let total = 0;
    for (const child of byManager.get(id) ?? []) total += 1 + size(child.id, seen);
    sizes.set(id, total);
    return total;
  };
  for (const key of byManager.keys()) if (key) size(key, new Set());
  return sizes;
}

type Options = {
  youId?: string;
  /** Draw only what matters to you: the top, every head, your manager, your department and your team. */
  focus?: boolean;
};

/**
 * Who "My place" shows: the CEO and every department head, the line from the top down to you
 * (so your manager is there), everyone in your department, and anyone who reports to you.
 * Anyone else is left out, though they still count toward a person's team size.
 */
export function visibleFor<T extends OrgPerson>(me: T, people: T[], byId: Map<string, T>, byManager: Children<T>) {
  const keep = new Set<string>([me.id]);

  for (const person of people) {
    const level = levelOf(person);
    if (level === "ceo" || level === "head") keep.add(person.id);
    if (me.departmentId && person.departmentId === me.departmentId) keep.add(person.id);
  }
  for (const id of descendantsOf(me.id, byManager)) keep.add(id);

  /** Everyone shown needs the people above them, or they would float free of the tree. */
  for (const id of [...keep]) for (const above of reportingLine(id, byId)) keep.add(above.id);
  return keep;
}

function descendantsOf<T extends OrgPerson>(id: string, byManager: Children<T>) {
  const found = new Set<string>();
  const queue = [id];
  while (queue.length > 0) {
    for (const child of byManager.get(queue.shift()!) ?? []) {
      if (!found.has(child.id)) {
        found.add(child.id);
        queue.push(child.id);
      }
    }
  }
  return found;
}

export function buildChart<T extends OrgPerson>(
  roots: T[],
  byManager: Children<T>,
  byId: Map<string, T>,
  { youId, focus = false }: Options = {},
  people: T[] = [...byId.values()],
): ChartNode<T>[] {
  const sizes = teamSizes(byManager);
  const me = youId ? byId.get(youId) : undefined;
  const above = new Set(me ? reportingLine(me.id, byId).map((person) => person.id) : []);
  const visible = focus && me ? visibleFor(me, people, byId, byManager) : null;

  const build = (person: T, seen: Set<string>): ChartNode<T> => {
    const nextSeen = new Set(seen).add(person.id);
    const kids = (byManager.get(person.id) ?? []).filter(
      (child) => !nextSeen.has(child.id) && (!visible || visible.has(child.id)),
    );

    return {
      person,
      level: levelOf(person),
      label: levelBadge(person),
      you: person.id === me?.id,
      path: above.has(person.id),
      teammate: Boolean(me && person.id !== me.id && me.managerId && person.managerId === me.managerId),
      inDepartment: Boolean(me?.departmentId && person.departmentId === me.departmentId),
      teamSize: sizes.get(person.id) ?? 0,
      children: kids.map((child) => build(child, nextSeen)),
    };
  };

  return roots.filter((root) => !visible || visible.has(root.id)).map((root) => build(root, new Set()));
}

/**
 * The roots for "My place": the CEO (or every head when there is no CEO), plus the top of your own
 * reporting line when it isn't already one of those, so you are always on the chart.
 */
export function focusRoots<T extends OrgPerson>(youId: string, byId: Map<string, T>, roots: T[]): T[] {
  const me = byId.get(youId);
  if (!me) return roots;
  const line = reportingLine(youId, byId);
  const top = line[line.length - 1] ?? me;
  return roots.some((root) => root.id === top.id) ? roots : [...roots, top];
}

export type { Level };
