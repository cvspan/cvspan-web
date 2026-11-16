import { RiMedalLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import {
  ApproveCertificateButton,
  DeclineCertificateButton,
  RevokeCertificateButton,
  SubmitCertificateButton,
  VerifyActions,
} from "@/components/forms/certificate-forms";
import {
  getApprovalIdsForCertificates,
  getCertificateEvidence,
  getCertificatesVisibleTo,
  getDefaultSigner,
  type CertificateEvidence,
  type CertificateRow,
} from "@/db/queries-certificates";
import { getDirectReports, getPeople, getProgrammes, getUserById } from "@/db/queries";
import {
  certificateState,
  certificateStateLabels,
  certificateStateTones,
  certificateTitle,
  evidenceLine,
} from "@/lib/certificates";
import { employmentLabels, formatDay, relativeDays, type EmploymentType } from "@/lib/format";
import { internshipWindow } from "@/lib/grading";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { CertificateLightbox } from "@/components/certificate/certificate-lightbox";
import { certificateDisplay } from "@/lib/certificate-display";
import { ensureDueCertificateRequests } from "@/app/actions/certificate-flow";

export const metadata = { title: "Certificates" };

type Signer = Awaited<ReturnType<typeof getDefaultSigner>>;

/** The button that opens a valid certificate over the page, with everything it needs to draw and share it. */
function ViewCertificate({
  certificate,
  signer,
  isOwner,
  label,
}: {
  certificate: CertificateRow;
  signer: Signer;
  isOwner: boolean;
  label?: string;
}) {
  if (!certificate.issuedAt) return null;
  return (
    <CertificateLightbox
      data={certificateDisplay({ ...certificate, issuedAt: certificate.issuedAt }, certificate.decidedBy ? null : signer)}
      title={certificateTitle(certificate.programme)}
      reference={certificate.reference}
      isOwner={isOwner}
      issuedAt={certificate.issuedAt.toISOString()}
      triggerLabel={label}
    />
  );
}

function CertificateCard({ certificate, signer }: { certificate: CertificateRow; signer: Signer }) {
  const state = certificateState(certificate);
  const title = certificateTitle(certificate.programme);

  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-3 p-5">
        <span className="bg-accent-soft text-accent flex size-11 shrink-0 items-center justify-center rounded-lg">
          <RiMedalLine size={24} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-primary block text-para font-semibold">{title}</span>
          <span className="text-muted block text-caption">
            {state === "valid" || state === "revoked"
              ? `Issued ${formatDay(certificate.issuedAt)}`
              : `Put forward ${relativeDays(certificate.requestedAt)}`}
          </span>
        </span>
        <Badge tone={certificateStateTones[state]}>{certificateStateLabels[state]}</Badge>
      </div>

      <div className="border-line flex-1 border-t px-5 py-4">
        {state === "pending" ? (
          <p className="text-secondary text-body">
            An admin is reviewing your work. If it was satisfactory, your certificate is issued here
            and you are notified.
          </p>
        ) : null}
        {state === "declined" ? (
          <>
            <p className="text-secondary text-body">This one was not approved.</p>
            {certificate.decisionNote ? (
              <p className="text-muted mt-1 text-caption">
                {certificate.decidedBy ? `${certificate.decidedBy}: ` : ""}“{certificate.decisionNote}”
              </p>
            ) : null}
          </>
        ) : null}
        {state === "valid" || state === "revoked" ? (
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Issued to</dt>
              <dd className="text-primary mt-0.5 text-body">{certificate.person}</dd>
            </div>
            <div>
              <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Reference</dt>
              <dd className="text-primary mt-0.5 text-body">{certificate.reference}</dd>
            </div>
          </dl>
        ) : null}
        {state === "revoked" ? (
          <p className="text-error-text mt-3 text-caption">
            This certificate has been revoked, so it no longer verifies.
          </p>
        ) : null}
      </div>

      {state === "valid" ? (
        <div className="border-line flex flex-wrap items-center gap-2 border-t px-5 py-3">
          <ViewCertificate certificate={certificate} signer={signer} isOwner />
          <VerifyActions reference={certificate.reference} />
        </div>
      ) : null}
    </Card>
  );
}

