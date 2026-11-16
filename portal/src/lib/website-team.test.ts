import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bioParagraphs, isTeamPhoto, uniqueSlug } from "./website-team";

describe("bioParagraphs", () => {
  it("splits on blank lines and joins wrapped lines", () => {
    assert.deepEqual(bioParagraphs("First line\nstill first.\n\nSecond paragraph.\n\n\n  \nThird."), [
      "First line still first.",
      "Second paragraph.",
      "Third.",
    ]);
  });

  it("returns nothing for an empty or missing bio", () => {
    assert.deepEqual(bioParagraphs(null), []);
    assert.deepEqual(bioParagraphs("  \n \n"), []);
  });
});

describe("isTeamPhoto", () => {
  it("accepts uploads and website files, nothing else", () => {
    assert.equal(isTeamPhoto("/api/media/3f2c1c7e-2f4a-4e0c-9d0e-0a1b2c3d4e5f"), true);
    assert.equal(isTeamPhoto("/assets/images/team/moses-arfo.jpg"), true);
    assert.equal(isTeamPhoto("https://evil.example/x.jpg"), false);
    assert.equal(isTeamPhoto("javascript:alert(1)"), false);
    assert.equal(isTeamPhoto("/assets/../secret"), false);
  });
});

describe("uniqueSlug", () => {
  it("numbers a slug that is taken", () => {
    assert.equal(uniqueSlug("ada-obi", []), "ada-obi");
    assert.equal(uniqueSlug("ada-obi", ["ada-obi"]), "ada-obi-2");
    assert.equal(uniqueSlug("ada-obi", ["ada-obi", "ada-obi-2"]), "ada-obi-3");
    assert.equal(uniqueSlug("", []), "team-member");
  });
});
