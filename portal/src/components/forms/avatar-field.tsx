"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCameraLine, RiDeleteBin6Line } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { setAvatar } from "@/app/actions/profile";
import { uploadAvatar } from "@/lib/avatar-upload";

/** Add, change or remove your own profile photo. Saves as soon as the photo is chosen. */
export function AvatarField({ name, initialUrl }: { name: string; initialUrl: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function save(next: string | null) {
    const result = await setAvatar(next);
    if (!result.ok) throw new Error(result.error);
    setUrl(next);
    startTransition(() => router.refresh());
  }

  async function choose(file: File) {
    setBusy(true);
    setError(null);
    try {
      await save(await uploadAvatar(file));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn't update your photo. Try again.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await save(null);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Couldn't remove your photo. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-5">
      <Avatar name={name} src={url} size="xl" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={busy} onClick={() => input.current?.click()}>
            <RiCameraLine size={18} aria-hidden />
            {busy ? "Saving…" : url ? "Change photo" : "Add photo"}
          </Button>
          {url ? (
            <Button type="button" variant="secondary" disabled={busy} onClick={remove}>
              <RiDeleteBin6Line size={18} aria-hidden />
              Remove
            </Button>
          ) : null}
        </div>
        <p className="text-muted text-caption">JPG, PNG or WebP, up to 5 MB. It is cropped to a square.</p>
        {error ? (
          <p role="alert" className="text-error-text text-caption">
            {error}
          </p>
        ) : null}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        aria-label="Choose a profile photo"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) choose(file);
        }}
      />
    </div>
  );
}
