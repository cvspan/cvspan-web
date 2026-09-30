"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { publishPost, setJobStage, submitPostForReview } from "@/app/actions/website";

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

  if (stage === "draft") {
    return (
      <Button size="sm" disabled={pending} onClick={() => move("open")}>
        Publish
      </Button>
    );
  }

  if (stage === "closed") {
    return (
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => move("open")}>
        Reopen
      </Button>
    );
  }

  return (
    <Button size="sm" variant="secondary" disabled={pending} onClick={() => move("closed")}>
      Close role
    </Button>
  );
}
