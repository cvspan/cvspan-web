import { randomInt } from "node:crypto";

/*
 * The rules for passwords, kept pure so they are easy to test. Nothing here touches the database.
 */

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;

/** Passwords everyone tries first. Not complete: it stops the obvious ones, including this portal's own demo password. */
const COMMON = new Set([
  "password",
  "password1",
  "password12",
  "password123",
  "passw0rd123",
  "1234567890",
  "12345678910",
  "0123456789",
  "qwertyuiop",
  "qwerty12345",
  "letmein1234",
  "welcome123",
  "welcome1234",
  "iloveyou123",
  "changeme123",
  "administrator",
  "cvspan2026",
  "cvspan2025",
  "cvspan12345",
  "cvspanportal",
]);

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Why a new password can't be used, in plain words, or null when it is fine. `context` holds what the
 * password must not be built from: the person's email and name, and their current password.
 */
export function passwordProblem(
  password: string,
  context: { email?: string; name?: string; current?: string } = {},
): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > MAX_PASSWORD_LENGTH) return `Use ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  if (password.trim() !== password) return "Leave out spaces at the start and end.";
  if (context.current !== undefined && password === context.current) return "Choose a password you have not used here before.";

  const flat = normalise(password);
  if (COMMON.has(flat)) return "That password is too easy to guess. Choose something longer and less common.";
  if (/^(.)\1+$/.test(password)) return "That password repeats one character. Choose something less predictable.";

  const email = (context.email ?? "").toLowerCase();
  const local = normalise(email.split("@")[0] ?? "");
  if (local.length >= 4 && flat.includes(local)) return "Do not use your email address in your password.";

  const nameParts = (context.name ?? "")
    .split(/\s+/)
    .map(normalise)
    .filter((part) => part.length >= 4);
  if (nameParts.some((part) => flat.includes(part))) return "Do not use your name in your password.";

  return null;
}

/** Letters and digits that cannot be mistaken for each other when read aloud or copied: no 0/O, 1/l/I. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/**
 * A temporary password to hand to someone: 12 characters in groups of four ("Kq7m-Zt4P-xW9d"), about 68
 * bits of randomness. `pick` is injectable so a test can check the shape; the default is a cryptographic one.
 */
export function generateTemporaryPassword(pick: (below: number) => number = (below) => randomInt(below)) {
  const characters = Array.from({ length: 12 }, () => ALPHABET[pick(ALPHABET.length)]);
  return [0, 4, 8].map((start) => characters.slice(start, start + 4).join("")).join("-");
}
