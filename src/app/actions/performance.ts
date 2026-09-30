"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { kpiScores } from "@/db/schema";
import { logActivity, notify, requireRole } from "./guards";

/** Grading anchors on the first of the month, so one cycle per person per month. */
function currentPeriodStart() {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

export async function gradeMember(formData: FormData) {
  const user = await requireRole("manager");

  const userId = String(formData.get("userId") ?? "");
  const score = Number(formData.get("score") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim() || null;
  if (!userId || Number.isNaN(score) || score < 0 || score > 100) return;

  await db.insert(kpiScores).values({
    userId,
    gradedById: user.id,
    periodStart: currentPeriodStart(),
    score,
    comment,
  });

  await notify(userId, `${user.name} graded your KPI cycle: ${score}%`, "/kpis");
  await logActivity(user.id, "graded a KPI cycle", `${score}%`);

  revalidatePath("/team");
  revalidatePath("/kpis");
  revalidatePath("/");
}
