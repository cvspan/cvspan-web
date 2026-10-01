/**
 * A small in-memory sliding-window limiter. It is best effort: on serverless each instance has
 * its own memory, so it slows a script down rather than stopping a determined one. It is meant
 * as a cheap first line in front of the honeypot and per-email de-duplication.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) {
  const hits = new Map<string, number[]>();

  return {
    /** Records an attempt for `key`. Returns false once `key` has used up its allowance. */
    allow(key: string) {
      const current = now();
      const recent = (hits.get(key) ?? []).filter((time) => current - time < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }

      recent.push(current);
      hits.set(key, recent);

      /** Keep the map from growing without bound. */
      if (hits.size > 5000) {
        for (const [name, times] of hits) {
          if (times.every((time) => current - time >= windowMs)) hits.delete(name);
        }
      }
      return true;
    },
  };
}
