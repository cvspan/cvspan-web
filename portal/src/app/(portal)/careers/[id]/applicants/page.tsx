import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiDownload2Line, RiExternalLinkLine, RiMailLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { ApplicationStageSelect } from "@/components/forms/application-forms";
import { JobStageSelect } from "@/components/forms/website-forms";
import { getApplicationsFor, getJobById } from "@/db/queries";
import { applicationStages } from "@/lib/applications";
import { applicationStageLabels, formatDay, relativeDays } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { withBasePath } from "@/lib/base-path";
import { websiteJobUrl } from "@/lib/website";

export const metadata = { title: "Applicants · CVSpan Portal" };

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  if (!atLeast(user.viewRole, "hr")) notFound();

  const job = await getJobById(id);
  if (!job) notFound();

  const people = await getApplicationsFor(id);

  return (
    <>
      <Link href="/careers" className="text-muted hover:text-primary flex items-center gap-1 text-caption">
        <RiArrowLeftLine size={14} aria-hidden />
        Careers
      </Link>

      <PageHeader
        pretitle="Applicants"
        title={job.title}
        actions={
          <>
            <JobStageSelect jobId={job.id} stage={job.stage} title={job.title} />
            {job.stage === "open" ? (
              <a href={websiteJobUrl(job.slug)} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" type="button">
                  <RiExternalLinkLine size={18} aria-hidden />
                  View on website
                </Button>
              </a>
            ) : null}
            <Link href={`/careers/${id}`}>
              <Button variant="secondary" type="button">
                Edit listing
              </Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {applicationStages.map((stage) => (
          <Card key={stage} className="p-4">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {applicationStageLabels[stage]}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">
              {people.filter((person) => person.stage === stage).length}
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Candidates" action={<Badge>{people.length} total</Badge>} />
        {people.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            No applications yet. They appear here as soon as someone applies from the careers page
            on the website.
          </p>
        ) : (
          <Table>
            <Thead columns={["Candidate", "Applied", "Resume", "Message", "Stage"]} />
            <tbody>
              {people.map((person) => (
                <Tr key={person.id}>
                  <Td className="whitespace-nowrap">
                    <span className="text-primary block font-semibold">{person.candidateName}</span>
                    <a
                      href={`mailto:${person.candidateEmail}`}
                      className="text-accent flex items-center gap-1 text-tiny"
                    >
                      <RiMailLine size={12} aria-hidden />
                      {person.candidateEmail}
                    </a>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {formatDay(person.createdAt)}
                    <span className="text-muted block text-tiny">{relativeDays(person.createdAt)}</span>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {person.resumeName ? (
                      <a
                        href={withBasePath(`/api/applications/${person.id}/resume`)}
                        download
                        className="text-accent flex items-center gap-1 text-caption font-semibold"
                      >
                        <RiDownload2Line size={14} aria-hidden />
                        Download
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </Td>
                  <Td className="max-w-96">
                    <span className="line-clamp-3 whitespace-pre-line">{person.notes ?? "—"}</span>
                  </Td>
                  <Td>
                    <ApplicationStageSelect
                      applicationId={person.id}
                      stage={person.stage}
                      name={person.candidateName}
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
