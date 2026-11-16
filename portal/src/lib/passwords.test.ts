import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { makeAttemptLimiter } from "./attempt-limiter";
import { generateTemporaryPassword, passwordProblem } from "./passwords";
import { sessionIsCurrent } from "./session-validity";

describe("passwordProblem", () => {
  const context = { email: "chioma.eze@cvspan.com", name: "Chioma Eze", current: "OldPassphrase#1" };

  it("accepts a long, uncommon password", () => {
    assert.equal(passwordProblem("blue-harbour-lamp-42", context), null);
  });

  it("asks for at least ten characters", () => {
    assert.match(passwordProblem("short1!", context) ?? "", /at least 10/);
  });

  it("refuses common passwords, including the demo one, however they are punctuated", () => {
    assert.match(passwordProblem("cvspan2026", context) ?? "", /too easy/);
    assert.match(passwordProblem("CvSpan-2026", context) ?? "", /too easy/);
    assert.match(passwordProblem("Password123", context) ?? "", /too easy/);
  });

  it("refuses one repeated character", () => {
    assert.match(passwordProblem("aaaaaaaaaaaa", context) ?? "", /repeats/);
  });

  it("refuses passwords built from the email or the name", () => {
    assert.match(passwordProblem("chioma.eze-rocks-2026", context) ?? "", /email/);
    assert.match(passwordProblem("chioma-is-great-2026", context) ?? "", /name/);
  });

  it("refuses the current password, and spaces at the edges", () => {
    assert.match(passwordProblem("OldPassphrase#1", context) ?? "", /not used/);
    assert.match(passwordProblem(" blue-harbour-lamp-42", context) ?? "", /spaces/);
  });

  it("refuses absurdly long ones", () => {
    assert.match(passwordProblem("x1".repeat(100), context) ?? "", /128/);
  });
});

describe("generateTemporaryPassword", () => {
  it("is three groups of four with no look-alike characters", () => {
    for (let i = 0; i < 50; i++) {
      const password = generateTemporaryPassword();
      assert.match(password, /^[A-Za-z2-9]{4}-[A-Za-z2-9]{4}-[A-Za-z2-9]{4}$/);
      assert.doesNotMatch(password, /[0OIl1]/);
    }
  });

  it("uses the random source it is given, and passes the strength rules", () => {
    let n = 0;
    const password = generateTemporaryPassword((below) => n++ % below);
    assert.equal(password, "ABCD-EFGH-JKLM");
    assert.equal(passwordProblem(generateTemporaryPassword()), null);
  });

  it("does not repeat", () => {
    assert.notEqual(generateTemporaryPassword(), generateTemporaryPassword());
  });
});

describe("attempt limiter", () => {
  it("locks after the allowed failures and releases when the window passes", () => {
    const limiter = makeAttemptLimiter({ max: 3, windowMs: 60_000 });
    for (let i = 0; i < 3; i++) limiter.fail("a@x.com", 1_000);
    assert.equal(limiter.isLocked("a@x.com", 2_000), true);
    assert.equal(limiter.minutesLeft("a@x.com", 2_000), 1);
    assert.equal(limiter.isLocked("a@x.com", 62_000), false);
  });

  it("counts each key on its own, and a success clears the count", () => {
    const limiter = makeAttemptLimiter({ max: 2 });
    limiter.fail("a@x.com");
    limiter.fail("a@x.com");
    assert.equal(limiter.isLocked("a@x.com"), true);
    assert.equal(limiter.isLocked("b@x.com"), false);
    limiter.clear("a@x.com");
    assert.equal(limiter.isLocked("a@x.com"), false);
  });

  it("stays within its key limit", () => {
    const limiter = makeAttemptLimiter({ max: 1, maxKeys: 3 });
    for (const key of ["a", "b", "c", "d", "e"]) limiter.fail(key);
    assert.equal(limiter.isLocked("e"), true);
  });
});

describe("sessionIsCurrent", () => {
  const changed = new Date("2026-11-16T10:00:00Z");

  it("accepts a session started with the current password", () => {
    assert.equal(sessionIsCurrent({ passwordChangedAt: changed }, changed.getTime()), true);
    assert.equal(sessionIsCurrent({ passwordChangedAt: null }, 0), true);
  });

  it("treats sessions from before this existed as matching an account that never changed its password", () => {
    assert.equal(sessionIsCurrent({ passwordChangedAt: null }, undefined), true);
  });

  it("ends every older session once the password changes", () => {
    assert.equal(sessionIsCurrent({ passwordChangedAt: changed }, 0), false);
    assert.equal(sessionIsCurrent({ passwordChangedAt: changed }, undefined), false);
    assert.equal(sessionIsCurrent({ passwordChangedAt: changed }, changed.getTime() - 1000), false);
  });
});
