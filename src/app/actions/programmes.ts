"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { programmes } from "@/db/schema";
import { datesInOrder, fail, ok, optionalDate, parseForm, requiredText, type ActionResult } from "@/lib/validation";
import { programmeStages } from "@/lib/programmes";
import { logActivity, requireRole } from "./guards";

const schema = z
  .object({
    name: requiredText("Cohort name", 100),
    stage: z.enum(programmeStages, "Choose a stage"),
    startDate: optionalDate("Start date"),
    endDate: optionalDate("End date"),
  })
  .refine((data) => datesInOrder(data.startDate, data.endDate), {
    message: "The end date can't be before the start date.",
    path: ["endDate"],
  });

/** Opens a new cohort. Admins only; people are enrolled afterwards. */
export async function createProgramme(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole("admin");

  const parsed = parseForm(schema, formData);
  if (!parsed.success) return fail(parsed.error);

  await db.insert(programmes).values(parsed.data);
  await logActivity(actor.id, "created a cohort", parsed.data.name);

  revalidatePath("/programmes");
  return ok;
}
