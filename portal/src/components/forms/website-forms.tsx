"use client";

import { useTransition } from "react";
import { RiArrowDownSLine, RiCheckLine, RiCloseLine, RiDeleteBin6Line } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { toneClasses } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { jobStageLabels } from "@/lib/format";
import { statusTone } from "@/lib/tone";
import { cn } from "@/lib/utils";
import { declinePost, deleteJob, publishPost, setJobStage, submitPostForReview } from "@/app/actions/website";

/** What can be done to a post from the list: send a draft for review, or (admins) decide on one. */
export function PostActions({
  postId,
  title,
  status,
  canPublish,
}: {
  postId: string;
  title: string;
  status: string;
  canPublish: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const run = (work: () => Promise<unknown>) =>
    startTransition(async () => {
      await work();
      router.refresh();
    });

  if (status === "draft") {
    return (
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => run(() => submitPostForReview(postId))}>
        Send for review
      </Button>
    );
  }

  if (status === "in_review" && canPublish) {
    return <PostReviewButtons postId={postId} title={title} />;
  }

  if (status === "scheduled" && canPublish) {
    return (
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => run(() => publishPost(postId))}>
        Publish now
      </Button>
    );
  }

  return null;
}

/** An admin's decision on a post in review: publish it, or send it back with what to change. */
export function PostReviewButtons({ postId, title }: { postId: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <span className="flex gap-2">
      <Dialog
        trigger={
          <Button size="sm" variant="secondary" type="button">
            <RiCloseLine size={16} aria-hidden />
            Send back
          </Button>
        }
        title={`Send back “${title}”`}
        description="The author gets this note and the post returns to their drafts, ready to change and send again."
        submitLabel="Send back"
        action={(formData) => declinePost(postId, String(formData.get("note") ?? ""))}
      >
        <Field label="What needs changing?">
          <textarea
            name="note"
            rows={4}
            required
            maxLength={1000}
            placeholder="e.g. Tighten the introduction and add a source for the figures."
            className={`${fieldClass} h-auto py-2.5`}
          />
        </Field>
      </Dialog>
      <Button
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await publishPost(postId);
            router.refresh();
          })
        }
      >
        <RiCheckLine size={16} aria-hidden />
        Approve & publish
      </Button>
    </span>
  );
}

const jobStages = ["draft", "open", "screening", "interviewing", "closed"] as const;
type JobStage = (typeof jobStages)[number];

/**
 * The status of a listing, changed in place. Only Open is on the website's careers page; Draft,
 * Screening, Interviewing and Closed take it off while the hiring carries on in the portal.
 */
export function JobStageSelect({ jobId, stage, title }: { jobId: string; stage: JobStage; title: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <span className="relative inline-flex">
      <select
        aria-label={`Status of ${title}`}
        value={stage}
        disabled={pending}
        onChange={(event) =>
          startTransition(async () => {
            await setJobStage(jobId, event.target.value as JobStage);
            router.refresh();
          })
        }
        className={cn(
          "inline-flex h-7 cursor-pointer appearance-none items-center rounded-full border py-0 pr-7 pl-3 text-body font-semibold outline-none focus-visible:ring-2 focus-visible:ring-current disabled:cursor-wait disabled:opacity-60",
          toneClasses[statusTone(stage)],
        )}
      >
        {jobStages.map((value) => (
          <option key={value} value={value}>
            {jobStageLabels[value]}
          </option>
        ))}
      </select>
      <RiArrowDownSLine size={16} aria-hidden className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2" />
    </span>
  );
}

/** Only listings that were never live, or are already closed, can be removed. */
export function JobDeleteButton({ jobId, stage }: { jobId: string; stage: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (stage !== "draft" && stage !== "closed") return null;

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={pending}
      aria-label="Delete listing"
      title="Delete listing"
      onClick={() => {
        /** Deleting a listing also drops its applications, so confirm first. */
        if (!window.confirm("Delete this listing and its applications? This cannot be undone.")) return;
        startTransition(async () => {
          await deleteJob(jobId);
          router.refresh();
        });
      }}
    >
      <RiDeleteBin6Line size={16} aria-hidden />
    </Button>
  );
}
