import "server-only";
import { and, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { getAllReferences } from "@/db/queries-certificates";
import { approvals, certificates, enrolments, programmes, users } from "@/db/schema";
import { tierSql } from "@/db/tier";
import { companyDay } from "@/lib/dates";
import { automaticRequestNote, internshipEnded, nextReference, programmeCompleted } from "@/lib/certificates";
import { defaultInternshipEnd } from "@/lib/grading";
import { atLeast } from "@/lib/roles";
import { isUniqueViolation, notify } from "./guards";

/**
 * Records an admin's decision on a pending certificate: approving issues it (and stamps the issue
 * date), declining keeps the reason. The Approvals queue entry is closed either way, and the
 * person and whoever put them forward are told. Shared by the Certificates page and the queue.
 */
export async function decideCertificate(
  certificateId: string,
  approve: boolean,
  actor: { id: string },
  note?: string | null,
) {
  const [row] = await db
    .select({
      id: certificates.id,
      userId: certificates.userId,
      status: certificates.status,
      requestedById: certificates.requestedById,
      person: users.name,
    })
    .from(certificates)
    .leftJoin(users, eq(certificates.userId, users.id))
    .where(eq(certificates.id, certificateId))
    .limit(1);

  /** Already decided (a double click, or two admins at once): nothing more to do. */
  if (!row || row.status !== "pending") return null;

  const now = new Date();
  await db
    .update(certificates)
    .set({
      status: approve ? "issued" : "declined",
      decidedById: actor.id,
      decidedAt: now,
      decisionNote: note?.trim() || null,
      issuedAt: approve ? now : null,
    })
    .where(and(eq(certificates.id, certificateId), eq(certificates.status, "pending")));

  await db
    .update(approvals)
    .set({ resolvedAt: now })
    .where(and(eq(approvals.kind, "certificate"), eq(approvals.subjectId, certificateId), isNull(approvals.resolvedAt)));

  const message = approve ? `Your certificate was approved and issued` : `Your certificate was not approved`;
  await notify(row.userId, message, "/certificates", "certificates");
  if (row.requestedById && row.requestedById !== row.userId && row.requestedById !== actor.id) {
    await notify(
      row.requestedById,
      `${row.person ?? "Your report"}'s certificate was ${approve ? "approved" : "declined"}`,
      "/certificates",
      "certificates",
    );
  }

  return { person: row.person ?? "" };
}

/**
 * Puts certificates that have fallen due in the admins' Approvals queue: an intern whose
 * internship has ended, and anyone who has finished a programme that issues certificates.
 * Nothing is issued here. Each becomes a pending request for an admin to judge, with the
 * person's record beside it.
 *
 * There is no scheduler, so this runs when an admin opens Approvals or Certificates. It is safe to
 * run any number of times: a person who already has a certificate for the same thing, whatever
 * its status, is never requested again, so a declined one stays declined.
 */
export async function ensureDueCertificateRequests() {
  const today = companyDay();

  const [interns, finished, existing, references] = await Promise.all([
    db
      .select({ id: users.id, name: users.name, employmentType: users.employmentType, status: users.status, startDate: users.startDate, endDate: users.endDate })
      .from(users)
      .where(and(eq(users.employmentType, "internship"), eq(users.status, "active"))),
    db
      .select({
        userId: enrolments.userId,
        userName: users.name,
        programmeId: programmes.id,
        programme: programmes.name,
        progress: enrolments.progress,
        completedAt: enrolments.completedAt,
      })
      .from(enrolments)
      .innerJoin(programmes, eq(enrolments.programmeId, programmes.id))
      .innerJoin(users, eq(enrolments.userId, users.id))
      .where(and(eq(programmes.issuesCertificate, true), ne(users.status, "suspended"))),
    db.select({ userId: certificates.userId, programmeId: certificates.programmeId }).from(certificates),
    getAllReferences(),
  ]);

  const has = new Set(existing.map((row) => `${row.userId}:${row.programmeId ?? "internship"}`));
  type Due = { userId: string; name: string; programmeId: string | null; title: string; note: string };
  const due: Due[] = [];

  for (const person of interns) {
    const end = internshipEnded(person, today, defaultInternshipEnd);
    if (end && !has.has(`${person.id}:internship`)) {
      due.push({ userId: person.id, name: person.name, programmeId: null, title: "Internship certificate", note: automaticRequestNote({ internshipEnd: end }) });
    }
  }
  for (const row of finished) {
    if (programmeCompleted(row) && !has.has(`${row.userId}:${row.programmeId}`)) {
      due.push({ userId: row.userId, name: row.userName, programmeId: row.programmeId, title: `${row.programme} certificate`, note: automaticRequestNote({ programme: row.programme }) });
    }
  }
  if (due.length === 0) return 0;

  const admins = (await db.select({ id: users.id, role: tierSql() }).from(users)).filter((person) => atLeast(person.role, "hr"));
  const year = new Date().getFullYear();
  const used = [...references];

  for (const item of due) {
    const reference = nextReference(used, year);
    used.push(reference);
    try {
      const [created] = await db
        .insert(certificates)
        .values({ userId: item.userId, programmeId: item.programmeId, reference, status: "pending", requestedById: null, requestNote: item.note })
        .returning({ id: certificates.id });
      await db.insert(approvals).values({ kind: "certificate", subjectId: created.id, requestedById: null, detail: `${item.title} for ${item.name}` });
      for (const admin of admins) {
        await notify(admin.id, `${item.name} is due a ${item.title.toLowerCase()}`, "/approvals", "approvals");
      }
    } catch (error) {
      /** Another admin's page load beat us to the same reference; they will have made the request. */
      if (!isUniqueViolation(error)) throw error;
    }
  }
  return due.length;
}
