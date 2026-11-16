"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { approvals, leaveRequests, users } from "@/db/schema";
import { companyDay } from "@/lib/dates";
import { leaveBalance, leaveProblem, workingDays } from "@/lib/leave";
import { requireUser } from "@/lib/session";
import { fail, ok, type ActionResult } from "@/lib/validation";
import { notify } from "./guards";

export async function requestLeave(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const type = String(formData.get("type") ?? "Annual leave");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "") || startDate;
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return fail("Choose the dates for your leave.");

  const [account] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!account) return fail("Your account could not be found.");

  /** Full-time staff have 20 working days a year and interns 10 for the internship; pending requests count too. */
  const existing = await db.select().from(leaveRequests).where(eq(leaveRequests.userId, user.id));
  const problem = leaveProblem(leaveBalance(account, existing, companyDay()), { type, startDate, endDate });
  if (problem) return fail(problem);

  const days = workingDays(startDate, endDate);
  const [request] = await db
    .insert(leaveRequests)
    .values({ userId: user.id, type, startDate, endDate, days, reason })
    .returning();

  /** Route the decision to the person's manager, so it lands in their queue. */
  if (account.managerId) {
    await db.insert(approvals).values({
      kind: "leave",
      subjectId: request.id,
      requestedById: user.id,
      assignedToId: account.managerId,
      detail: `${type}, ${days} working day${days > 1 ? "s" : ""}`,
    });
    await notify(account.managerId, `${user.name} requested ${type.toLowerCase()}`, "/approvals", "approvals");
  }

  revalidatePath("/attendance");
  revalidatePath("/approvals");
  return ok;
}
