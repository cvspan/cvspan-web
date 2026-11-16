import "server-only";
import { companyDay } from "@/lib/dates";
import { makeRecordPresence } from "./application/record-presence";
import { drizzleAttendanceRepository } from "./infrastructure/drizzle-attendance-repository";
import { makeMemoryThrottle } from "./infrastructure/memory-throttle";

/**
 * The attendance module's public face and its composition root: the one place that picks the
 * adapters. To move the throttle or the store to Redis, change it here.
 */
export const recordPresence = makeRecordPresence({
  attendance: drizzleAttendanceRepository,
  throttle: makeMemoryThrottle(),
  dayOf: companyDay,
});

/** Signing out clocks out right away. */
export { endPresence } from "./infrastructure/end-presence";
