import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  automaticManagerId,
  chartRoots,
  childrenMap,
  defaultLevelForRole,
  descendantIds,
  hierarchyIssues,
  indexPeople,
  levelBadge,
  levelOf,
  managerCandidates,
  planReportingLines,
  reportingLine,
  validatePosition,
  type OrgContext,
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

/** CEO → Cto (heads Tech) → Ada (manager) → Moses, Chioma (members); Coo heads Ops */
const company = () => [
  person("Ceo", { orgLevel: "ceo", role: "super_admin" }),
  person("Cto", { role: "admin", orgLevel: "manager", managerId: "ceo", departmentId: "tech", headOf: ["Technology"] }),
  person("Coo", { role: "admin", orgLevel: "manager", managerId: "ceo", departmentId: "ops", headOf: ["Operations"] }),
  person("Ada", { orgLevel: "manager", role: "manager", managerId: "cto", departmentId: "tech" }),
  person("Moses", { orgLevel: "member", managerId: "ada", departmentId: "tech" }),
  person("Chioma", { orgLevel: "member", managerId: "ada", departmentId: "tech" }),
];

const context = (people: OrgPerson[]): OrgContext => ({
  ceoId: people.find((p) => p.orgLevel === "ceo")?.id ?? null,
  departmentHeads: new Map(
    people.flatMap((p) => (p.headOf.length > 0 && p.departmentId ? [[p.departmentId, p.id] as [string, string]] : [])),
  ),
});

describe("levels", () => {
  it("a department head ranks as a head, whatever their stored level", () => {
    assert.equal(levelOf({ orgLevel: "manager", headOf: ["Design"] }), "head");
    assert.equal(levelOf({ orgLevel: "member", headOf: ["Design"] }), "head");
    assert.equal(levelOf({ orgLevel: "manager", headOf: [] }), "manager");
  });

  it("the CEO stays the CEO even if they head a department", () => {
    assert.equal(levelOf({ orgLevel: "ceo", headOf: ["Technology"] }), "ceo");
  });

  it("labels heads by department", () => {
    assert.equal(levelBadge({ orgLevel: "manager", headOf: ["Design"] }), "Head of Design");
    assert.equal(levelBadge({ orgLevel: "ceo", headOf: [] }), "CEO");
  });

  it("starts people at a level that matches their access role", () => {
    assert.equal(defaultLevelForRole("super_admin"), "manager");
    assert.equal(defaultLevelForRole("admin"), "manager");
    assert.equal(defaultLevelForRole("manager"), "manager");
    assert.equal(defaultLevelForRole("member"), "member");
  });
});

