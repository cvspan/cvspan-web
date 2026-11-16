import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { Certificate } from "@/components/certificate/certificate";
import { PrintCertificateButton } from "@/components/certificate/print-button";
import { PageHeader } from "@/components/ui/page-header";
import { getCertificatesVisibleTo, getDefaultSigner } from "@/db/queries-certificates";
import { certificatePrintCss } from "@/components/certificate/print-css";
import { certificateState, certificateTitle } from "@/lib/certificates";
import { certificateDisplay } from "@/lib/certificate-display";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Certificate" };

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  /** Visibility is scoped in the query: your own, your reports', or everyone's for admins. */
  const certificates = await getCertificatesVisibleTo({ id: user.id, role: user.viewRole });
  const certificate = certificates.find((row) => row.id === id);
  if (!certificate || certificateState(certificate) !== "valid" || !certificate.issuedAt) notFound();

  const data = certificateDisplay(
    { ...certificate, issuedAt: certificate.issuedAt },
    certificate.decidedBy ? null : await getDefaultSigner(),
  );

  return (
    <>
      <style media="print">{certificatePrintCss}</style>
      <Link href="/certificates" className="text-muted hover:text-primary flex items-center gap-1 text-caption print:hidden">
        <RiArrowLeftLine size={14} aria-hidden />
        Certificates
      </Link>

      <PageHeader pretitle="Certificate" title={certificateTitle(certificate.programme)} actions={<PrintCertificateButton />} />

      <div className="cert-print border-line max-w-300 overflow-hidden rounded-lg border">
        <Certificate data={data} />
      </div>
    </>
  );
}
