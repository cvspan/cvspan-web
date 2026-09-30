"use client";

import { useRef, useState } from "react";
import { RiDeleteBin6Line, RiImageAddLine, RiLoader4Line } from "@remixicon/react";
import { cn } from "@/lib/utils";

const inputClass =
  "border-line-input text-primary placeholder:text-muted h-11 w-full rounded-lg border bg-transparent px-3.5 text-para outline-none";

export function CoverField({
  initialUrl,
  initialAlt,
}: {
  initialUrl: string;
  initialAlt: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Upload failed");
      setUrl(result.url);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="coverImageUrl" value={url} />

      {url ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- served from our own media route */}
          <img
            src={url}
            alt=""
            className="border-line aspect-[16/9] w-full rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove cover image"
            className="bg-card border-line text-secondary hover:text-error-text absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <RiDeleteBin6Line size={16} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) upload(file);
          }}
          className={cn(
            "text-muted hover:border-line-input flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed transition-colors",
            dragging ? "border-line-input bg-accent-soft" : "border-line",
          )}
        >
          {busy ? (
            <>
              <RiLoader4Line size={24} className="animate-spin" aria-hidden />
              <span className="text-caption">Uploading…</span>
            </>
          ) : (
            <>
              <RiImageAddLine size={24} aria-hidden />
              <span className="text-caption">Drop an image, or click to choose</span>
              <span className="text-tiny">JPG, PNG, WebP or GIF · up to 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        aria-label="Upload a cover image"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />

      {error ? (
        <p role="alert" className="text-error-text text-caption">
          {error}
        </p>
      ) : null}

      <input
        name="coverAlt"
        defaultValue={initialAlt}
        placeholder="Describe the image for screen readers"
        aria-label="Cover image alt text"
        className={inputClass}
      />
    </div>
  );
}
