"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { approvals, attendance, leaveRequests, users } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { notify } from "./guards";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function clockInOrOut() {
  const user = await requireUser();
  const day = today();

  const [existing] = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.userId, user.id), eq(attendance.day, day)))
    .limit(1);

  if (!existing) {
    await db.insert(attendance).values({
      userId: user.id,
      day,
      kind: "on_site",
      clockIn: new Date(),
    });
  } else if (!existing.clockOut) {
    await db.update(attendance).set({ clockOut: new Date() }).where(eq(attendance.id, existing.id));
  }

  revalidatePath("/attendance");
  revalidatePath("/");
}

export async function requestLeave(formData: FormData) {
  const user = await requireUser();

  const type = String(formData.get("type") ?? "Annual leave");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "") || startDate;
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!startDate) return;

  const days =
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
    ) + 1;

  const [request] = await db
    .insert(leaveRequests)
    .values({ userId: user.id, type, startDate, endDate, days: Math.max(days, 1), reason })
    .returning();

  /** Route the decision to the person's manager, so it lands in their queue. */
  const [account] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (account?.managerId) {
    await db.insert(approvals).values({
      kind: "leave",
      subjectId: request.id,
      requestedById: user.id,
      assignedToId: account.managerId,
      detail: `${type}, ${Math.max(days, 1)} day${days > 1 ? "s" : ""}`,
    });
    await notify(account.managerId, `${user.name} requested ${type.toLowerCase()}`, "/approvals", "approvals");
  }

  revalidatePath("/attendance");
  revalidatePath("/approvals");
}
