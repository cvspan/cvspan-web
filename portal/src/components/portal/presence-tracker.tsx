"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";
import { PING_INTERVAL_MS } from "@/modules/attendance/domain/presence";

/**
 * Tells the portal someone is here: once on opening and every minute after. This is how attendance
 * is recorded, so there is nothing to click: the first signal of the day clocks them in, and when the
 * signals stop (the portal closed, the laptop asleep) they are clocked out at the last one.
 * Renders nothing.
 */
export function PresenceTracker() {
  useEffect(() => {
    const ping = () => {
      fetch(withBasePath("/api/presence"), { method: "POST", keepalive: true }).catch(() => {
        /* Offline: the next signal catches up, and a short gap is forgiven. */
      });
    };

    ping();
    const timer = setInterval(ping, PING_INTERVAL_MS);
    /** Waking a laptop or returning to a long-hidden tab shouldn't wait for the next minute. */
    const wake = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("online", ping);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("online", ping);
    };
  }, []);

  return null;
}
