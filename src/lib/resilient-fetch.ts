/*
 * A fetch that retries brief network failures, for the database's HTTP driver.
 *
 * Neon is reached over HTTPS, and now and then a request fails before it gets a response
 * ("TypeError: fetch failed"). Without a retry, that one blip crashes whichever page was
 * loading. Retrying is only safe when it can't repeat a write, so:
 *   - a failure before the request could reach the server (DNS, refused, connect timeout)
 *     is always retried;
 *   - any other network failure may have happened after the server acted, so it is retried
 *     only for plain SELECTs, which change nothing.
 * HTTP error responses are returned, not thrown, and are never retried here.
 */

/** Codes that mean the request never reached the server. */
const NEVER_SENT = new Set([
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "UND_ERR_CONNECT_TIMEOUT",
]);

/** Every `code` along an error's cause chain. */
export function errorCodes(error: unknown) {
  const codes: string[] = [];
  let current: unknown = error;
  for (let depth = 0; current && depth < 6; depth++) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string") codes.push(code);
    current = (current as { cause?: unknown }).cause;
  }
  return codes;
}

const isNetworkFailure = (error: unknown) =>
  error instanceof TypeError && /fetch failed|network|terminated|socket/i.test(error.message);

/** True when every statement in a Neon request body is a plain SELECT. */
export function isReadOnlyRequest(body: unknown) {
  if (typeof body !== "string") return false;

  try {
    const parsed = JSON.parse(body) as { query?: unknown; queries?: { query?: unknown }[] };
    const statements = parsed.queries ?? [parsed];
    return (
      statements.length > 0 &&
      statements.every(
        (statement) =>
          typeof statement.query === "string" && /^\s*select\b/i.test(statement.query),
      )
    );
  } catch {
    return false;
  }
}

export function shouldRetry(error: unknown, readOnly: boolean) {
  if (!isNetworkFailure(error)) return false;
  if (errorCodes(error).some((code) => NEVER_SENT.has(code))) return true;
  return readOnly;
}

export function createResilientFetch(
  fetchImpl: typeof fetch = fetch,
  { retries = 2, delays = [150, 500] }: { retries?: number; delays?: number[] } = {},
): typeof fetch {
  return async (input, init) => {
    const readOnly = isReadOnlyRequest(init?.body);

    for (let attempt = 0; ; attempt++) {
      try {
        return await fetchImpl(input, init);
      } catch (error) {
        if (attempt >= retries || !shouldRetry(error, readOnly)) throw error;

        const wait = delays[attempt] ?? delays[delays.length - 1] ?? 0;
        console.warn(`Database request failed, retrying in ${wait}ms (attempt ${attempt + 2})`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  };
}
