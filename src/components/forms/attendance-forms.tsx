"use client";

import { useState } from "react";
import { RiCalendarLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { requestLeave } from "@/app/actions/attendance";
import { UNPAID_LEAVE, workingDays } from "@/lib/leave";

/** The dates, with the number of working days they come to and what that leaves of the allowance. */
function LeaveDates({ allowance, remaining }: { allowance: number | null; remaining: number | null }) {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState("");
  const [type, setType] = useState("Annual leave");

  const days = start ? workingDays(start, end || start) : 0;
  const counts = allowance !== null && type !== UNPAID_LEAVE;
  const over = counts && remaining !== null && days > remaining;

  return (
    <>
      <Field label="Type">
        <select name="type" value={type} onChange={(event) => setType(event.target.value)} className={fieldClass}>
          <option>Annual leave</option>
          <option>Sick leave</option>
          <option>Study leave</option>
          <option>Unpaid leave</option>
          <option>Compassionate leave</option>
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <input name="startDate" type="date" required value={start} onChange={(event) => setStart(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="To" hint="Leave blank for a single day.">
          <input name="endDate" type="date" min={start} value={end} onChange={(event) => setEnd(event.target.value)} className={fieldClass} />
        </Field>
      </div>

      <p className={`text-caption ${over ? "text-error-text" : "text-muted"}`} aria-live="polite">
        {days} working day{days === 1 ? "" : "s"}
        {allowance !== null
          ? counts
            ? ` · you have ${remaining} left${over ? ", so this is too many" : ""}`
            : " · unpaid leave doesn't use your allowance"
          : ""}
        . Weekends aren&apos;t counted.
      </p>
    </>
  );
}

export function RequestLeaveButton({ allowance, remaining }: { allowance: number | null; remaining: number | null }) {
  return (
    <Dialog
      trigger={
        <Button variant="secondary">
          <RiCalendarLine size={18} aria-hidden />
          Request leave
        </Button>
      }
      title="Request leave"
      description="Your manager gets this in their approvals queue."
      submitLabel="Send request"
      action={requestLeave}
    >
      <LeaveDates allowance={allowance} remaining={remaining} />

      <Field label="Reason">
        <textarea
          name="reason"
          rows={2}
          placeholder="Optional"
          className="border-line-input text-primary placeholder:text-muted rounded-lg border bg-transparent px-3.5 py-2.5 text-para outline-none"
        />
      </Field>
    </Dialog>
  );
}
