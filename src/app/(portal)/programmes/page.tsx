import { RiAddLine, RiAwardLine, RiCheckLine, RiDownloadLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { certificates, programmeStages, programmes } from "@/lib/mock-data";

const assignments = [
  { id: "as1", title: "Week 1 — Design principles", due: "5 Sep", grade: "4.5 / 5", status: "Graded" as const },
  { id: "as2", title: "Week 2 — Component audit", due: "12 Sep", grade: "4.0 / 5", status: "Graded" as const },
  { id: "as3", title: "Week 3 — Token system", due: "19 Sep", grade: "4.2 / 5", status: "Graded" as const },
  { id: "as4", title: "Week 4 — Dashboard concept", due: "3 Oct", grade: "—", status: "Submitted" as const },
  { id: "as5", title: "Mid-programme review", due: "15 Oct", grade: "—", status: "Not started" as const },
];

export default function ProgrammesPage() {
  const completed = programmeStages.filter((stage) => stage.done).length;

  return (
    <>
      <PageHeader
        pretitle="Learning"
        title="Programmes"
        actions={
          <>
            <Button variant="secondary">
              <RiDownloadLine size={18} aria-hidden />
              Export progress
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New cohort
            </Button>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Design Internship — Cohort 4"
            action={<Badge tone="accent">Mid-programme</Badge>}
          />
          <div className="p-5">
            <p className="text-secondary mb-2 flex items-center justify-between text-body">
              <span>Overall progress</span>
              <span className="text-primary font-semibold">64%</span>
            </p>
            <Progress value={64} label="Cohort progress" />

            <ol className="mt-6 flex flex-col gap-3">
              {programmeStages.map((stage, index) => (
                <li key={stage.name} className="flex items-center gap-3">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-tiny font-semibold ${
                      stage.done
                        ? "bg-success-surface text-success-text"
                        : "bg-raised text-muted"
                    }`}
                  >
                    {stage.done ? <RiCheckLine size={16} aria-hidden /> : index + 1}
                  </span>
                  <span
                    className={
                      stage.done ? "text-muted text-body" : "text-primary text-body font-semibold"
                    }
                  >
                    {stage.name}
                  </span>
                  {!stage.done && index === completed ? (
                    <Badge tone="warning">Current</Badge>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <Card>
          <CardHeader title="All cohorts" />
          <ul>
            {programmes.map((programme) => (
              <li key={programme.id} className="border-line border-b px-5 py-3 last:border-b-0">
                <p className="text-primary truncate text-body font-semibold">{programme.name}</p>
                <p className="text-muted mt-0.5 mb-2 text-tiny">
                  {programme.members} members · {programme.stage} · ends {programme.ends}
                </p>
                <Progress value={programme.progress} label={`${programme.name} progress`} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Assignments" action={<Badge>5 total</Badge>} />
          <Table>
            <Thead columns={["Assignment", "Due", "Grade", "Status"]} />
            <tbody>
              {assignments.map((assignment) => (
                <Tr key={assignment.id}>
                  <Td className="text-primary font-semibold">{assignment.title}</Td>
                  <Td className="whitespace-nowrap">{assignment.due}</Td>
                  <Td>{assignment.grade}</Td>
                  <Td>
                    <Badge
                      tone={
                        assignment.status === "Graded"
                          ? "success"
                          : assignment.status === "Submitted"
                            ? "accent"
                            : "neutral"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Certificates"
            action={<Badge tone="success">Auto-issued</Badge>}
          />
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
                    {certificate.programme}
                  </span>
                  <span className="text-muted block text-tiny">
                    {certificate.ref} · {certificate.issued}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted border-line border-t px-5 py-3 text-caption">
            Certificates are generated when a cohort ends and emailed automatically.
          </p>
        </Card>
      </section>
    </>
  );
}
