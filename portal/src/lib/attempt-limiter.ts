/**
 * Slows down password guessing. Counts failures per key (an email address) in a sliding window and,
 * past the limit, refuses further attempts until the window has passed or a success clears the count.
 *
 * It is held in memory, so each server process keeps its own count: that is enough for one process and
 * makes guessing much slower across several. The map is bounded so a long-running server cannot grow
 * without limit.
 */
export function makeAttemptLimiter({
  max = 8,
  windowMs = 15 * 60_000,
  maxKeys = 5_000,
}: { max?: number; windowMs?: number; maxKeys?: number } = {}) {
  const failures = new Map<string, number[]>();

  const recent = (key: string, now: number) => (failures.get(key) ?? []).filter((time) => now - time < windowMs);

  return {
    /** True while this key has used up its attempts. */
    isLocked(key: string, now = Date.now()) {
      return recent(key, now).length >= max;
    },

    /** Notes a failed attempt. */
    fail(key: string, now = Date.now()) {
      if (!failures.has(key) && failures.size >= maxKeys) {
        for (const [other, times] of failures) {
          if (!times.some((time) => now - time < windowMs)) failures.delete(other);
        }
        if (failures.size >= maxKeys) failures.clear();
      }
      failures.set(key, [...recent(key, now), now]);
    },

    /** Forgets the key: after a successful sign-in, or after an admin sets a new password. */
    clear(key: string) {
      failures.delete(key);
    },

    /** Minutes until a locked key may try again, rounded up. */
    minutesLeft(key: string, now = Date.now()) {
      const times = recent(key, now);
      if (times.length < max) return 0;
      return Math.max(1, Math.ceil((windowMs - (now - times[0])) / 60_000));
    },
  };
}
