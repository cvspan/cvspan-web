"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  RiCheckLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiFacebookCircleFill,
  RiFileCopyLine,
  RiLinkedinBoxFill,
  RiMailLine,
  RiPrinterLine,
  RiTwitterXFill,
  RiWhatsappFill,
} from "@remixicon/react";
import { Certificate } from "@/components/certificate/certificate";
import { certificatePrintCss } from "@/components/certificate/print-css";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/components/analytics";
import { withBasePath } from "@/lib/base-path";
import { certificateShareText, type CertificateData } from "@/lib/certificates";

type Props = {
  data: CertificateData;
  title: string;
  reference: string;
  /** Who the certificate belongs to: it changes the wording of the share text and adds "Add to LinkedIn". */
  isOwner: boolean;
  issuedAt: string;
  triggerLabel?: string;
  triggerSize?: "sm" | "md";
};

/**
 * Opens a certificate over the page, with the ways to take it away: share it, copy its public link,
 * print it. Shared links land on the public verify page, whose preview image is the certificate itself.
 */
export function CertificateLightbox({ data, title, reference, isOwner, issuedAt, triggerLabel = "View certificate", triggerSize = "sm" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  /** Mounted on first open and kept, so the certificate does not vanish while the dialog fades out. */
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const verifyPath = `/verify/${encodeURIComponent(reference)}`;
  const publicUrl = () => `${window.location.origin}${withBasePath(verifyPath)}`;
  const shareText = certificateShareText({ person: data.name, title, isOwner });

  const show = () => {
    setMounted(true);
    ref.current?.showModal();
  };
  const hide = () => ref.current?.close();

  const popup = (url: string, method: string) => {
    trackEvent("share", { method, content_type: "certificate" });
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=680");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl());
      trackEvent("share", { method: "copy_link", content_type: "certificate" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the share buttons still carry the link. */
    }
  };

  const channels = [
    {
      label: "LinkedIn",
      icon: RiLinkedinBoxFill,
      onClick: () => popup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl())}`, "linkedin"),
    },
    {
      label: "X",
      icon: RiTwitterXFill,
      onClick: () =>
        popup(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(publicUrl())}`, "x"),
    },
    {
      label: "Facebook",
      icon: RiFacebookCircleFill,
      onClick: () => popup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl())}`, "facebook"),
    },
    {
      label: "WhatsApp",
      icon: RiWhatsappFill,
      onClick: () => popup(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${publicUrl()}`)}`, "whatsapp"),
    },
    {
      label: "Email",
      icon: RiMailLine,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${publicUrl()}`)}`;
      },
    },
  ];

  /** LinkedIn's own "add a certification to your profile" form, filled in. */
  const addToProfile = () => {
    const issued = new Date(issuedAt);
    const query = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: title,
      organizationName: "CVSpan",
      issueYear: String(issued.getUTCFullYear()),
      issueMonth: String(issued.getUTCMonth() + 1),
      certUrl: publicUrl(),
      certId: reference,
    });
    popup(`https://www.linkedin.com/profile/add?${query.toString()}`, "linkedin_profile");
  };

  return (
    <>
      <Button size={triggerSize} type="button" onClick={show}>
        {triggerLabel}
      </Button>

      <dialog
        ref={ref}
        className="cert-lightbox"
        aria-labelledby={`cert-title-${reference}`}
        onClick={(event) => {
          /** A click on the dimmed area (the dialog element itself, outside its panel) closes it. */
          if (event.target === event.currentTarget) hide();
        }}
      >
        {mounted ? <style media="print">{certificatePrintCss}</style> : null}
        <div className="cert-lightbox-panel">
          <header className="cert-lightbox-head">
            <div className="min-w-0">
              <h2 id={`cert-title-${reference}`} className="truncate text-para font-semibold text-white">
                {title}
              </h2>
              <p className="truncate text-caption text-white/70">
                {data.name} · {reference}
              </p>
            </div>
            <button type="button" onClick={hide} aria-label="Close" className="cert-lightbox-close">
              <RiCloseLine size={20} aria-hidden />
            </button>
          </header>

          <div className="cert-print cert-lightbox-sheet">
            {mounted ? <Certificate data={data} /> : null}
          </div>

          <footer className="cert-lightbox-foot">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-muted text-tiny font-semibold tracking-wide uppercase">Share</span>
              <span className="flex items-center gap-1">
                {channels.map(({ label, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    aria-label={`Share on ${label}`}
                    title={label}
                    className="text-secondary hover:bg-raised hover:text-primary focus-visible:outline-accent flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
                  >
                    <Icon size={20} aria-hidden />
                  </button>
                ))}
              </span>
              {isOwner ? (
                <Button size="sm" variant="secondary" type="button" onClick={addToProfile}>
                  <RiLinkedinBoxFill size={16} aria-hidden />
                  Add to LinkedIn profile
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="secondary" type="button" onClick={copy}>
                {copied ? <RiCheckLine size={14} aria-hidden /> : <RiFileCopyLine size={14} aria-hidden />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Link href={verifyPath} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="secondary" type="button">
                  Verify
                  <RiExternalLinkLine size={14} aria-hidden />
                </Button>
              </Link>
              <Button size="sm" type="button" onClick={() => window.print()}>
                <RiPrinterLine size={14} aria-hidden />
                Print or save as PDF
              </Button>
            </div>
          </footer>
        </div>
      </dialog>
    </>
  );
}
