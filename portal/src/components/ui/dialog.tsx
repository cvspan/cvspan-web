"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCloseLine } from "@remixicon/react";
import type { ActionResult } from "@/lib/validation";
import { Button } from "./button";

/**
 * Trigger + native <dialog>. The browser gives us focus trapping, Escape to
 * close and inertness for the rest of the page, so we don't reimplement them.
 *
 * Actions may return an ActionResult: a failure keeps the dialog open with the
 * message shown and the user's input intact, instead of closing on a silent no-op.
 */
export function Dialog({
  trigger,
  title,
  description,
  children,
  submitLabel = "Save",
  action,
  wide = false,
  destructive = false,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  action: (formData: FormData) => void | ActionResult | Promise<void | ActionResult>;
  wide?: boolean;
  destructive?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const open = () => {
    setError(null);
    ref.current?.showModal();
  };

  return (
    <>
      <span onClick={open}>{trigger}</span>

      <dialog
        ref={ref}
        className={`bg-card text-primary border-line m-auto max-h-[calc(100dvh-2rem)] rounded-lg border p-0 backdrop:bg-black/50 ${
          wide ? "w-[min(40rem,calc(100vw-2rem))]" : "w-[min(32rem,calc(100vw-2rem))]"
        }`}
      >
        {/* Manual submit rather than <form action>: React resets the form after an action, which would wipe the input of a failed submit. */}
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await action(formData);
              if (result && !result.ok) {
                setError(result.error);
                return;
              }
              setError(null);
              ref.current?.close();
              formRef.current?.reset();
              /** Server actions invoked from a client handler do not refresh on their own. */
              router.refresh();
            });
          }}
          className="flex max-h-[inherit] flex-col"
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

          <div className="flex flex-col gap-4 overflow-y-auto p-5">
            {children}
            {error ? (
              <p
                role="alert"
                className="bg-error-surface text-error-text border-error-border rounded-lg border px-3.5 py-2.5 text-body"
              >
                {error}
              </p>
            ) : null}
          </div>

          <footer className="border-line flex justify-end gap-2 border-t px-5 py-4">
            <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
              Cancel
            </Button>
            <Button type="submit" variant={destructive ? "destructive" : "primary"} disabled={pending}>
              {pending ? "Saving…" : submitLabel}
            </Button>
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
