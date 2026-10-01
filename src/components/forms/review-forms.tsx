"use client";

import { RiEditLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { submitWeeklyReview } from "@/app/actions/reviews";
import { updateMemberDates } from "@/app/actions/people";
import { CRITERIA, RATING_LABELS, type CriterionKey } from "@/lib/grading";

/** Five numbered choices. Native radios underneath, so the keyboard and screen readers just work. */
function RatingInput({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <label key={value} className="relative" title={RATING_LABELS[value]}>
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={defaultValue === value}
            required
            className="peer sr-only"
          />
          <span className="border-line-input text-secondary hover:bg-raised peer-checked:bg-brand peer-checked:text-on-accent peer-focus-visible:ring-brand flex size-10 cursor-pointer items-center justify-center rounded-lg border text-body font-semibold transition-colors peer-checked:border-transparent peer-focus-visible:ring-2">
            {value}
          </span>
        </label>
      ))}
    </div>
  );
}

export type ReviewDialogData = {
  userId: string;
  name: string;
  weekStart: string;
  weekLabel: string;
  /** What the portal recorded, per criterion. */
  hints: Record<CriterionKey, string>;
  /** A 1–5 suggestion from that data, where there is any. */
  suggestions: Record<CriterionKey, number | null>;
  existing: { ratings: Partial<Record<CriterionKey, number>>; comment: string | null; updatedAt: string } | null;
};

export function GradeWeekButton({ data }: { data: ReviewDialogData }) {
  const { existing } = data;

  return (
    <Dialog
      key={existing?.updatedAt ?? "new"}
      trigger={
        <Button size="sm" variant={existing ? "secondary" : "primary"}>
          {existing ? "Edit grade" : "Grade"}
        </Button>
      }
      title={`${data.name} · week of ${data.weekLabel}`}
      description="Rate each area from 1 to 5. They see their grades and your comment as soon as you save."
      submitLabel={existing ? "Update grade" : "Save grade"}
      action={submitWeeklyReview}
      wide
    >
      <input type="hidden" name="userId" value={data.userId} />
      <input type="hidden" name="weekStart" value={data.weekStart} />

      <p className="text-muted text-tiny">
        {[1, 2, 3, 4, 5].map((value) => `${value} ${RATING_LABELS[value]}`).join(" · ")}
      </p>

      <ul className="flex flex-col gap-4">
        {CRITERIA.map((criterion) => {
          const suggestion = data.suggestions[criterion.key];
          return (
            <li key={criterion.key} className="border-line rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-primary text-body font-semibold">{criterion.name}</p>
                  <p className="text-muted text-tiny">{criterion.description}</p>
                </div>
                <RatingInput
                  name={`rating_${criterion.key}`}
                  label={criterion.name}
                  defaultValue={existing?.ratings[criterion.key] ?? suggestion ?? undefined}
                />
              </div>
              <p className="text-secondary mt-2.5 text-tiny">
                {data.hints[criterion.key]}
                {suggestion !== null && !existing?.ratings[criterion.key] ? (
                  <span className="text-accent font-semibold"> Suggested: {suggestion}.</span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>

      <Field label="Comment" hint="Optional, but it is what makes a rating feel fair.">
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          defaultValue={existing?.comment ?? ""}
          placeholder="What went well this week, and what to focus on next."
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </Dialog>
  );
}

export function EditDatesButton({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate: string | null;
  endDate: string | null;
}) {
  return (
    <Dialog
      key={`${startDate}-${endDate}`}
      trigger={
        <Button variant="secondary">
          <RiEditLine size={18} aria-hidden />
          Edit dates
        </Button>
      }
      title="Start and end dates"
      description="An intern's countdown runs between these dates. With no end date it defaults to six months after they start."
      submitLabel="Save dates"
      action={updateMemberDates}
    >
      <input type="hidden" name="userId" value={userId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <input name="startDate" type="date" defaultValue={startDate ?? ""} className={fieldClass} />
        </Field>
        <Field label="End date">
          <input name="endDate" type="date" defaultValue={endDate ?? ""} className={fieldClass} />
        </Field>
      </div>
    </Dialog>
  );
}
