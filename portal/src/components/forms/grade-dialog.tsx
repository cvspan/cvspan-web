"use client";

import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { gradeMember } from "@/app/actions/performance";

export function GradeButton({
  userId,
  name,
  currentScore,
}: {
  userId: string;
  name: string;
  currentScore: number;
}) {
  return (
    <Dialog
      trigger={<Button size="sm">{currentScore > 0 ? "Regrade" : "Grade"}</Button>}
      title={`Grade ${name}`}
      description="Scores are recorded against this month's cycle and shown on their KPI page."
      submitLabel="Save grade"
      action={gradeMember}
    >
      <input type="hidden" name="userId" value={userId} />

      <Field label="Score" hint="0–100. The weighting of each measure is set per team.">
        <input
          name="score"
          type="number"
          min={0}
          max={100}
          defaultValue={currentScore || 75}
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Comment" hint="Optional, but it is what makes a score feel fair.">
        <textarea
          name="comment"
          rows={3}
          placeholder="What went well, what to work on"
          className="border-line-input text-primary placeholder:text-muted rounded-lg border bg-transparent px-3.5 py-2.5 text-para outline-none"
        />
      </Field>
    </Dialog>
  );
}
