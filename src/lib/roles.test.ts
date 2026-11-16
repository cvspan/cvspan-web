import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accessSummary, atLeast, tierOf } from "./roles";

const person = (role: "super_admin" | "admin" | "employee", isHr = false, isManagement = false) => ({ role, isHr, isManagement });

describe("tierOf", () => {
  it("folds access and functions into one ladder", () => {
    assert.equal(tierOf(person("super_admin")), "super_admin");
    assert.equal(tierOf(person("admin", true, true)), "admin");
    assert.equal(tierOf(person("employee", true)), "hr");
    assert.equal(tierOf(person("employee", false, true)), "manager");
    assert.equal(tierOf(person("employee")), "member");
  });

  it("ranks someone in both HR and Management as HR", () => {
    assert.equal(tierOf(person("employee", true, true)), "hr");
  });
});

describe("atLeast", () => {
  it("makes each tier able to do what the ones below it can", () => {
    assert.equal(atLeast("admin", "hr"), true);
    assert.equal(atLeast("hr", "manager"), true);
    assert.equal(atLeast("hr", "admin"), false);
    assert.equal(atLeast("manager", "hr"), false);
    assert.equal(atLeast("member", "manager"), false);
  });
});

describe("accessSummary", () => {
  it("names the access and, for employees, their functions", () => {
    assert.equal(accessSummary(person("super_admin")), "Super admin");
    assert.equal(accessSummary(person("admin")), "Admin");
    assert.equal(accessSummary(person("employee")), "Employee · Staff");
    assert.equal(accessSummary(person("employee", false, true)), "Employee · Management");
    assert.equal(accessSummary(person("employee", true, true)), "Employee · HR and Management");
  });
});
