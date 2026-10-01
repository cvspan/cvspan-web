import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createResilientFetch,
  errorCodes,
  isReadOnlyRequest,
  shouldRetry,
} from "./resilient-fetch";

const networkError = (code?: string) => {
  const error = new TypeError("fetch failed");
  if (code) (error as { cause?: unknown }).cause = Object.assign(new Error("boom"), { code });
  return error;
};

const select = JSON.stringify({ query: 'select "id" from "users"', params: [] });
const insert = JSON.stringify({ query: 'insert into "users" ("id") values ($1)', params: ["x"] });

/** A fetch that fails with each of `failures` in turn, then succeeds. Counts its calls. */
function flaky(failures: unknown[]) {
  const stub = Object.assign(
    async () => {
      const failure = failures[stub.calls++];
      if (failure) throw failure;
      return new Response("ok");
    },
    { calls: 0 },
  );
  return stub;
}

const fast = { delays: [0, 0] };

describe("isReadOnlyRequest", () => {
  it("is true only for plain selects, single or batched", () => {
    assert.equal(isReadOnlyRequest(select), true);
    assert.equal(isReadOnlyRequest(insert), false);
    assert.equal(isReadOnlyRequest(JSON.stringify({ queries: [{ query: "select 1" }, { query: "SELECT 2" }] })), true);
    assert.equal(
      isReadOnlyRequest(JSON.stringify({ queries: [{ query: "select 1" }, { query: "delete from x" }] })),
      false,
    );
  });

  it("is false for CTEs that could write, and for anything unparseable", () => {
    assert.equal(isReadOnlyRequest(JSON.stringify({ query: "with x as (delete from y returning 1) select * from x" })), false);
    assert.equal(isReadOnlyRequest("not json"), false);
    assert.equal(isReadOnlyRequest(undefined), false);
  });
});

describe("shouldRetry", () => {
  it("retries a network failure for reads", () => {
    assert.equal(shouldRetry(networkError("ECONNRESET"), true), true);
    assert.equal(shouldRetry(networkError(), true), true);
  });

  it("does not retry a write after a failure that may have reached the server", () => {
    assert.equal(shouldRetry(networkError("ECONNRESET"), false), false);
    assert.equal(shouldRetry(networkError(), false), false);
  });

  it("does retry a write when the request never left", () => {
    assert.equal(shouldRetry(networkError("ENOTFOUND"), false), true);
    assert.equal(shouldRetry(networkError("UND_ERR_CONNECT_TIMEOUT"), false), true);
  });

  it("ignores errors that are not network failures", () => {
    assert.equal(shouldRetry(new Error("syntax error"), true), false);
  });

  it("reads codes from anywhere in the cause chain", () => {
    const deep = new TypeError("fetch failed");
    (deep as { cause?: unknown }).cause = { cause: { code: "EAI_AGAIN" } };
    assert.deepEqual(errorCodes(deep), ["EAI_AGAIN"]);
  });
});

describe("createResilientFetch", () => {
  it("recovers when a read fails twice and then succeeds", async () => {
    const stub = flaky([networkError("ECONNRESET"), networkError("ECONNRESET")]);
    const response = await createResilientFetch(stub as unknown as typeof fetch, fast)("https://db", { body: select });
    assert.equal(await response.text(), "ok");
    assert.equal(stub.calls, 3);
  });

  it("gives up after the retries are used and rethrows the real error", async () => {
    const stub = flaky([networkError("ECONNRESET"), networkError("ECONNRESET"), networkError("ECONNRESET")]);
    await assert.rejects(
      createResilientFetch(stub as unknown as typeof fetch, fast)("https://db", { body: select }),
      /fetch failed/,
    );
    assert.equal(stub.calls, 3);
  });

  it("never replays a write after an ambiguous failure", async () => {
    const stub = flaky([networkError("ECONNRESET")]);
    await assert.rejects(createResilientFetch(stub as unknown as typeof fetch, fast)("https://db", { body: insert }));
    assert.equal(stub.calls, 1);
  });

  it("retries a write that never reached the server", async () => {
    const stub = flaky([networkError("ENOTFOUND")]);
    const response = await createResilientFetch(stub as unknown as typeof fetch, fast)("https://db", { body: insert });
    assert.equal(await response.text(), "ok");
    assert.equal(stub.calls, 2);
  });

  it("passes HTTP error responses straight through", async () => {
    const stub = Object.assign(async () => { stub.calls++; return new Response("bad", { status: 500 }); }, { calls: 0 });
    const response = await createResilientFetch(stub as unknown as typeof fetch, fast)("https://db", { body: select });
    assert.equal(response.status, 500);
    assert.equal(stub.calls, 1);
  });
});
