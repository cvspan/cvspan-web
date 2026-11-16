"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { applicationStages } from "@/lib/applications";
import { fail, ok, type ActionResult } from "@/lib/validation";
import { logActivity, requireRole } from "./guards";

/** Moves a candidate along the hiring pipeline. Admins only. */
export async function setApplicationStage(applicationId: string, stage: string): Promise<ActionResult> {
  const actor = await requireRole("hr");

  if (!(applicationStages as readonly string[]).includes(stage)) return fail("Unknown stage.");

  const [application] = await db.select().from(applications).where(eq(applications.id, applicationId)).limit(1);
  if (!application) return fail("That application no longer exists.");

  await db
    .update(applications)
    .set({ stage: stage as (typeof applicationStages)[number] })
    .where(eq(applications.id, applicationId));

  await logActivity(actor.id, `moved an applicant to ${stage}`, application.candidateName);

  revalidatePath(`/careers/${application.jobId}/applicants`);
  revalidatePath("/careers");
  return ok;
}
