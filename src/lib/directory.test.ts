import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countByGroup, directoryGroup, isDirectoryGroup } from "./directory";

describe("directoryGroup", () => {
  it("splits people who have left by how they worked with CVSpan", () => {
    assert.equal(directoryGroup({ status: "alumni", employmentType: "internship" }), "alumni");
    assert.equal(directoryGroup({ status: "alumni", employmentType: "volunteer" }), "alumni");
    assert.equal(directoryGroup({ status: "alumni", employmentType: "student" }), "alumni");
    assert.equal(directoryGroup({ status: "alumni", employmentType: "full_time" }), "former");
    assert.equal(directoryGroup({ status: "alumni", employmentType: "part_time" }), "former");
  });

  it("maps the other account statuses straight across", () => {
    assert.equal(directoryGroup({ status: "active", employmentType: "full_time" }), "active");
    assert.equal(directoryGroup({ status: "invited", employmentType: "internship" }), "upcoming");
    assert.equal(directoryGroup({ status: "suspended", employmentType: "full_time" }), "suspended");
  });
});

describe("countByGroup", () => {
  it("counts every group, including empty ones", () => {
    const counts = countByGroup([
      { status: "active", employmentType: "full_time" },
      { status: "active", employmentType: "internship" },
      { status: "alumni", employmentType: "internship" },
    ]);
    assert.deepEqual(counts, { active: 2, upcoming: 0, alumni: 1, former: 0, suspended: 0 });
  });
});

describe("isDirectoryGroup", () => {
  it("accepts only known groups", () => {
    assert.equal(isDirectoryGroup("former"), true);
    assert.equal(isDirectoryGroup("all"), false);
    assert.equal(isDirectoryGroup(undefined), false);
  });
});
