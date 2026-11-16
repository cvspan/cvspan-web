"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RiAddLine, RiDeleteBin6Line, RiEditLine, RiSendPlaneLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { MAX_KEY_RESULTS } from "@/lib/objectives";
import {
  createCycle,
  deleteObjective,
  reviewObjectives,
  saveObjective,
  submitObjectives,
  updateKeyResultProgress,
  withdrawObjectives,
} from "@/app/actions/objectives";

type KeyResultInput = { title: string; target: number; unit: string | null };

function KeyResultRows({ initial }: { initial: KeyResultInput[] }) {
  const [rows, setRows] = useState<KeyResultInput[]>(initial.length ? initial : [{ title: "", target: 100, unit: "" }, { title: "", target: 100, unit: "" }]);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-primary mb-1.5 text-body font-semibold">Key results</legend>
      <p className="text-muted -mt-1 text-tiny">How you will know the objective is done. Each has a target you can update as you go.</p>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_5.5rem_6.5rem_auto] items-center gap-2">
          <input
            name="kr_title"
            defaultValue={row.title}
            maxLength={160}
            placeholder={index === 0 ? "e.g. Ship the onboarding redesign" : "Another measurable result"}
            aria-label={`Key result ${index + 1}`}
            className={fieldClass}
          />
          <input name="kr_target" type="number" min={1} defaultValue={row.target} aria-label="Target" className={fieldClass} />
          <input name="kr_unit" defaultValue={row.unit ?? ""} maxLength={40} placeholder="Unit" aria-label="Unit" className={fieldClass} />
          <button
            type="button"
            aria-label={`Remove key result ${index + 1}`}
            disabled={rows.length === 1}
            onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
            className="text-muted hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RiDeleteBin6Line size={16} aria-hidden />
          </button>
        </div>
      ))}
      {rows.length < MAX_KEY_RESULTS ? (
        <Button type="button" size="sm" variant="ghost" className="self-start" onClick={() => setRows((current) => [...current, { title: "", target: 100, unit: "" }])}>
          <RiAddLine size={14} aria-hidden />
          Add key result
        </Button>
      ) : null}
    </fieldset>
  );
}

export function ObjectiveButton({
  cycleId,
  maxWeight,
  objective,
}: {
  cycleId: string;
  /** The most this objective can weigh, given the others. */
  maxWeight: number;
  objective?: { id: string; title: string; description: string | null; weight: number; keyResults: KeyResultInput[]; updatedAt: string };
}) {
  const editing = Boolean(objective);
  return (
    <Dialog
      key={objective?.updatedAt}
      wide
      trigger={
        editing ? (
          <Button size="sm" variant="secondary">
            <RiEditLine size={14} aria-hidden />
            Edit
          </Button>
        ) : (
          <Button disabled={maxWeight < 1}>
            <RiAddLine size={18} aria-hidden />
            Add objective
          </Button>
        )
      }
      title={editing ? "Edit objective" : "New objective"}
      description="An objective is an outcome you will work towards this cycle. Your supervisor reviews the whole set."
      submitLabel={editing ? "Save changes" : "Add objective"}
      action={saveObjective}
    >
      <input type="hidden" name="cycleId" value={cycleId} />
      {objective ? <input type="hidden" name="id" value={objective.id} /> : null}
      <Field label="Objective">
        <input name="title" required maxLength={160} defaultValue={objective?.title} placeholder="e.g. Raise the quality of design delivery" className={fieldClass} />
      </Field>
      <Field label="Why it matters (optional)">
        <textarea name="description" rows={2} maxLength={1000} defaultValue={objective?.description ?? ""} className={`${fieldClass} h-auto py-2.5`} />
      </Field>
      <Field label="Weight (%)" hint={`How much it counts towards your total. Up to ${maxWeight}% is left for this one.`}>
        <input name="weight" type="number" required min={1} max={maxWeight} defaultValue={objective?.weight ?? Math.min(maxWeight, 30)} className={fieldClass} />
      </Field>
      <KeyResultRows initial={objective?.keyResults ?? []} />
    </Dialog>
  );
}