export default async function CertificatesPage() {
  const user = await requireUser();
  const isAdmin = atLeast(user.viewRole, "hr");
  const isManager = atLeast(user.viewRole, "manager");

  /** Certificates that have fallen due (an internship ended, a programme finished) become requests here. */
  if (atLeast(user.role, "hr")) await ensureDueCertificateRequests();

  const [certificates, account, signer] = await Promise.all([
    getCertificatesVisibleTo({ id: user.id, role: user.viewRole }),
    getUserById(user.id),
    getDefaultSigner(),
  ]);

  const mine = certificates.filter((row) => row.userId === user.id);
  const others = certificates.filter((row) => row.userId !== user.id);
  const pending = others.filter((row) => row.status === "pending");

  const approvalIds = isAdmin ? await getApprovalIdsForCertificates(pending.map((row) => row.id)) : new Map<string, string>();
  const evidence = isAdmin
    ? new Map(await Promise.all(pending.map(async (row) => [row.id, await getCertificateEvidence(row.userId)] as const)))
    : new Map<string, CertificateEvidence>();

  /** Who the dialog can name: admins anyone else, managers their own reports. */
  const [programmes, candidates] = isManager
    ? await Promise.all([
        getProgrammes(),
        isAdmin
          ? getPeople().then((people) => people.filter((person) => person.id !== user.id && person.status !== "alumni"))
          : getDirectReports(user.id),
      ])
    : [[], []];

  const today = new Date().toISOString().slice(0, 10);
  const intern =
    account?.employmentType === "internship" && account.startDate
      ? internshipWindow({ startDate: account.startDate, endDate: account.endDate }, today)
      : null;
  const hasInternshipCertificate = mine.some(
    (row) => !row.programmeId && (row.status === "pending" || (row.status === "issued" && !row.revokedAt)),
  );

  return (
    <>
      <PageHeader
        pretitle="Learning"
        title="Certificates"
        actions={
          isManager ? (
            <SubmitCertificateButton
              isAdmin={isAdmin}
              programmes={programmes.map((programme) => ({ id: programme.id, name: programme.name }))}
              people={candidates.map((person) => ({
                id: person.id,
                name: person.name,
                hint: employmentLabels[person.employmentType as EmploymentType],
              }))}
            />
          ) : null
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        {isAdmin
          ? "Your learning and internship certificates, and the ones your team has earned. Managers put people forward at the end of a programme; you approve a certificate once their work was satisfactory."
          : isManager
            ? "Your own certificates, and the ones for people who report to you. Put someone forward when their programme ends and an admin reviews their work."
            : "Your learning and internship certificates live here. When a programme ends, an admin reviews your work and, if it was satisfactory, issues your certificate."}
      </p>

      {intern && !hasInternshipCertificate ? (
        <Card className="bg-accent-soft border-transparent">
          <div className="flex flex-col gap-1 p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Your internship</p>
            <p className="text-primary text-para font-semibold">
              {intern.status === "completed"
                ? "Your internship has finished. Your certificate is waiting to be put forward."
                : intern.status === "upcoming"
                  ? `Starts ${formatDay(intern.start)}`
                  : `${intern.daysLeft} day${intern.daysLeft === 1 ? "" : "s"} left · ends ${formatDay(intern.end)}`}
            </p>
            <p className="text-secondary text-body">
              Your manager puts you forward at the end, and an admin approves the certificate if your work
              was satisfactory. Your KPI scores, weekly reviews and attendance are what they look at.
            </p>
          </div>
        </Card>
      ) : null}

      <section aria-labelledby="mine">
        <h2 id="mine" className="text-primary mb-3 text-para font-semibold">
          {isManager ? "My certificates" : "Your certificates"}
        </h2>
        {mine.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <span className="bg-accent-soft text-accent flex size-11 items-center justify-center rounded-full">
                <RiMedalLine size={22} aria-hidden />
              </span>
              <p className="text-primary text-body font-semibold">No certificates yet</p>
              <p className="text-muted max-w-100 text-body">
                Your internship or programme certificate appears here once an admin approves it.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mine.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} signer={signer} />
            ))}
          </div>
        )}
      </section>

      {isAdmin ? (
        <Card>
          <CardHeader
            title="Waiting for approval"
            action={<Badge tone={pending.length > 0 ? "warning" : "success"}>{pending.length}</Badge>}
          />
          {pending.length === 0 ? (
            <p className="text-muted px-5 py-8 text-center text-body">Nothing to approve.</p>
          ) : (
            <ul>
              {pending.map((row) => (
                <li key={row.id} className="border-line flex flex-wrap items-start gap-4 border-b px-5 py-4 last:border-b-0">
                  <Avatar name={row.person ?? "?"} size="lg" />
                  <span className="min-w-60 flex-1">
                    <span className="text-primary block text-body font-semibold">
                      {row.person} · {certificateTitle(row.programme)}
                    </span>
                    <span className="text-muted block text-caption">
                      {row.requestedBy ? `Put forward by ${row.requestedBy}` : "Requested automatically"} · {relativeDays(row.requestedAt)}
                    </span>
                    {row.requestNote ? (
                      <span className="text-secondary mt-1 block text-body">“{row.requestNote}”</span>
                    ) : null}
                    <span className="text-muted mt-1 block text-caption">
                      {evidence.get(row.id) ? evidenceLine(evidence.get(row.id)!) : ""}
                    </span>
                  </span>
                  <span className="flex gap-2">
                    <DeclineCertificateButton certificateId={row.id} name={row.person ?? "this person"} />
                    <ApproveCertificateButton certificateId={row.id} name={row.person ?? "this person"} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {approvalIds.size > 0 ? (
            <p className="text-muted border-line border-t px-5 py-3 text-caption">
              These also appear in your Approvals queue, where you can approve them without a reason.
            </p>
          ) : null}
        </Card>
      ) : null}

      {isManager ? (
        <Card>
          <CardHeader
            title={isAdmin ? "All certificates" : "My team"}
            action={<Badge>{others.filter((row) => !isAdmin || row.status !== "pending").length}</Badge>}
          />
          {others.length === 0 ? (
            <p className="text-muted px-5 py-8 text-center text-body">
              {isAdmin ? "No certificates have been requested yet." : "No one on your team has a certificate yet. Put someone forward when their programme ends."}
            </p>
          ) : (
            <Table>
              <Thead columns={["Person", "Certificate", "Reference", isAdmin ? "Date" : "Updated", "Status", ""]} />
              <tbody>
                {others
                  .filter((row) => !isAdmin || row.status !== "pending")
                  .map((row) => {
                    const state = certificateState(row);
                    return (
                      <Tr key={row.id}>
                        <Td>
                          <span className="flex items-center gap-2.5">
                            <Avatar name={row.person ?? "?"} />
                            <span>
                              <span className="text-primary block font-semibold">{row.person}</span>
                              <span className="text-muted block text-tiny">
                                {employmentLabels[row.employmentType as EmploymentType]}
                              </span>
                            </span>
                          </span>
                        </Td>
                        <Td>{certificateTitle(row.programme)}</Td>
                        <Td className="text-muted whitespace-nowrap">{row.reference}</Td>
                        <Td className="whitespace-nowrap">{formatDay(row.issuedAt ?? row.decidedAt ?? row.requestedAt)}</Td>
                        <Td>
                          <Badge tone={certificateStateTones[state]}>{certificateStateLabels[state]}</Badge>
                          {state === "declined" && row.decisionNote ? (
                            <span className="text-muted mt-1 block max-w-60 text-tiny">{row.decisionNote}</span>
                          ) : null}
                        </Td>
                        <Td>
                          <span className="flex items-center justify-end gap-2">
                            {state === "valid" ? (
                              <ViewCertificate certificate={row} signer={signer} isOwner={false} label="View" />
                            ) : null}
                            {state === "valid" ? <VerifyActions reference={row.reference} /> : null}
                            {isAdmin && (state === "valid" || state === "revoked") ? (
                              <RevokeCertificateButton
                                certificateId={row.id}
                                revoked={state === "revoked"}
                                name={row.person ?? "this person"}
                              />
                            ) : null}
                          </span>
                        </Td>
                      </Tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </Card>
      ) : null}
    </>
  );
}
