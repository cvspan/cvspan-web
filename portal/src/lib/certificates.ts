import { atLeast, type Role } from "./roles";
import type { Tone } from "./tone";

export type CertificateStatus = "pending" | "issued" | "declined";

/** What someone sees: revoking is a second step on an issued certificate, so it reads as its own state. */
export type CertificateState = "pending" | "valid" | "declined" | "revoked";

export const certificateStateLabels: Record<CertificateState, string> = {
  pending: "Awaiting approval",
  valid: "Valid",
  declined: "Not approved",
  revoked: "Revoked",
};

export const certificateStateTones: Record<CertificateState, Tone> = {
  pending: "warning",
  valid: "success",
  declined: "error",
  revoked: "error",
};

export function certificateState(row: { status: CertificateStatus; revokedAt: Date | string | null }): CertificateState {
  if (row.status === "pending") return "pending";
  if (row.status === "declined") return "declined";
  return row.revokedAt ? "revoked" : "valid";
}

/** The select value that means "an internship certificate" rather than a programme. */
export const INTERNSHIP_KIND = "internship";

export function certificateTitle(programmeName: string | null) {
  return programmeName ? `${programmeName} certificate` : "Internship certificate";
}

/** `CVS-2026-0184` → 184. Anything else is ignored. */
function sequenceOf(reference: string, year: number) {
  const match = /^CVS-(\d{4})-(\d+)$/.exec(reference);
  return match && Number(match[1]) === year ? Number(match[2]) : 0;
}

/** The next reference for `year`, one past the highest already used that year. */
export function nextReference(existing: string[], year: number) {
  const highest = existing.reduce((max, reference) => Math.max(max, sequenceOf(reference, year)), 0);
  return `CVS-${year}-${String(highest + 1).padStart(4, "0")}`;
}

/** Whether `person` may be put forward by `actor`: admins for anyone, managers for their own reports. */
export function mayRequestFor(
  actor: { id: string; role: Role },
  person: { id: string; managerId: string | null },
) {
  if (person.id === actor.id) return false;
  if (atLeast(actor.role, "hr")) return true;
  return actor.role === "manager" && person.managerId === actor.id;
}

/* ------------------------------------------------------------- Certificate wording */

/** "2026-01-12" → "12/01/2026", as printed on the certificate. */
export function slashDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

/** "08 July 2026", from a date or timestamp. */
export function longDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(value),
  );
}

/** "6-month" for a half-year internship; "10-week" when it was shorter than two months. */
export function durationLabel(start: string, end: string) {
  const days = Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000));
  if (days < 60) return `${Math.max(1, Math.round(days / 7))}-week`;
  return `${Math.round(days / 30.44)}-month`;
}

/** The headline word: INTERNSHIP, or COMPLETION for a programme. */
export function certificateHeadline(isInternship: boolean) {
  return isInternship ? "INTERNSHIP" : "COMPLETION";
}

/**
 * Long names need a smaller face to stay on one line. The design sets 200 units for a name like
 * "PROGRESS OKOTETE" (16 characters); past that, the size shrinks in proportion, with a floor.
 */
export function nameFontSize(name: string) {
  const length = Math.max(1, name.trim().length);
  return Math.round(length <= 16 ? 200 : Math.max(100, (200 * 16) / length));
}

/* ---------------------------------------------------- Automatic certificate requests */

/**
 * An internship is over once its end date has passed: the date set on the person, else six
 * months after they started. Only people still active count, so past interns are not all
 * requested at once the day this arrives.
 */
export function internshipEnded(
  person: { employmentType: string; status: string; startDate: string | null; endDate: string | null },
  today: string,
  defaultEnd: (startDate: string) => string,
) {
  if (person.employmentType !== "internship" || person.status !== "active" || !person.startDate) return null;
  const end = person.endDate ?? defaultEnd(person.startDate);
  return end <= today ? end : null;
}

/** A programme is done for someone once it is marked complete, or their progress reaches 100%. */
export function programmeCompleted(enrolment: { progress: number; completedAt: Date | null }) {
  return enrolment.completedAt !== null || enrolment.progress >= 100;
}

/** What the admin sees as the reason for an automatic request. */
export function automaticRequestNote(kind: { internshipEnd: string } | { programme: string }) {
  return "internshipEnd" in kind
    ? `Their internship ended on ${slashDate(kind.internshipEnd)}. Check their work before approving.`
    : `They completed ${kind.programme}. Check their work before approving.`;
}

/** The portal's record of someone's work, as one line beside a certificate request. */
export function evidenceLine(evidence: {
  kpiAverage: number | null;
  attendanceRate: number;
  reviewAverage: number | null;
  reviewCount: number;
}) {
  return [
    evidence.kpiAverage !== null ? `KPI average ${evidence.kpiAverage}%` : "No KPI scores",
    evidence.attendanceRate ? `Attendance ${evidence.attendanceRate}%` : "No attendance",
    evidence.reviewAverage !== null
      ? `Weekly reviews ${evidence.reviewAverage}/5 over ${evidence.reviewCount} week${evidence.reviewCount === 1 ? "" : "s"}`
      : "No weekly reviews",
  ].join(" · ");
}

/* ------------------------------------------------------------ What the certificate says */

/** A run of the sentence under the name; `bold` and `light` carry the design's emphasis. */
export type StatementPart = { text: string; style?: "bold" | "light" };

/** Everything the artwork prints, composed once so the portal, the public page and the share image agree. */
export type CertificateData = {
  headline: string;
  name: string;
  statement: StatementPart[];
  certificateNumber: string;
  signerName: string;
  signerTitle: string;
  issuedOn: string;
};

export const CERTIFICATE_COMPANY = "CVSPAN";

/** "Has successfully completed …": an internship with its dates, or a named programme. */
export function certificateStatement(input: {
  programme: string | null;
  role: string | null;
  start: string | null;
  end: string | null;
}): StatementPart[] {
  if (input.programme) {
    return [
      { text: "Has successfully completed the " },
      { text: input.programme, style: "bold" },
      { text: ` programme at ${CERTIFICATE_COMPANY}.` },
    ];
  }

  const role = (input.role ?? "").trim();
  const dated = input.start && input.end;
  const parts: StatementPart[] = [
    {
      text: `Has successfully completed ${dated ? `a ${durationLabel(input.start!, input.end!)} ` : "an "}internship program`,
    },
  ];
  if (role) {
    parts.push({ text: " as a " }, { text: role.toUpperCase(), style: "bold" });
  }
  parts.push({ text: ` at ${CERTIFICATE_COMPANY}` });
  if (dated) {
    parts.push({ text: " from " }, { text: `${slashDate(input.start!)} to ${slashDate(input.end!)}`, style: "light" });
  }
  parts.push({ text: "." });
  return parts;
}

/** The share text and page title for a certificate: "Design Internship — Cohort 4 certificate". */
export function certificateShareText(input: { person: string; title: string; isOwner: boolean }) {
  return input.isOwner
    ? `I received my ${input.title} from CVSpan.`
    : `${input.person} received the ${input.title} from CVSpan.`;
}
