import "server-only";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import { approvals, certificates, kpiScores, programmes, users } from "./schema";
import { atLeast, type Role } from "@/lib/roles";
import { getAttendanceRate, getDirectReports } from "./queries";
import { getReviewsForUser } from "./queries-reviews";

const recipient = alias(users, "recipient");
const requester = alias(users, "requester");
const decider = alias(users, "decider");

const columns = {
  id: certificates.id,
  reference: certificates.reference,
  status: certificates.status,
  userId: certificates.userId,
  person: recipient.name,
  jobTitle: recipient.jobTitle,
  employmentType: recipient.employmentType,
  startDate: recipient.startDate,
  endDate: recipient.endDate,
  programmeId: certificates.programmeId,
  programme: programmes.name,
  requestedById: certificates.requestedById,
  requestedBy: requester.name,
  requestedAt: certificates.requestedAt,
  requestNote: certificates.requestNote,
  decidedBy: decider.name,
  decidedByTitle: decider.jobTitle,
  decidedAt: certificates.decidedAt,
  decisionNote: certificates.decisionNote,
  issuedAt: certificates.issuedAt,
  revokedAt: certificates.revokedAt,
};

export type CertificateRow = Awaited<ReturnType<typeof getCertificatesVisibleTo>>[number];

/**
 * Whose certificates a person may see on the Certificates page. Everyone sees their own; a
 * manager also sees their direct reports'; admins see everyone's.
 */
export async function getCertificatesVisibleTo(user: { id: string; role: Role }) {
  let scope;
  if (atLeast(user.role, "hr")) {
    scope = undefined;
  } else if (atLeast(user.role, "manager")) {
    const reports = await getDirectReports(user.id);
    scope = inArray(certificates.userId, [user.id, ...reports.map((report) => report.id)]);
  } else {
    scope = eq(certificates.userId, user.id);
  }

  return db
    .select(columns)
    .from(certificates)
    .leftJoin(recipient, eq(certificates.userId, recipient.id))
    .leftJoin(programmes, eq(certificates.programmeId, programmes.id))
    .leftJoin(requester, eq(certificates.requestedById, requester.id))
    .leftJoin(decider, eq(certificates.decidedById, decider.id))
    .where(scope)
    .orderBy(desc(sql`coalesce(${certificates.issuedAt}, ${certificates.requestedAt})`));
}

/** Open certificate requests with the approval row that carries them in the Approvals queue. */
export async function getApprovalIdsForCertificates(certificateIds: string[]) {
  if (certificateIds.length === 0) return new Map<string, string>();
  const rows = await db
    .select({ id: approvals.id, subjectId: approvals.subjectId })
    .from(approvals)
    .where(and(eq(approvals.kind, "certificate"), inArray(approvals.subjectId, certificateIds), sql`${approvals.resolvedAt} is null`));
  return new Map(rows.flatMap((row) => (row.subjectId ? [[row.subjectId, row.id] as const] : [])));
}

/**
 * Is there already a live certificate for this person and programme (or internship)? A pending
 * or issued one blocks another; a declined or revoked one does not.
 */
export async function findLiveCertificate(userId: string, programmeId: string | null) {
  const [row] = await db
    .select({ id: certificates.id, status: certificates.status })
    .from(certificates)
    .where(
      and(
        eq(certificates.userId, userId),
        programmeId ? eq(certificates.programmeId, programmeId) : sql`${certificates.programmeId} is null`,
        or(eq(certificates.status, "pending"), and(eq(certificates.status, "issued"), sql`${certificates.revokedAt} is null`)),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function getAllReferences() {
  const rows = await db.select({ reference: certificates.reference }).from(certificates);
  return rows.map((row) => row.reference);
}

/** The portal's own record of someone's work, so an approver isn't deciding blind. */
export async function getCertificateEvidence(userId: string) {
  const [scores, attendanceRate, reviews] = await Promise.all([
    db
      .select({ score: kpiScores.score })
      .from(kpiScores)
      .where(eq(kpiScores.userId, userId))
      .orderBy(desc(kpiScores.periodStart))
      .limit(6),
    getAttendanceRate(userId),
    getReviewsForUser(userId, 26),
  ]);

  const averages = reviews.map((review) => review.average).filter((value): value is number => value !== null);
  return {
    kpiAverage: scores.length ? Math.round(scores.reduce((sum, row) => sum + row.score, 0) / scores.length) : null,
    kpiLatest: scores[0]?.score ?? null,
    attendanceRate,
    reviewAverage: averages.length ? Math.round((averages.reduce((sum, value) => sum + value, 0) / averages.length) * 10) / 10 : null,
    reviewCount: averages.length,
  };
}

export type CertificateEvidence = Awaited<ReturnType<typeof getCertificateEvidence>>;

/** Whoever signs when no one is recorded as having approved it (certificates issued before approvals existed). */
export async function getDefaultSigner() {
  const [row] = await db
    .select({ name: users.name, jobTitle: users.jobTitle })
    .from(users)
    .where(and(eq(users.role, "super_admin"), eq(users.status, "active")))
    .limit(1);
  return row ?? null;
}

/**
 * What the public verify page and its share image need, found by reference. Only issued
 * certificates are returned; a revoked one still comes back so the page can say so.
 */
export async function getCertificateForShare(reference: string) {
  const [row] = await db
    .select(columns)
    .from(certificates)
    .leftJoin(recipient, eq(certificates.userId, recipient.id))
    .leftJoin(programmes, eq(certificates.programmeId, programmes.id))
    .leftJoin(requester, eq(certificates.requestedById, requester.id))
    .leftJoin(decider, eq(certificates.decidedById, decider.id))
    .where(and(eq(certificates.reference, reference), eq(certificates.status, "issued")))
    .limit(1);
  return row && row.issuedAt ? { ...row, issuedAt: row.issuedAt } : null;
}
