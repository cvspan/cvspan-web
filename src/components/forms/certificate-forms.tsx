"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiSendPlaneLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { withBasePath } from "@/lib/base-path";
import { INTERNSHIP_KIND } from "@/lib/certificates";
import {
  approveCertificate,
  declineCertificate,
  setCertificateRevoked,
  submitCertificate,
} from "@/app/actions/certificates";

export function SubmitCertificateButton({
  people,
  programmes,
  isAdmin,
}: {
  people: { id: string; name: string; hint: string }[];
  programmes: { id: string; name: string }[];
  isAdmin: boolean;
}) {
  return (
    <Dialog
      trigger={
        <Button>
          {isAdmin ? <RiAddLine size={18} aria-hidden /> : <RiSendPlaneLine size={18} aria-hidden />}
          {isAdmin ? "Issue certificate" : "Put someone forward"}
        </Button>
      }
      title={isAdmin ? "Issue a certificate" : "Put someone forward for a certificate"}
      description={
        isAdmin
          ? "As an admin you approve it as you issue it. The person is notified."
          : "An admin reviews their work and approves it if it was satisfactory. You will be told the outcome."
      }
      submitLabel={isAdmin ? "Issue certificate" : "Send for approval"}
      action={submitCertificate}
    >
      <Field label="Person" hint={people.length === 0 ? "No one reports to you yet." : undefined}>
        <select name="userId" required defaultValue="" disabled={people.length === 0} className={fieldClass}>
          <option value="" disabled>
            Choose a person
          </option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} · {person.hint}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Certificate for">
        <select name="kind" required defaultValue={INTERNSHIP_KIND} className={fieldClass}>
          <option value={INTERNSHIP_KIND}>Internship completion</option>
          {programmes.map((programme) => (
            <option key={programme.id} value={programme.id}>
              {programme.name}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label={isAdmin ? "Note (optional)" : "Why their work deserves it"}
        hint={isAdmin ? undefined : "Admins see this next to their KPI, attendance and weekly review record."}
      >
        <textarea
          name="note"
          rows={3}
          maxLength={1000}
          required={!isAdmin}
          placeholder="e.g. Delivered the onboarding redesign and consistently met their weekly goals."
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </Dialog>
  );
}

export function ApproveCertificateButton({ certificateId, name }: { certificateId: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      disabled={pending}
      aria-label={`Approve certificate for ${name}`}
      onClick={() =>
        startTransition(async () => {
          await approveCertificate(certificateId);
          router.refresh();
        })
      }
    >
      <RiCheckLine size={16} aria-hidden />
      Approve
    </Button>
  );
}

export function DeclineCertificateButton({ certificateId, name }: { certificateId: string; name: string }) {
  return (
    <Dialog
      trigger={
        <Button size="sm" variant="secondary" aria-label={`Decline certificate for ${name}`}>
          <RiCloseLine size={16} aria-hidden />
          Decline
        </Button>
      }
      title={`Decline ${name}'s certificate`}
      description="They and whoever put them forward are told, with your reason."
      submitLabel="Decline certificate"
      action={declineCertificate}
      destructive
    >
      <input type="hidden" name="id" value={certificateId} />
      <Field label="Reason" hint="Be specific about what fell short, so they know what to improve.">
        <textarea name="note" rows={3} required maxLength={1000} className={`${fieldClass} h-auto py-2.5`} />
      </Field>
    </Dialog>
  );
}

export function RevokeCertificateButton({
  certificateId,
  revoked,
  name,
}: {
  certificateId: string;
  revoked: boolean;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      aria-label={`${revoked ? "Reinstate" : "Revoke"} certificate for ${name}`}
      onClick={() => {
        if (!revoked && !window.confirm(`Revoke ${name}'s certificate? Its public page will say it is no longer valid.`)) return;
        startTransition(async () => {
          await setCertificateRevoked(certificateId, !revoked);
          router.refresh();
        });
      }}
    >
      {revoked ? "Reinstate" : "Revoke"}
    </Button>
  );
}

/** Verify opens the public page; Copy link gives something to put on a CV or LinkedIn. */
export function VerifyActions({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/verify/${encodeURIComponent(reference)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${withBasePath(path)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the Verify link beside it still works. */
    }
  };

  return (
    <span className="flex gap-2">
      <Link href={path} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="secondary" type="button">
          Verify
          <RiExternalLinkLine size={14} aria-hidden />
        </Button>
      </Link>
      <Button size="sm" variant="secondary" type="button" onClick={copy}>
        <RiFileCopyLine size={14} aria-hidden />
        {copied ? "Copied" : "Copy link"}
      </Button>
    </span>
  );
}
