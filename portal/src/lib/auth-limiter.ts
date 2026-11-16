import "server-only";
import { makeAttemptLimiter } from "./attempt-limiter";

/**
 * One limiter per server process, shared by sign-in and by "change my password", so guessing a password
 * either way draws on the same allowance. Kept on globalThis so a dev-server reload does not reset it.
 */
const globalForLimiter = globalThis as unknown as { __cvspanLimiter?: ReturnType<typeof makeAttemptLimiter> };

export const authLimiter = (globalForLimiter.__cvspanLimiter ??= makeAttemptLimiter({ max: 8, windowMs: 15 * 60_000 }));
