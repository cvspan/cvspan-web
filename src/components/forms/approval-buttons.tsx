"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { resolveApproval } from "@/app/actions/approvals";

export function ApprovalButtons({
  approvalId,
  label,
  compact = false,
}: {
  approvalId: string;
  label: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const decide = (approve: boolean) =>
    startTransition(async () => {
      await resolveApproval(approvalId, approve);
      router.refresh();
    });

  if (compact) {
    return (
      <span className="flex gap-1">
        <button
          type="button"
          disabled={pending}
          onClick={() => decide(true)}
          aria-label={`Approve ${label}`}
          className="text-success-text hover:bg-success-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50"
        >
          <RiCheckLine size={18} aria-hidden />
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => decide(false)}
          aria-label={`Decline ${label}`}
          className="text-error-text hover:bg-error-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50"
        >
          <RiCloseLine size={18} aria-hidden />
        </button>
      </span>
    );
  }

  return (
    <span className="flex gap-2">
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => decide(false)}>
        <RiCloseLine size={16} aria-hidden />
        Decline
      </Button>
      <Button size="sm" disabled={pending} onClick={() => decide(true)}>
        <RiCheckLine size={16} aria-hidden />
        Approve
      </Button>
    </span>
  );
}
