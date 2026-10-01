import Link from "next/link";
import { RiAwardLine, RiDownloadLine, RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getAssignmentsFor, getCertificates, getProgrammes } from "@/db/queries";
import { formatDay, relativeDays } from "@/lib/format";
import { NewCohortButton } from "@/components/forms/programme-forms";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

const submissionLabels = {
  not_started: "Not started",
  submitted: "Submitted",
  graded: "Graded",
} as const;

export default async function ProgrammesPage() {
  const user = await requireUser();
  const [programmes, assignments, certificates] = await Promise.all([
    getProgrammes(),
    getAssignmentsFor(user.id),
    getCertificates(),
  ]);

  const done = assignments.filter((row) => row.status !== "not_started").length;
  const progress = assignments.length ? Math.round((done / assignments.length) * 100) : 0;

  return (
    <>
      <PageHeader
        pretitle="Learning"
        title="Programmes"
        actions={
          <>
            {atLeast(user.viewRole, "manager") ? (
              <a href="/api/export/programmes" download>
                <Button variant="secondary" type="button">
                  <RiDownloadLine size={18} aria-hidden />
                  Export progress
                </Button>
              </a>
            ) : null}
            {atLeast(user.viewRole, "admin") ? <NewCohortButton /> : null}
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="My assignments"
            action={<Badge tone={progress === 100 ? "success" : "accent"}>{progress}% done</Badge>}
          />
          {assignments.length === 0 ? (
            <p className="text-muted px-5 py-8 text-center text-body">
              You are not enrolled on a programme. Cohort members see their assignments here.
            </p>
          ) : (
            <Table>
              <Thead columns={["Assignment", "Due", "Grade", "Status"]} />
              <tbody>
                {assignments.map((assignment) => (
                  <Tr key={assignment.id}>
                    <Td className="text-primary font-semibold">{assignment.title}</Td>
                    <Td className="whitespace-nowrap">
                      {formatDay(assignment.dueAt)}
                      <span className="text-muted block text-tiny">
                        {relativeDays(assignment.dueAt)}
                      </span>
                    </Td>
                    <Td>{assignment.grade ? `${assignment.grade}%` : "—"}</Td>
                    <Td>
                      <Badge tone={statusTone(assignment.status)}>
                        {submissionLabels[assignment.status]}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader title="All cohorts" action={<Badge>{programmes.length}</Badge>} />
          <ul>
            {programmes.map((programme) => (
              <li key={programme.id} className="border-line border-b px-5 py-3 last:border-b-0">
                <p className="text-primary truncate text-body font-semibold">{programme.name}</p>
                <p className="text-muted mt-0.5 mb-2 text-tiny">
                  {programme.members} member{programme.members === 1 ? "" : "s"} ·{" "}
                  {programme.stage} · ends {programme.endDate ?? "—"}
                </p>
                <Progress value={programme.progress} label={`${programme.name} progress`} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="Certificates"
          action={<Badge>{certificates.length} issued</Badge>}
        />
        {certificates.length === 0 ? (
          <p className="text-muted px-5 py-6 text-body">No certificates issued yet.</p>
        ) : (
          <ul>
            {certificates.map((certificate) => (
              <li
                key={certificate.id}
                className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <RiAwardLine size={20} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">
                    {certificate.person}
                  </span>
                  <span className="text-muted block truncate text-tiny">
                    {certificate.programme} · {certificate.reference} ·{" "}
                    {formatDay(certificate.issuedAt)}
                  </span>
                </span>
                <Link href={`/verify/${certificate.reference}`} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="secondary" type="button">
                    Verify
                    <RiExternalLinkLine size={14} aria-hidden />
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-muted border-line border-t px-5 py-3 text-caption">
          Each certificate has a public verification page that anyone can open with its reference.
        </p>
      </Card>
    </>
  );
}
