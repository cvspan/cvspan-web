"use client";

import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { createProgramme } from "@/app/actions/programmes";
import { programmeStages } from "@/lib/programmes";

export function NewCohortButton() {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          New cohort
        </Button>
      }
      title="New cohort"
      description="Create the cohort now; people are enrolled on it afterwards."
      submitLabel="Create cohort"
      action={createProgramme}
    >
      <Field label="Name">
        <input name="name" required maxLength={100} placeholder="e.g. Data Students — Spring" className={fieldClass} />
      </Field>
      <Field label="Stage">
        <select name="stage" defaultValue="Planned" className={fieldClass}>
          {programmeStages.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <input name="startDate" type="date" className={fieldClass} />
        </Field>
        <Field label="End date">
          <input name="endDate" type="date" className={fieldClass} />
        </Field>
      </div>
      <label className="flex items-start gap-2.5 text-body">
        <input type="checkbox" name="issuesCertificate" defaultChecked className="mt-1" />
        <span>
          Issues a certificate on completion
          <span className="text-muted block text-tiny">
            When someone finishes, a certificate request appears in the admins&apos; Approvals queue.
          </span>
        </span>
      </label>
    </Dialog>
  );
}
