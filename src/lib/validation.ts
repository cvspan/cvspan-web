import { z } from "zod";

/** What a server action hands back so the form can show the problem instead of closing. */
export type ActionResult = { ok: true } | { ok: false; error: string };

export const ok: ActionResult = { ok: true };
export const fail = (error: string): ActionResult => ({ ok: false, error });

/** FormData → plain object. Repeated keys (checkbox groups) become arrays. */
function formToObject(formData: FormData) {
  const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const key of new Set(formData.keys())) {
    const values = formData.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
}

export function parseForm<S extends z.ZodType>(
  schema: S,
  formData: FormData,
): { success: true; data: z.output<S> } | { success: false; error: string } {
  const parsed = schema.safeParse(formToObject(formData));
  if (parsed.success) return { success: true, data: parsed.data };
  return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
}

/** Empty inputs arrive as "" — treat them as "not provided". */
const blankToNull = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === undefined || (typeof value === "string" && value.trim() === "") ? null : value),
    schema.nullable(),
  );

export const requiredText = (label: string, max = 120) =>
  z
    .string(`${label} is required`)
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

export const optionalText = (label: string, max = 2000) =>
  blankToNull(z.string().trim().max(max, `${label} must be ${max} characters or fewer`));

export const optionalDate = (label: string) =>
  blankToNull(z.iso.date(`${label} must be a valid date`));

export const requiredId = (label: string) => z.uuid(`Choose a ${label}`);

export const optionalId = (label: string) => blankToNull(z.uuid(`Choose a valid ${label}`));

/** Checkbox groups: one value arrives as a string, none as undefined. */
export const idList = (label: string) =>
  z.preprocess(
    (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value]),
    z.array(z.uuid(`Choose a valid ${label}`)),
  );

/** `target` must not come before `start`. Used by projects and milestones. */
export function datesInOrder(start: string | null, end: string | null) {
  return !start || !end || end >= start;
}
