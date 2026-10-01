import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit, then refuses", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => 0 });
    assert.deepEqual([1, 2, 3, 4].map(() => limiter.allow("ip")), [true, true, true, false]);
  });

  it("lets someone back in once the window has passed", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => time });
    assert.equal(limiter.allow("ip"), true);
    assert.equal(limiter.allow("ip"), false);
    time = 1001;
    assert.equal(limiter.allow("ip"), true);
  });

  it("counts each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("b"), true);
    assert.equal(limiter.allow("a"), false);
  });
});
