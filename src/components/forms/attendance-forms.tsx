"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCalendarLine, RiTimeLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { clockInOrOut, requestLeave } from "@/app/actions/attendance";

export function ClockButton({ clockedIn }: { clockedIn: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await clockInOrOut();
          router.refresh();
        })
      }
    >
      <RiTimeLine size={18} aria-hidden />
      {clockedIn ? "Clock out" : "Clock in"}
    </Button>
  );
}

export function RequestLeaveButton() {
  const today = new Date().toISOString().slice(0, 10);

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
      <Field label="Type">
        <select name="type" defaultValue="Annual leave" className={fieldClass}>
          <option>Annual leave</option>
          <option>Sick leave</option>
          <option>Study leave</option>
          <option>Unpaid leave</option>
          <option>Compassionate leave</option>
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <input name="startDate" type="date" required defaultValue={today} className={fieldClass} />
        </Field>
        <Field label="To" hint="Leave blank for a single day.">
          <input name="endDate" type="date" className={fieldClass} />
        </Field>
      </div>

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
