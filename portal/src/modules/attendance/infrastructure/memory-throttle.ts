import type { PresenceThrottle } from "../application/ports";

/**
 * A per-process throttle. The map is bounded and entries expire, so a long-lived server doesn't
 * grow without limit. Instances don't share it, which is fine: it only saves writes, and a missed
 * hit just means one extra (idempotent) write.
 */
export function makeMemoryThrottle(maxEntries = 10_000): PresenceThrottle {
  const last = new Map<string, number>();

  return {
    seenRecently(userId, now, windowMs) {
      const at = now.getTime();
      const previous = last.get(userId);
      if (previous !== undefined && at - previous < windowMs) return true;

      if (last.size >= maxEntries) {
        /** Drop what has expired; if that isn't enough, start over rather than grow. */
        for (const [key, time] of last) if (at - time >= windowMs) last.delete(key);
        if (last.size >= maxEntries) last.clear();
      }
      last.set(userId, at);
      return false;
    },
  };
}
