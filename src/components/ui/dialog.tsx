"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { RiCloseLine } from "@remixicon/react";
import { Button } from "./button";

/**
 * Trigger + native <dialog>. The browser gives us focus trapping, Escape to
 * close and inertness for the rest of the page, so we don't reimplement them.
 */
export function Dialog({
  trigger,
  title,
  description,
  children,
  submitLabel = "Save",
  action,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  return (
    <>
      <span onClick={() => ref.current?.showModal()}>{trigger}</span>

      <dialog
        ref={ref}
        className="bg-card text-primary border-line m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg border p-0 backdrop:bg-black/50"
      >
        <form
          action={async (formData) => {
            await action(formData);
            ref.current?.close();
            /** Server actions invoked from a client handler do not refresh on their own. */
            router.refresh();
          }}
        >
          <header className="border-line flex items-start gap-4 border-b px-5 py-4">
            <span className="min-w-0 flex-1">
              <h2 className="text-primary text-para font-semibold">{title}</h2>
              {description ? (
                <p className="text-muted mt-0.5 text-caption">{description}</p>
              ) : null}
            </span>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="text-muted hover:bg-raised hover:text-primary flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
            >
              <RiCloseLine size={18} aria-hidden />
            </button>
          </header>

          <div className="flex flex-col gap-4 p-5">{children}</div>

          <footer className="border-line flex justify-end gap-2 border-t px-5 py-4">
            <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </footer>
        </form>
      </dialog>
    </>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-primary text-body font-semibold">{label}</span>
      {children}
      {hint ? <span className="text-muted text-tiny">{hint}</span> : null}
    </label>
  );
}

export const fieldClass =
  "border-line-input text-primary placeholder:text-muted h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none";
