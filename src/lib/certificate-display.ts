import {
  certificateHeadline,
  certificateStatement,
  longDate,
  type CertificateData,
} from "./certificates";
import { defaultInternshipEnd } from "./grading";

/** The fields of a certificate row that decide what is printed on it. */
export type CertificateSource = {
  reference: string;
  person: string | null;
  programme: string | null;
  jobTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  issuedAt: Date;
  decidedBy: string | null;
  decidedByTitle: string | null;
};

/** Certificates issued before approvals existed have no recorded signer; the caller supplies one. */
export function certificateDisplay(
  source: CertificateSource,
  fallbackSigner: { name: string; jobTitle: string | null } | null,
): CertificateData {
  const isInternship = !source.programme;
  const end = source.endDate ?? (source.startDate ? defaultInternshipEnd(source.startDate) : null);
  const signer = source.decidedBy ? { name: source.decidedBy, jobTitle: source.decidedByTitle } : fallbackSigner;

  return {
    headline: certificateHeadline(isInternship),
    name: source.person ?? "",
    statement: certificateStatement({
      programme: source.programme,
      role: source.jobTitle,
      start: source.startDate,
      end,
    }),
    certificateNumber: source.reference,
    signerName: signer?.name ?? "CVSpan",
    signerTitle: signer?.jobTitle ?? "",
    issuedOn: longDate(source.issuedAt),
  };
}
