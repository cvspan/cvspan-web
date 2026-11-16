/*
 * Rules for a candidate's CV, shared by the apply endpoint and its tests. Candidates are strangers
 * on the internet, so the file's type is judged from its first bytes, not the name or type the
 * browser claims.
 */

/** Vercel functions accept about 4.5 MB per request, so stay under it. */
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

const SIGNATURES = [
  { type: "application/pdf", extension: "pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { type: "application/msword", extension: "doc", bytes: [0xd0, 0xcf, 0x11, 0xe0] }, // legacy Office
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: "docx",
    bytes: [0x50, 0x4b, 0x03, 0x04], // zip container
  },
] as const;

export type ResumeCheck =
  | { ok: true; contentType: string; extension: string }
  | { ok: false; error: string };

export function checkResume(head: Uint8Array, size: number): ResumeCheck {
  if (size === 0) return { ok: false, error: "That file is empty. Attach your resume as a PDF, DOC or DOCX." };
  if (size > MAX_RESUME_BYTES) return { ok: false, error: "Your resume must be 4 MB or smaller." };

  const match = SIGNATURES.find((signature) => signature.bytes.every((byte, index) => head[index] === byte));
  if (!match) return { ok: false, error: "Attach your resume as a PDF, DOC or DOCX file." };
  return { ok: true, contentType: match.type, extension: match.extension };
}

/** A download name that is safe in a header: letters, numbers, dashes and dots only. */
export function safeFilename(name: string, extension: string) {
  const base = name
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "resume"}.${extension}`;
}