describe("reading the tree", () => {
  it("lists the chain above someone, nearest first", () => {
    const byId = indexPeople(company());
    assert.deepEqual(reportingLine("moses", byId).map((p) => p.name), ["Ada", "Cto", "Ceo"]);
    assert.deepEqual(reportingLine("ceo", byId), []);
  });

  it("finds everyone beneath someone at any depth", () => {
    const children = childrenMap(company());
    assert.deepEqual([...descendantIds("cto", children)].sort(), ["ada", "chioma", "moses"]);
    assert.equal(descendantIds("moses", children).size, 0);
  });

  it("orders each team by seniority, then name", () => {
    const children = childrenMap(company());
    assert.deepEqual(children.get("ceo")!.map((p) => p.name), ["Coo", "Cto"]);
    assert.deepEqual(children.get("ada")!.map((p) => p.name), ["Chioma", "Moses"]);
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

  it("starts at the heads of department when there is no CEO yet", () => {
    const people = company().filter((p) => p.id !== "ceo").map((p) => (p.managerId === "ceo" ? { ...p, managerId: null } : p));
    const { roots } = chartRoots(people);
    assert.deepEqual(roots.map((p) => p.name), ["Coo", "Cto"]);
  });
});

describe("validating a change", () => {
  const people = company();
  const check = (subjectId: string, level: Parameters<typeof validatePosition>[0]["level"], managerId: string | null) =>
    validatePosition({ subjectId, level, managerId }, people);

  it("accepts a sensible move", () => {
    assert.equal(check("moses", "member", "cto"), null);
    assert.equal(check("moses", "member", "ada"), null);
  });

  it("refuses someone reporting to themselves", () => {
    assert.match(check("ada", "manager", "ada")!, /themselves/);
  });

  it("refuses a loop: moving someone under their own report", () => {
    assert.match(check("ada", "manager", "moses")!, /loop/);
    assert.match(check("ada", "manager", "chioma")!, /loop/);
  });

  it("requires the manager to be more senior, so a manager can't report to a manager", () => {
    assert.match(check("moses", "member", "chioma")!, /more senior|is a member/);
    const peers = [...people, person("Bea", { orgLevel: "manager", role: "manager", managerId: "cto", departmentId: "tech" })];
    assert.match(validatePosition({ subjectId: "ada", level: "manager", managerId: "bea" }, peers)!, /more senior/);
  });

  it("refuses a manager who is only a member by access role", () => {
    const withMember = [...people, person("Newbie", { orgLevel: "manager", role: "member" })];
    assert.match(validatePosition({ subjectId: "moses", level: "member", managerId: "newbie" }, withMember)!, /is a member/);
  });

  it("allows only one CEO", () => {
    assert.match(check("cto", "ceo", null)!, /already the CEO/);
    assert.equal(check("ceo", "ceo", null), null);
  });

  it("a department head has to be in a department", () => {
    assert.match(validatePosition({ subjectId: "loose", level: "head", managerId: null }, [...people, person("Loose")])!, /isn't in a department/);
    assert.equal(check("ada", "head", null), null);
  });

  it("won't demote someone below the people who report to them", () => {
    assert.match(check("ada", "member", "cto")!, /no longer be more junior/);
  });

  it("lists only valid managers for the form", () => {
    const moses = people.find((p) => p.id === "moses")!;
    const names = managerCandidates(moses, "member", people).map((p) => p.name).sort();
    assert.deepEqual(names, ["Ada", "Ceo", "Coo", "Cto"]);
    assert.deepEqual(managerCandidates(moses, "ceo", people), []);
    assert.deepEqual(managerCandidates(moses, "head", people), []);
  });
});

describe("automatic reporting lines", () => {
  const people = company();
  const ctx = context(people);

  it("the CEO reports to no one, a head reports to the CEO, a manager to their department head", () => {
    const get = (id: string, level: Parameters<typeof automaticManagerId>[1]) =>
      automaticManagerId(people.find((p) => p.id === id)!, level, ctx);
    assert.equal(get("ceo", "ceo"), null);
    assert.equal(get("cto", "head"), "ceo");
    assert.equal(get("ada", "manager"), "cto");
  });

  it("a member's manager, and a manager in a department with no head, are choices, not rules", () => {
    const moses = people.find((p) => p.id === "moses")!;
    assert.equal(automaticManagerId(moses, "member", ctx), undefined);
    const headless = person("Solo", { orgLevel: "manager", role: "manager", departmentId: "none" });
    assert.equal(automaticManagerId(headless, "manager", ctx), undefined);
  });

  it("a head with no CEO yet reports to no one", () => {
    const noCeo = context(people.filter((p) => p.id !== "ceo"));
    assert.equal(automaticManagerId(people.find((p) => p.id === "cto")!, "head", noCeo), null);
  });

  it("an organisation already in line needs no changes", () => {
    assert.deepEqual(planReportingLines(people, ctx, new Map()), []);
  });

  it("naming a new department head brings the heads and managers into line", () => {
    // Before: Ada (manager) reports to Seyi-like exec; Tunde just became head of Tech.
    const before = [
      person("Ceo", { orgLevel: "ceo", role: "super_admin" }),
      person("Tunde", { orgLevel: "manager", role: "manager", managerId: "ceo", departmentId: "tech", headOf: ["Tech"] }),
      person("Ada", { orgLevel: "manager", role: "manager", managerId: "ceo", departmentId: "tech" }),
      person("Moses", { orgLevel: "member", managerId: "ada", departmentId: "tech" }),
    ];
    assert.deepEqual(planReportingLines(before, context(before), new Map()), [{ id: "ada", managerId: "tunde" }]);
  });

  it("makes every head report to the CEO", () => {
    const before = company().map((p) => (p.id === "coo" ? { ...p, managerId: "cto" } : p));
    assert.deepEqual(planReportingLines(before, context(before), new Map()), [{ id: "coo", managerId: "ceo" }]);
  });

  it("leaves a member's existing manager alone, even with a project manager available", () => {
    const projectManagers = new Map([["moses", "cto"]]);
    assert.deepEqual(planReportingLines(people, ctx, projectManagers), []);
  });

  it("gives a member with no manager their project manager, else their department head", () => {
    const before = company().map((p) => (p.id === "moses" || p.id === "chioma" ? { ...p, managerId: null } : p));
    const changes = planReportingLines(before, context(before), new Map([["moses", "ada"]]));
    assert.deepEqual(changes.sort((a, b) => a.id.localeCompare(b.id)), [
      { id: "chioma", managerId: "cto" }, // no project manager: the department head
      { id: "moses", managerId: "ada" }, // the project manager
    ]);
  });

  it("is idempotent: applying the plan leaves nothing more to do", () => {
    const before = company().map((p) => (p.id === "ada" ? { ...p, managerId: "ceo" } : p));
    const changes = planReportingLines(before, context(before), new Map());
    const after = before.map((p) => {
      const change = changes.find((c) => c.id === p.id);
      return change ? { ...p, managerId: change.managerId } : p;
    });
    assert.deepEqual(planReportingLines(after, context(after), new Map()), []);
  });
});

describe("hierarchy health", () => {
  it("is quiet for a complete company", () => {
    assert.deepEqual(hierarchyIssues(company()), []);
  });

  it("reports a missing CEO and people with no reporting line", () => {
    const issues = hierarchyIssues([person("Loose")]);
    assert.deepEqual(issues.map((i) => i.kind).sort(), ["no-ceo", "unplaced"]);
  });

  it("notices when making someone a department head breaks the ranking", () => {
    const people = company().map((p) => (p.id === "moses" ? { ...p, headOf: ["Support"] } : p));
    assert.ok(hierarchyIssues(people).some((i) => i.kind === "rank"));
  });
});
