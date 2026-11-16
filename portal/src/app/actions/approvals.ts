"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { approvals, leaveRequests } from "@/db/schema";
import { atLeast } from "@/lib/roles";
import { decideCertificate } from "./certificate-flow";
import { logActivity, notify, requireRole } from "./guards";

export async function resolveApproval(approvalId: string, approve: boolean) {
  const user = await requireRole("manager");

  const [item] = await db.select().from(approvals).where(eq(approvals.id, approvalId)).limit(1);
  if (!item || item.resolvedAt) return;

  /** Posts are decided by admins only, from the Blog and Approvals pages, with feedback when declined. */
  if (item.kind === "blog_post") throw new Error("Blog posts are approved or sent back by an admin from the review buttons.");

  /** Whether someone's work earns a certificate is an admin's call, even from a shared queue. */
  if (item.kind === "certificate") {
    if (!atLeast(user.role, "hr")) throw new Error("Only HR or an admin can decide on a certificate.");
    if (item.subjectId) await decideCertificate(item.subjectId, approve, user);
    await logActivity(user.id, approve ? "approved a certificate" : "declined a certificate", item.detail ?? "");
    revalidatePath("/approvals");
    revalidatePath("/certificates");
    revalidatePath("/programmes");
    return;
  }

  await db
    .update(approvals)
    .set({ resolvedAt: new Date() })
    .where(eq(approvals.id, approvalId));

  /** Approving the queue item is what actually moves the underlying record. */
  if (item.kind === "leave" && item.subjectId) {
    await db
      .update(leaveRequests)
      .set({ status: approve ? "approved" : "declined", decidedById: user.id })
      .where(eq(leaveRequests.id, item.subjectId));
  }

  if (item.requestedById) {
    await notify(
      item.requestedById,
      `${user.name} ${approve ? "approved" : "declined"} your ${item.kind.replace("_", " ")}`,
      item.kind === "leave" ? "/attendance" : "/approvals",
      "approvals",
    );
  }

  await logActivity(user.id, approve ? "approved a request" : "declined a request", item.detail ?? "");

  revalidatePath("/approvals");
  revalidatePath("/attendance");
  revalidatePath("/");
}
