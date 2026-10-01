import { RiCheckboxCircleFill, RiCloseCircleFill } from "@remixicon/react";
import { Logo } from "@/components/brand/logo";
import { getCertificateByReference } from "@/db/queries";
import { formatDay } from "@/lib/format";

export const metadata = { title: "Verify a certificate · CVSpan" };

/**
 * Public: anyone holding a certificate reference can check it. It shows only what proves the
 * certificate is genuine: who it was issued to, for what, and when.
 */
export default async function VerifyPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const certificate = await getCertificateByReference(decodeURIComponent(reference));

  const state = !certificate ? "missing" : certificate.revokedAt ? "revoked" : "valid";

  return (
    <main className="bg-app flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-120">
        <Logo height={32} className="mb-6 block" />

        <div className="border-line bg-card rounded-lg border p-6">
          {state === "valid" && certificate ? (
            <>
              <p className="text-success-text flex items-center gap-2 text-title font-semibold">
                <RiCheckboxCircleFill size={26} aria-hidden />
                Valid certificate
              </p>
              <dl className="mt-5 flex flex-col gap-4">
                {[
                  ["Issued to", certificate.person ?? "—"],
                  ["Programme", certificate.programme ?? "—"],
                  ["Issued on", formatDay(certificate.issuedAt)],
                  ["Reference", certificate.reference],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">{label}</dt>
                    <dd className="text-primary mt-0.5 text-para">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <>
              <p className="text-error-text flex items-center gap-2 text-title font-semibold">
                <RiCloseCircleFill size={26} aria-hidden />
                {state === "revoked" ? "Certificate revoked" : "Certificate not found"}
              </p>
              <p className="text-secondary mt-3 text-body">
                {state === "revoked"
                  ? "This certificate was issued by CVSpan but has since been revoked, so it is no longer valid."
                  : "We have no certificate with that reference. Check it was copied correctly."}
              </p>
            </>
          )}
        </div>

        <p className="text-muted mt-4 text-center text-caption">CVSpan certificate registry</p>
      </div>
    </main>
  );
}
