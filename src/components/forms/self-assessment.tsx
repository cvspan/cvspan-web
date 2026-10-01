"use client";

import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { saveSelfAssessment } from "@/app/actions/self-assessment";

export function SelfAssessmentButton({
  monthLabel,
  current,
}: {
  monthLabel: string;
  current: { score: number; comment: string | null; updatedAt: string } | null;
}) {
  return (
    <Dialog
      key={current?.updatedAt ?? "new"}
      trigger={<Button>{current ? "Update self-assessment" : "Start self-assessment"}</Button>}
      title={`Self-assessment · ${monthLabel}`}
      description="How do you think this month went? Your manager sees this when they grade you. It does not change your official KPI score."
      submitLabel="Save self-assessment"
      action={saveSelfAssessment}
    >
      <Field label="Your score" hint="0 to 100, against the measures listed on this page.">
        <input
          name="score"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={current?.score ?? 75}
          className={fieldClass}
        />
      </Field>
      <Field label="Notes" hint="What went well, and what you want to improve.">
        <textarea
          name="comment"
          rows={4}
          maxLength={1000}
          defaultValue={current?.comment ?? ""}
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </Dialog>
  );
}
