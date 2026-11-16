"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { findLiveCertificate, getAllReferences } from "@/db/queries-certificates";
import { approvals, certificates, programmes, users } from "@/db/schema";
import { tierSql } from "@/db/tier";
import { INTERNSHIP_KIND, certificateTitle, mayRequestFor, nextReference } from "@/lib/certificates";
import { atLeast } from "@/lib/roles";
import { fail, ok, optionalText, parseForm, requiredId, type ActionResult } from "@/lib/validation";
import { decideCertificate } from "./certificate-flow";
import { isUniqueViolation, logActivity, notify, requireRole } from "./guards";

function refresh() {
  revalidatePath("/certificates");
  revalidatePath("/approvals");
  revalidatePath("/programmes");
  revalidatePath("/");
}

const submitSchema = z.object({
  userId: requiredId("person"),
  kind: z.string().min(1, "Choose what the certificate is for"),
  note: optionalText("Note", 1000),
});

/**
 * Puts someone forward for a certificate. A manager does it for their own reports and the
 * request goes to the admins to approve once the work has been judged satisfactory. An admin
 * issuing one is that approval, so it is issued straight away.
 */
export async function submitCertificate(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("manager");

  const parsed = parseForm(submitSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  const { userId, kind, note } = parsed.data;
  const isAdmin = atLeast(actor.role, "hr");

  if (!isAdmin && !note) return fail("Say briefly why their work deserves a certificate.");

  const [person] = await db
    .select({ id: users.id, name: users.name, managerId: users.managerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!person) return fail("That person no longer exists.");
  if (!mayRequestFor(actor, person)) {
    return fail(isAdmin ? "You cannot request a certificate for yourself." : "You can only put forward people who report to you.");
  }

  let programmeId: string | null = null;
  let programmeName: string | null = null;
  if (kind !== INTERNSHIP_KIND) {
    if (!z.uuid().safeParse(kind).success) return fail("Choose what the certificate is for.");
    const [programme] = await db.select({ id: programmes.id, name: programmes.name }).from(programmes).where(eq(programmes.id, kind)).limit(1);
    if (!programme) return fail("That programme no longer exists.");
    programmeId = programme.id;
    programmeName = programme.name;
  }

  if (await findLiveCertificate(userId, programmeId)) {
    return fail(`${person.name} already has this certificate, or one waiting for approval.`);
  }

  const now = new Date();
  const year = now.getFullYear();
  let created: { id: string } | undefined;
  /** Two people can ask at once and pick the same number; the unique reference settles it, so retry. */
  for (let attempt = 0; attempt < 3 && !created; attempt++) {
    try {
      [created] = await db
        .insert(certificates)
        .values({
          userId,
          programmeId,
          reference: nextReference(await getAllReferences(), year),
          status: isAdmin ? "issued" : "pending",
          requestedById: actor.id,
          requestedAt: now,
          requestNote: note,
          decidedById: isAdmin ? actor.id : null,
          decidedAt: isAdmin ? now : null,
          issuedAt: isAdmin ? now : null,
        })
        .returning({ id: certificates.id });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
  if (!created) return fail("Could not allocate a certificate reference. Please try again.");

  const title = certificateTitle(programmeName);
  if (isAdmin) {
    await notify(userId, `Your ${title.toLowerCase()} was issued`, "/certificates", "certificates");
    await logActivity(actor.id, "issued a certificate", `${title} · ${person.name}`);
  } else {
    await db.insert(approvals).values({
      kind: "certificate",
      subjectId: created.id,
      requestedById: actor.id,
      detail: `${title} for ${person.name}`,
    });
    const admins = await db.select({ id: users.id, role: tierSql() }).from(users);
    for (const admin of admins.filter((candidate) => atLeast(candidate.role, "hr"))) {
      await notify(admin.id, `${actor.name} put ${person.name} forward for a ${title.toLowerCase()}`, "/certificates", "approvals");
    }
    await logActivity(actor.id, "put someone forward for a certificate", `${title} · ${person.name}`);
  }

  refresh();
  return ok;
}

export async function approveCertificate(certificateId: string) {
  const actor = await requireRole("hr");
  const result = await decideCertificate(certificateId, true, actor);
  if (result) await logActivity(actor.id, "approved a certificate", result.person);
  refresh();
}

const declineSchema = z.object({ id: requiredId("certificate"), note: optionalText("Reason", 1000) });

export async function declineCertificate(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("hr");
  const parsed = parseForm(declineSchema, formData);
  if (!parsed.success) return fail(parsed.error);
  if (!parsed.data.note) return fail("Give a short reason, so they know what to improve.");

  const result = await decideCertificate(parsed.data.id, false, actor, parsed.data.note);
  if (result) await logActivity(actor.id, "declined a certificate", result.person);
  refresh();
  return ok;
}

/** Revoked certificates stay listed, and the public page says so. Restoring undoes it. */
export async function setCertificateRevoked(certificateId: string, revoked: boolean) {
  const actor = await requireRole("hr");

  const [row] = await db
    .select({ id: certificates.id, userId: certificates.userId, status: certificates.status, person: users.name })
    .from(certificates)
    .leftJoin(users, eq(certificates.userId, users.id))
    .where(eq(certificates.id, certificateId))
    .limit(1);
  if (!row || row.status !== "issued") return;

  await db.update(certificates).set({ revokedAt: revoked ? new Date() : null }).where(eq(certificates.id, certificateId));
  await notify(row.userId, revoked ? "One of your certificates was revoked" : "Your certificate was reinstated", "/certificates", "certificates");
  await logActivity(actor.id, revoked ? "revoked a certificate" : "reinstated a certificate", row.person ?? "");
  refresh();
}
