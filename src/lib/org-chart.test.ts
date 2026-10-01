import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildChart, focusRoots, type ChartNode } from "./org-chart";
import { childrenMap, indexPeople, type OrgPerson } from "./org";

const person = (id: string, managerId: string | null, extra: Partial<OrgPerson> = {}): OrgPerson => ({
  id,
  name: id,
  jobTitle: null,
  role: "member",
  orgLevel: "member",
  managerId,
  departmentId: null,
  departmentName: null,
  headOf: [],
  ...extra,
});

/*
 *  ceo
 *   ├─ head (heads Design)
 *   │   ├─ mgr
 *   │   │   ├─ me
 *   │   │   │   └─ report
 *   │   │   └─ mate
 *   │   │       └─ mateReport
 *   │   └─ otherMgr
 *   │       └─ stranger
 *   └─ otherHead
 */
const people = [
  person("ceo", null, { orgLevel: "ceo", role: "super_admin" }),
  person("head", "ceo", { role: "manager", orgLevel: "manager", headOf: ["Design"] }),
  person("otherHead", "ceo", { role: "manager", orgLevel: "manager", headOf: ["Dev"] }),
  person("mgr", "head", { role: "manager", orgLevel: "manager" }),
  person("otherMgr", "head", { role: "manager", orgLevel: "manager" }),
  person("me", "mgr"),
  person("mate", "mgr"),
  person("report", "me"),
  person("mateReport", "mate"),
  person("stranger", "otherMgr"),
];
const byId = indexPeople(people);
const byManager = childrenMap(people);

const ids = (nodes: ChartNode[]): string[] => nodes.flatMap((node) => [node.person.id, ...ids(node.children)]);
const find = (nodes: ChartNode[], id: string): ChartNode | undefined =>
  nodes.flatMap((node) => [node, ...(find(node.children, id) ? [find(node.children, id)!] : [])]).find((n) => n.person.id === id);

describe("buildChart (whole company)", () => {
  const chart = buildChart([byId.get("ceo")!], byManager, byId, { youId: "me" });

  it("draws everyone", () => {
    assert.equal(ids(chart).length, people.length);
  });

  it("counts everyone beneath a person at any depth", () => {
    assert.equal(find(chart, "ceo")!.teamSize, 9);
    assert.equal(find(chart, "mgr")!.teamSize, 4);
    assert.equal(find(chart, "report")!.teamSize, 0);
  });

  it("flags you, the line above you and your teammates", () => {
    assert.ok(find(chart, "me")!.you);
    assert.deepEqual(
      ids(chart).filter((id) => find(chart, id)!.path),
      ["ceo", "head", "mgr"],
    );
    assert.ok(find(chart, "mate")!.teammate);
    assert.ok(!find(chart, "stranger")!.teammate);
  });

  it("labels heads and managers", () => {
    assert.equal(find(chart, "head")!.label, "Head of Design");
    assert.equal(find(chart, "mgr")!.label, "Manager");
  });
});

describe("buildChart (focus on me)", () => {
  /*
   * Put me, mgr, mate and report in Design along with head; otherHead leads Dev, whose stranger
   * and otherMgr sit in Dev. Design members are who the viewer sees; Dev's people are hidden.
   */
  const mark = (id: string, departmentId: string) => ((byId.get(id) as OrgPerson).departmentId = departmentId);
  for (const id of ["head", "mgr", "me", "mate", "report", "mateReport"]) mark(id, "design");
  for (const id of ["otherHead", "otherMgr", "stranger"]) mark(id, "dev");

  const roots = [byId.get("ceo")!];
  const chart = buildChart(focusRoots("me", byId, roots), byManager, byId, { youId: "me", focus: true }, people);

  it("starts at the CEO", () => {
    assert.equal(chart[0].person.id, "ceo");
  });

  it("shows the CEO, every head, my manager, my department and my team, and nothing else", () => {
    assert.deepEqual(
      new Set(ids(chart)),
      new Set(["ceo", "head", "otherHead", "mgr", "me", "mate", "report", "mateReport"]),
    );
  });

  it("leaves out people from other departments, though they still count toward a team", () => {
    const head = find(chart, "head")!;
    assert.deepEqual(head.children.map((child) => child.person.id), ["mgr"]);
    assert.equal(head.teamSize, 7);
  });

  it("flags my line, my teammates and my department", () => {
    assert.deepEqual(ids(chart).filter((id) => find(chart, id)!.path), ["ceo", "head", "mgr"]);
    assert.ok(find(chart, "mate")!.teammate);
    assert.ok(find(chart, "mateReport")!.inDepartment);
    assert.ok(!find(chart, "otherHead")!.inDepartment);
  });
});

describe("focusRoots", () => {
  it("keeps the given roots when I am already under one", () => {
    const roots = [byId.get("ceo")!];
    assert.deepEqual(focusRoots("me", byId, roots), roots);
  });

  it("adds the top of my line when there is no CEO to hang from", () => {
    const top = focusRoots("me", byId, []);
    assert.deepEqual(top.map((p) => p.id), ["ceo"]);
  });

  it("is the person themselves when they have no manager", () => {
    assert.deepEqual(focusRoots("ceo", byId, []).map((p) => p.id), ["ceo"]);
  });
});
