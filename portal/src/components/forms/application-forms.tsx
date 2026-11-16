"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setApplicationStage } from "@/app/actions/applications";
import { applicationStageLabels } from "@/lib/format";
import { applicationStages } from "@/lib/applications";

/** Moves a candidate between pipeline stages straight from the table. */
export function ApplicationStageSelect({ applicationId, stage, name }: { applicationId: string; stage: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label={`Stage for ${name}`}
      value={stage}
      disabled={pending}
      onChange={(event) =>
        startTransition(async () => {
          const result = await setApplicationStage(applicationId, event.target.value);
          if (!result.ok) alert(result.error);
          router.refresh();
        })
      }
      className="border-line-input text-primary h-9 cursor-pointer rounded-lg border bg-transparent px-2 text-caption outline-none disabled:opacity-60"
    >
      {applicationStages.map((value) => (
        <option key={value} value={value}>
          {applicationStageLabels[value]}
        </option>
      ))}
    </select>
  );
}
