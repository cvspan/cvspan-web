"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { createJobListing, publishPost, submitPostForReview } from "@/app/actions/website";
import { employmentLabels, type EmploymentType } from "@/lib/format";

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

export function NewListingButton({ departments }: { departments: string[] }) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          New listing
        </Button>
      }
      title="New job listing"
      description="Published listings appear on the CVSpan website careers page."
      submitLabel="Open listing"
      action={createJobListing}
    >
      <Field label="Role title">
        <input name="title" required placeholder="Product Designer" className={fieldClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Department">
          <select name="department" className={fieldClass}>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </Field>
        <Field label="Employment type">
          <select name="employmentType" defaultValue="full_time" className={fieldClass}>
            {(Object.keys(employmentLabels) as EmploymentType[]).map((type) => (
              <option key={type} value={type}>
                {employmentLabels[type]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          className="border-line-input text-primary rounded-lg border bg-transparent px-3.5 py-2.5 text-para outline-none"
        />
      </Field>
    </Dialog>
  );
}
