"use client";

import { useTransition } from "react";
import { RiDeleteBin6Line } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteJob, publishPost, setJobStage, submitPostForReview } from "@/app/actions/website";

export function PostActions({
  postId,
  status,
  canPublish,
}: {
  postId: string;
  status: string;
  canPublish: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (status === "draft") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await submitPostForReview(postId);
            router.refresh();
          })
        }
      >
        Send for review
      </Button>
    );
  }

  if (status === "in_review" && canPublish) {
    return (
      <Button size="sm" disabled={pending} onClick={() =>
          startTransition(async () => {
            await publishPost(postId);
            router.refresh();
          })
        }>
        Approve & publish
      </Button>
    );
  }

  if (status === "scheduled" && canPublish) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await publishPost(postId);
            router.refresh();
          })
        }
      >
        Publish now
      </Button>
    );
  }

  return null;
}

/** Moves a listing through draft → open → closed from the table. */
export function JobStageActions({ jobId, stage }: { jobId: string; stage: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const move = (next: "draft" | "open" | "screening" | "interviewing" | "closed") =>
    startTransition(async () => {
      await setJobStage(jobId, next);
      router.refresh();
    });

  /** Only listings that were never live, or are already closed, can be removed. */
  const removable = stage === "draft" || stage === "closed";

  const remove = () => {
    /** Deleting a listing also drops its applications, so confirm first. */
    if (!window.confirm("Delete this listing and its applications? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteJob(jobId);
      router.refresh();
    });
  };

  return (
    <span className="flex items-center gap-2">
      {stage === "draft" ? (
        <Button size="sm" disabled={pending} onClick={() => move("open")}>
          Publish
        </Button>
      ) : stage === "closed" ? (
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => move("open")}>
          Reopen
        </Button>
      ) : (
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => move("closed")}>
          Close role
        </Button>
      )}

      {removable ? (
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          aria-label="Delete listing"
          onClick={remove}
        >
          <RiDeleteBin6Line size={16} aria-hidden />
        </Button>
      ) : null}
    </span>
  );
}
