"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { approvals, blogPosts, leaveRequests } from "@/db/schema";
import { logActivity, notify, requireRole } from "./guards";

export async function resolveApproval(approvalId: string, approve: boolean) {
  const user = await requireRole("manager");

  const [item] = await db.select().from(approvals).where(eq(approvals.id, approvalId)).limit(1);
  if (!item || item.resolvedAt) return;

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

  if (item.kind === "blog_post" && item.subjectId && approve) {
    await db
      .update(blogPosts)
      .set({ status: "published", publishAt: new Date() })
      .where(eq(blogPosts.id, item.subjectId));
  }

  if (item.requestedById) {
    await notify(
      item.requestedById,
      `${user.name} ${approve ? "approved" : "declined"} your ${item.kind.replace("_", " ")}`,
      "/attendance",
    );
  }

  await logActivity(user.id, approve ? "approved a request" : "declined a request", item.detail ?? "");

  revalidatePath("/approvals");
  revalidatePath("/attendance");
  revalidatePath("/blog");
  revalidatePath("/");
}
