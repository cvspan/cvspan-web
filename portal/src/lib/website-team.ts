import { mediaSrc } from "./base-path";
import { websiteUrl } from "./website";

/** A bio is stored as plain text with blank lines between paragraphs; the website wants a list. */
export function bioParagraphs(bio: string | null | undefined) {
  return (bio ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Pictures are either uploaded here or, for people who predate this, files on the website itself. */
const UPLOADED = /^\/api\/media\/[0-9a-f-]{36}$/i;
const ON_WEBSITE = /^\/assets\/[\w./-]+$/;

export const isTeamPhoto = (value: string) =>
  UPLOADED.test(value) || (ON_WEBSITE.test(value) && !value.includes(".."));

/** Where the portal itself can load a team picture from, for the admin screen. */
export function teamPhotoSrc(photoUrl: string | null) {
  if (!photoUrl) return null;
  return ON_WEBSITE.test(photoUrl) ? websiteUrl(photoUrl) : mediaSrc(photoUrl);
}

/** What a new member's address on the website is built from: "Ada Obi" → "ada-obi", numbered if taken. */
export function uniqueSlug(base: string, taken: Iterable<string>) {
  const used = new Set(taken);
  const root = base || "team-member";
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
