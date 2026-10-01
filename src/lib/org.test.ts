import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  childrenMap,
  chartRoots,
  defaultLevelForRole,
  descendantIds,
  hierarchyIssues,
  indexPeople,
  levelBadge,
  levelOf,
  managerCandidates,
  reportingLine,
  validatePosition,
  type OrgPerson,
} from "./org";

const person = (name: string, overrides: Partial<OrgPerson> = {}): OrgPerson => ({
  id: name.toLowerCase(),
  name,
  jobTitle: null,
  role: "member",
  orgLevel: "member",
  managerId: null,
  departmentId: null,
  departmentName: null,
  headOf: [],
  ...overrides,
});

/** CEO → COO → Ada (heads Design) → Bea (manager) → Moses (member) */
const company = () => [
  person("Ceo", { orgLevel: "ceo", role: "super_admin" }),
  person("Coo", { orgLevel: "executive", role: "super_admin", managerId: "ceo" }),
  person("Cto", { orgLevel: "executive", role: "admin", managerId: "ceo" }),
  person("Ada", { orgLevel: "manager", role: "manager", managerId: "coo", headOf: ["Design"] }),
  person("Bea", { orgLevel: "manager", role: "manager", managerId: "ada" }),
  person("Moses", { orgLevel: "member", managerId: "bea" }),
  person("Chioma", { orgLevel: "member", managerId: "bea" }),
];

describe("levels", () => {
  it("a department head ranks as a head, whatever their stored level", () => {
    assert.equal(levelOf({ orgLevel: "manager", headOf: ["Design"] }), "head");
    assert.equal(levelOf({ orgLevel: "member", headOf: ["Design"] }), "head");
    assert.equal(levelOf({ orgLevel: "manager", headOf: [] }), "manager");
  });

  it("an executive stays an executive even if they head a department", () => {
    assert.equal(levelOf({ orgLevel: "executive", headOf: ["Engineering"] }), "executive");
    assert.equal(levelOf({ orgLevel: "ceo", headOf: [] }), "ceo");
  });

  it("labels heads by department", () => {
    assert.equal(levelBadge({ orgLevel: "manager", headOf: ["Design"] }), "Head of Design");
    assert.equal(levelBadge({ orgLevel: "ceo", headOf: [] }), "CEO");
  });

  it("starts people at a level that matches their access role", () => {
    assert.equal(defaultLevelForRole("super_admin"), "executive");
    assert.equal(defaultLevelForRole("admin"), "manager");
    assert.equal(defaultLevelForRole("manager"), "manager");
    assert.equal(defaultLevelForRole("member"), "member");
  });
});

describe("reading the tree", () => {
  it("lists the chain above someone, nearest first", () => {
    const byId = indexPeople(company());
    assert.deepEqual(reportingLine("moses", byId).map((p) => p.name), ["Bea", "Ada", "Coo", "Ceo"]);
    assert.deepEqual(reportingLine("ceo", byId), []);
  });

  it("finds everyone beneath someone at any depth", () => {
    const children = childrenMap(company());
    assert.deepEqual([...descendantIds("ada", children)].sort(), ["bea", "chioma", "moses"]);
    assert.equal(descendantIds("moses", children).size, 0);
  });

  it("orders each team by seniority, then name", () => {
    const children = childrenMap(company());
    assert.deepEqual(children.get("ceo")!.map((p) => p.name), ["Coo", "Cto"]);
    assert.deepEqual(children.get("bea")!.map((p) => p.name), ["Chioma", "Moses"]);
  });

  it("survives a reporting loop instead of spinning", () => {
    const loop = [person("A", { managerId: "b" }), person("B", { managerId: "a" })];
    assert.equal(reportingLine("a", indexPeople(loop)).length, 1);
    assert.equal(descendantIds("a", childrenMap(loop)).size, 1);
  });

  it("treats a manager who has left as no manager", () => {
    const people = [person("Orphan", { managerId: "gone" })];
    assert.deepEqual(chartRoots(people).unplaced.map((p) => p.name), ["Orphan"]);
  });
});