/** Runs an action from a button and shows its error, if any, instead of failing silently. */
function useRun() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const run = (action: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const result = await action();
      if (!result.ok) alert(result.error);
      router.refresh();
    });
  return { pending, run };
}

export function SubmitObjectivesButton({ cycleId, disabled }: { cycleId: string; disabled?: boolean }) {
  const { pending, run } = useRun();
  return (
    <Button disabled={pending || disabled} onClick={() => run(() => submitObjectives(cycleId))}>
      <RiSendPlaneLine size={18} aria-hidden />
      Submit for review
    </Button>
  );
}

export function WithdrawButton({ cycleId }: { cycleId: string }) {
  const { pending, run } = useRun();
  return (
    <Button variant="secondary" size="sm" disabled={pending} onClick={() => run(() => withdrawObjectives(cycleId))}>
      Withdraw to edit
    </Button>
  );
}

export function DeleteObjectiveButton({ objectiveId, title }: { objectiveId: string; title: string }) {
  const { pending, run } = useRun();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      aria-label={`Delete ${title}`}
      onClick={() => {
        if (window.confirm(`Delete “${title}” and its key results?`)) run(() => deleteObjective(objectiveId));
      }}
    >
      <RiDeleteBin6Line size={14} aria-hidden />
    </Button>
  );
}

/** Saves when you leave the box, so updating progress is one keystroke and a click away. */
export function ProgressInput({ keyResultId, current, label }: { keyResultId: string; current: number; label: string }) {
  const { pending, run } = useRun();
  const [value, setValue] = useState(String(current));
  return (
    <input
      type="number"
      min={0}
      value={value}
      disabled={pending}
      aria-label={`Progress on ${label}`}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => {
        const next = Number(value);
        if (value !== "" && next !== current) run(() => updateKeyResultProgress(keyResultId, next));
        else if (value === "") setValue(String(current));
      }}
      className="border-line-input text-primary h-8 w-20 rounded-lg border bg-transparent px-2 text-caption outline-none disabled:opacity-60"
    />
  );
}

export function ReviewObjectivesButton({ userId, cycleId, name }: { userId: string; cycleId: string; name: string }) {
  return (
    <Dialog
      trigger={<Button size="sm">Review</Button>}
      title={`Review ${name}'s objectives`}
      description="Approve the set, or send it back with what to change. They are told either way."
      submitLabel="Send decision"
      action={reviewObjectives}
    >
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="cycleId" value={cycleId} />
      <fieldset className="flex flex-col gap-2">
        <legend className="text-primary mb-1.5 text-body font-semibold">Decision</legend>
        <label className="flex items-center gap-2 text-body">
          <input type="radio" name="decision" value="approve" defaultChecked />
          Approve. Progress tracking starts.
        </label>
        <label className="flex items-center gap-2 text-body">
          <input type="radio" name="decision" value="changes" />
          Ask for changes
        </label>
      </fieldset>
      <Field label="Note" hint="Required when asking for changes.">
        <textarea name="note" rows={3} maxLength={1000} className={`${fieldClass} h-auto py-2.5`} />
      </Field>
    </Dialog>
  );
}

export function NewCycleButton() {
  return (
    <Dialog
      trigger={
        <Button variant="secondary">
          <RiAddLine size={18} aria-hidden />
          New cycle
        </Button>
      }
      title="New performance cycle"
      description="People set and track their objectives within a cycle, such as a quarter or half-year."
      submitLabel="Create cycle"
      action={createCycle}
    >
      <Field label="Name">
        <input name="name" required maxLength={80} placeholder="e.g. H1 2027" className={fieldClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Starts">
          <input name="startDate" type="date" required className={fieldClass} />
        </Field>
        <Field label="Ends">
          <input name="endDate" type="date" required className={fieldClass} />
        </Field>
      </div>
    </Dialog>
  );
}
