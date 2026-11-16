import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canEditPost, canSeePost, postState } from "./blog";

const me = { id: "me", role: "member" as const };
const admin = { id: "ad", role: "admin" as const };

describe("canEditPost", () => {
  it("lets authors edit only their own drafts", () => {
    assert.equal(canEditPost(me, { status: "draft", authorId: "me" }), true);
    assert.equal(canEditPost(me, { status: "draft", authorId: "other" }), false);
  });

  it("locks a post once it is in review, scheduled or published", () => {
    for (const status of ["in_review", "scheduled", "published"] as const) {
      assert.equal(canEditPost(me, { status, authorId: "me" }), false);
    }
  });

  it("lets admins edit anything, and HR and Management only their own", () => {
    assert.equal(canEditPost(admin, { status: "published", authorId: "other" }), true);
    assert.equal(canEditPost({ id: "hr", role: "hr" }, { status: "draft", authorId: "other" }), false);
  });
});

describe("canSeePost", () => {
  it("shows an employee their own posts and an admin everyone's", () => {
    assert.equal(canSeePost(me, { status: "published", authorId: "other" }), false);
    assert.equal(canSeePost(me, { status: "draft", authorId: "me" }), true);
    assert.equal(canSeePost(admin, { status: "draft", authorId: "other" }), true);
  });
});

describe("postState", () => {
  it("calls a draft with feedback 'changes requested'", () => {
    assert.equal(postState({ status: "draft", reviewNote: "Tighten the intro" }), "changes_requested");
    assert.equal(postState({ status: "draft", reviewNote: null }), "draft");
    assert.equal(postState({ status: "in_review", reviewNote: "old note" }), "in_review");
  });
});