describe("where the chart starts", () => {
  it("starts at the CEO when there is one, and flags other topless people", () => {
    const people = [...company(), person("Loose", { orgLevel: "manager", role: "manager" })];
    const { roots, unplaced } = chartRoots(people);
    assert.deepEqual(roots.map((p) => p.name), ["Ceo"]);
    assert.deepEqual(unplaced.map((p) => p.name), ["Loose"]);
  });

  it("starts at the executives when there is no CEO yet", () => {
    const people = [
      person("Coo", { orgLevel: "executive", role: "super_admin" }),
      person("Cfo", { orgLevel: "executive", role: "admin" }),
      person("Loose"),
    ];
    const { roots, unplaced } = chartRoots(people);
    assert.deepEqual(roots.map((p) => p.name), ["Cfo", "Coo"]);
    assert.deepEqual(unplaced.map((p) => p.name), ["Loose"]);
  });
});

describe("validating a change", () => {
  const people = company();
  const check = (subjectId: string, level: OrgPerson["orgLevel"], managerId: string | null) =>
    validatePosition({ subjectId, level, managerId }, people);

  it("accepts a sensible move", () => {
    assert.equal(check("moses", "member", "ada"), null);
    assert.equal(check("bea", "manager", "coo"), null);
  });

  it("refuses someone reporting to themselves", () => {
    assert.match(check("bea", "manager", "bea")!, /themselves/);
  });

  it("refuses a loop: moving someone under their own report", () => {
    assert.match(check("ada", "manager", "moses")!, /loop/);
    assert.match(check("coo", "executive", "ada")!, /loop/);
  });

  it("requires the manager to be more senior", () => {
    assert.match(check("moses", "member", "chioma")!, /more senior|is a member/);
    assert.equal(check("bea", "manager", "ada"), null); // a head outranks a manager: fine
    assert.match(check("ada", "manager", "bea")!, /loop|more senior/); // but not the other way round
  });

  it("refuses a peer as manager: an executive can't report to an executive", () => {
    assert.match(check("cto", "executive", "coo")!, /more senior/);
  });

  it("refuses a manager who is only a member by access role", () => {
    const withMember = [...people, person("Newbie", { orgLevel: "manager", role: "member" })];
    assert.match(
      validatePosition({ subjectId: "moses", level: "member", managerId: "newbie" }, withMember)!,
      /is a member/,
    );
  });

  it("allows only one CEO", () => {
    assert.match(check("coo", "ceo", null)!, /already the CEO/);
    assert.equal(check("ceo", "ceo", null), null);
  });

  it("won't demote someone below the people who report to them", () => {
    assert.match(check("bea", "member", "ada")!, /no longer be more junior/);
  });

  it("lists only valid managers for the form", () => {
    const moses = people.find((p) => p.id === "moses")!;
    const names = managerCandidates(moses, "member", people).map((p) => p.name);
    assert.deepEqual(names.sort(), ["Ada", "Bea", "Ceo", "Coo", "Cto"]);
    assert.deepEqual(managerCandidates(moses, "ceo", people), []);
  });
});

describe("hierarchy health", () => {
  it("is quiet for a complete company", () => {
    assert.deepEqual(hierarchyIssues(company()), []);
  });

  it("reports a missing CEO and people with no reporting line", () => {
    const issues = hierarchyIssues([person("Coo", { orgLevel: "executive" }), person("Loose")]);
    assert.deepEqual(issues.map((i) => i.kind).sort(), ["no-ceo", "unplaced"]);
  });

  it("notices when making someone a department head breaks the ranking", () => {
    // Moses reports to Bea; if Moses becomes a head he now outranks his manager.
    const people = company().map((p) => (p.id === "moses" ? { ...p, headOf: ["Support"] } : p));
    assert.ok(hierarchyIssues(people).some((i) => i.kind === "rank"));
  });
});
