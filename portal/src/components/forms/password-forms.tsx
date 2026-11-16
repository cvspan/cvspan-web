"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCheckLine, RiFileCopyLine, RiKey2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { changePassword, setTemporaryPassword } from "@/app/actions/passwords";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwords";

const input =
  "border-line-input text-primary h-11 w-full rounded-lg border bg-transparent px-3.5 text-para outline-none";

/**
 * Three boxes: the password they have now, the new one twice. Used on the Settings page and on the page
 * someone is sent to when an admin gave them a temporary password. On success they are signed out and
 * sign in again with the new password, so there is nothing to show here afterwards.
 */
export function ChangePasswordForm({ forced = false }: { forced?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await changePassword(data);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-primary text-body font-semibold">{forced ? "Temporary password" : "Current password"}</span>
        <input name="current" type="password" required autoComplete="current-password" className={input} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-primary text-body font-semibold">New password</span>
        <input name="next" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className={input} />
        <span className="text-muted text-tiny">
          At least {MIN_PASSWORD_LENGTH} characters. A few words joined together works well, and is easy to remember.
        </span>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-primary text-body font-semibold">Type the new password again</span>
        <input name="confirm" type="password" required autoComplete="new-password" className={input} />
      </label>

      {error ? (
        <p role="alert" className="bg-error-surface text-error-text border-error-border rounded-lg border px-3 py-2 text-caption">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col items-start gap-2">
        <Button type="submit" disabled={pending} className="h-11 px-5">
          {pending ? "Saving…" : "Change password"}
        </Button>
        <p className="text-muted text-tiny">You will be signed out and asked to sign in again with the new password.</p>
      </div>
    </form>
  );
}

/**
 * For HR and admins, on a person's profile: sets a temporary password and shows it once, to pass on.
 * `hasPassword` only changes the wording (first password, or a reset).
 */
export function SetPasswordButton({ userId, name, hasPassword }: { userId: string; name: string; hasPassword: boolean }) {
  const router = useRouter();
  const reveal = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function close() {
    reveal.current?.close();
    setShown(null);
    setCopied(false);
    router.refresh();
  }

  async function copy() {
    if (!shown) return;
    try {
      await navigator.clipboard.writeText(shown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* The password is on screen, so it can be copied by hand. */
    }
  }

  return (
    <>
      <Dialog
        trigger={
          <Button variant="secondary" type="button">
            <RiKey2Line size={18} aria-hidden />
            {hasPassword ? "Reset password" : "Set password"}
          </Button>
        }
        title={hasPassword ? `Reset ${name}'s password?` : `Set a password for ${name}`}
        description={
          hasPassword
            ? "Their old password stops working and they are signed out everywhere."
            : "They cannot sign in until they have a password."
        }
        submitLabel={hasPassword ? "Reset password" : "Create password"}
        action={async () => {
          const result = await setTemporaryPassword(userId);
          if (!result.ok) return { ok: false, error: result.error };
          setShown(result.password);
          /** The reveal opens after the confirmation closes. */
          setTimeout(() => reveal.current?.showModal(), 50);
          return { ok: true };
        }}
      >
        <p className="text-secondary text-body">
          You will see a temporary password once. Pass it to {name} yourself, in person or in a message. They choose their
          own password the first time they sign in.
        </p>
      </Dialog>

      <dialog
        ref={reveal}
        onClose={close}
        aria-labelledby={`pw-${userId}`}
        className="bg-card text-primary border-line m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border p-0 backdrop:bg-black/50"
      >
        <div className="flex flex-col gap-4 p-5">
          <h2 id={`pw-${userId}`} className="text-primary text-para font-semibold">
            Temporary password for {name}
          </h2>
          <p className="bg-raised text-primary rounded-lg px-4 py-3 text-center font-mono text-title tracking-wider select-all">
            {shown}
          </p>
          <p className="text-muted text-caption">
            This is the only time it is shown. If it is lost, reset the password again. {name} must change it when they sign in.
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={copy}>
              {copied ? <RiCheckLine size={16} aria-hidden /> : <RiFileCopyLine size={16} aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
