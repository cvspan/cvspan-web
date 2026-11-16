"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCameraLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { deleteTeamMember, moveTeamMember, saveTeamMember, setTeamMemberVisible } from "@/app/actions/website-team";
import { uploadAvatar } from "@/lib/avatar-upload";
import { mediaSrc } from "@/lib/base-path";

/** Team pictures show at about 380px on the website, so 800px keeps them sharp on high-density screens. */
const PHOTO_SIZE = 800;

type Member = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  /** What the form submits: the stored path. */
  photoUrl: string | null;
  /** What the portal can display it from. */
  photoSrc: string | null;
  updatedAt: string;
};

/** Chooses a picture, crops it to a square and uploads it; the stored path travels with the form. */
function PhotoField({ initialUrl, initialSrc }: { initialUrl: string | null; initialSrc: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [preview, setPreview] = useState(initialSrc);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(file: File) {
    setBusy(true);
    setError(null);
    try {
      const stored = await uploadAvatar(file, PHOTO_SIZE);
      setUrl(stored);
      setPreview(mediaSrc(stored));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn't upload that picture. Try again.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label={preview ? "Change picture" : "Add a picture"}
        className="border-line-input bg-raised text-muted hover:border-accent relative flex size-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- served from our own media route or the website
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <RiCameraLine size={26} aria-hidden />
        )}
      </button>
      <div className="flex flex-col gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => input.current?.click()}>
          <RiCameraLine size={14} aria-hidden />
          {busy ? "Uploading…" : preview ? "Change picture" : "Add picture"}
        </Button>
        <p className="text-muted text-tiny">JPG, PNG or WebP, up to 5 MB. It is cropped to a square from the middle.</p>
        {error ? (
          <p role="alert" className="text-error-text text-tiny">
            {error}
          </p>
        ) : null}
      </div>
      <input type="hidden" name="photoUrl" value={url} />
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        aria-label="Choose a picture"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) choose(file);
        }}
      />
    </div>
  );
}

function MemberFields({ member }: { member?: Member }) {
  return (
    <>
      {member ? <input type="hidden" name="id" value={member.id} /> : null}
      <Field label="Picture">
        <PhotoField initialUrl={member?.photoUrl ?? null} initialSrc={member?.photoSrc ?? null} />
      </Field>
      <Field label="Full name">
        <input name="name" required maxLength={120} defaultValue={member?.name} placeholder="e.g. Ada Obi" className={fieldClass} />
      </Field>
      <Field label="Role">
        <input name="role" required maxLength={120} defaultValue={member?.role} placeholder="e.g. Head of Design" className={fieldClass} />
      </Field>
      <Field
        label="Bio (optional)"
        hint="Separate paragraphs with a blank line. With a bio, their card on the website opens a profile page; without one it stays a plain card."
      >
        <textarea
          name="bio"
          rows={6}
          maxLength={4000}
          defaultValue={member?.bio ?? ""}
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </>
  );
}

/** `count` changes when someone is added, which resets the form (and its picture) for the next person. */
export function AddTeamMemberButton({ count }: { count: number }) {
  return (
    <Dialog
      key={count}
      trigger={
        <Button type="button">
          <RiAddLine size={18} aria-hidden />
          Add team member
        </Button>
      }
      title="Add team member"
      description="They appear on the website's Team page as soon as you save."
      submitLabel="Add to website"
      wide
      action={saveTeamMember}
    >
      <MemberFields />
    </Dialog>
  );
}

export function EditTeamMemberButton({ member }: { member: Member }) {
  return (
    <Dialog
      key={member.updatedAt}
      trigger={
        <Button type="button" size="sm" variant="secondary">
          <RiEditLine size={14} aria-hidden />
          Edit
        </Button>
      }
      title={`Edit ${member.name}`}
      submitLabel="Save changes"
      wide
      action={saveTeamMember}
    >
      <MemberFields member={member} />
    </Dialog>
  );
}

export function DeleteTeamMemberButton({ id, name }: { id: string; name: string }) {
  return (
    <Dialog
      trigger={
        <Button type="button" size="sm" variant="ghost" aria-label={`Remove ${name}`}>
          <RiDeleteBin6Line size={14} aria-hidden />
        </Button>
      }
      title={`Remove ${name}?`}
      description="They are taken off the website's Team page and their profile page stops working. Hide them instead if you may want them back."
      submitLabel="Remove"
      destructive
      action={() => deleteTeamMember(id)}
    >
      <p className="text-secondary text-body">Their picture and bio are deleted too.</p>
    </Dialog>
  );
}

/** Hide or show, and move earlier or later in the list. */
export function TeamMemberControls({
  id,
  name,
  published,
  first,
  last,
}: {
  id: string;
  name: string;
  published: boolean;
  first: boolean;
  last: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const run = (work: () => Promise<unknown>) =>
    startTransition(async () => {
      await work();
      router.refresh();
    });

  return (
    <span className="flex items-center gap-1">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending || first}
        aria-label={`Move ${name} earlier`}
        onClick={() => run(() => moveTeamMember(id, "up"))}
      >
        <RiArrowUpLine size={14} aria-hidden />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending || last}
        aria-label={`Move ${name} later`}
        onClick={() => run(() => moveTeamMember(id, "down"))}
      >
        <RiArrowDownLine size={14} aria-hidden />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        aria-label={published ? `Hide ${name} from the website` : `Show ${name} on the website`}
        title={published ? "Hide from the website" : "Show on the website"}
        onClick={() => run(() => setTeamMemberVisible(id, !published))}
      >
        {published ? <RiEyeLine size={14} aria-hidden /> : <RiEyeOffLine size={14} aria-hidden />}
      </Button>
    </span>
  );
}
