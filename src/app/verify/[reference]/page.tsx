import type { Metadata } from "next";
import { RiCheckboxCircleFill, RiCloseCircleFill } from "@remixicon/react";
import { Certificate } from "@/components/certificate/certificate";
import { Logo } from "@/components/brand/logo";
import { getCertificateForShare, getDefaultSigner } from "@/db/queries-certificates";
import { certificateDisplay } from "@/lib/certificate-display";
import { certificateTitle } from "@/lib/certificates";
import { formatDay } from "@/lib/format";
import { portalPublicUrl } from "@/lib/public-api";

type Params = { params: Promise<{ reference: string }> };

const lookup = async (params: Params["params"]) => {
  const { reference } = await params;
  return getCertificateForShare(decodeURIComponent(reference));
};

/**
 * The preview that appears when a certificate link is shared. The image beside it
 * (opengraph-image.tsx) is the certificate itself.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const certificate = await lookup(params);
  if (!certificate || certificate.revokedAt) return { title: "Verify a certificate" };

  const title = `${certificate.person} · ${certificateTitle(certificate.programme)}`;
  const description = `Verified by CVSpan. Issued ${formatDay(certificate.issuedAt)} · Certificate ${certificate.reference}.`;

  /**
   * Spelt out with the portal's prefix: the portal is served at /portal, and a relative image
   * address would resolve against the website's root, where there is no such image.
   */
  const page = `${portalPublicUrl()}/verify/${encodeURIComponent(certificate.reference)}`;
  const image = { url: `${page}/opengraph-image`, width: 1200, height: 630, alt: title };
  return {
    title: { absolute: `${title} · CVSpan` },
    description,
    openGraph: { title, description, url: page, siteName: "CVSpan", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

/**
 * Public: anyone holding a certificate reference can check it. It shows the certificate as it was
 * issued, which is what proves it genuine: who it was issued to, for what, and when.
 */
export default async function VerifyPage({ params }: Params) {
  const certificate = await lookup(params);
  const state = !certificate ? "missing" : certificate.revokedAt ? "revoked" : "valid";
  const data =
    state === "valid" && certificate
      ? certificateDisplay(certificate, certificate.decidedBy ? null : await getDefaultSigner())
      : null;

  return (
    <main className="bg-app flex min-h-dvh flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-240">
        <Logo height={32} className="mb-6 block" />

        {data && certificate ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-success-text flex items-center gap-2 text-title font-semibold">
                <RiCheckboxCircleFill size={26} aria-hidden />
                Valid certificate
              </p>
              <p className="text-muted text-body">
                Issued to {certificate.person} on {formatDay(certificate.issuedAt)}
              </p>
            </div>

            <div className="border-line overflow-hidden rounded-lg border shadow-sm">
              <Certificate data={data} />
            </div>

            <dl className="border-line bg-card mt-4 grid gap-4 rounded-lg border p-5 sm:grid-cols-3">
              {[
                ["Issued to", certificate.person ?? "—"],
                [certificate.programme ? "Programme" : "Awarded for", certificate.programme ?? "Completing an internship at CVSpan"],
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
          <div className="border-line bg-card mx-auto max-w-120 rounded-lg border p-6">
            <p className="text-error-text flex items-center gap-2 text-title font-semibold">
              <RiCloseCircleFill size={26} aria-hidden />
              {state === "revoked" ? "Certificate revoked" : "Certificate not found"}
            </p>
            <p className="text-secondary mt-3 text-body">
              {state === "revoked"
                ? "This certificate was issued by CVSpan but has since been revoked, so it is no longer valid."
                : "We have no certificate with that reference. Check it was copied correctly."}
            </p>
          </div>
        )}

        <p className="text-muted mt-6 text-center text-caption">CVSpan certificate registry</p>
      </div>
    </main>
  );
}
