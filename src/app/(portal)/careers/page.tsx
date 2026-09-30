import Link from "next/link";
import { RiAddLine, RiExternalLinkLine, RiMapPinLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { JobStageActions } from "@/components/forms/website-forms";
import { getDepartmentSummary, getHiringPipeline, getJobListings } from "@/db/queries";
import {
  applicationStageLabels,
  employmentLabels,
  formatDay,
  formatSalary,
  jobStageLabels,
  relativeDays,
  seniorityLabels,
  workModeLabels,
} from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function CareersPage() {
  const user = await requireUser();
  const [jobs, pipeline, departments] = await Promise.all([
    getJobListings(),
    getHiringPipeline(),
    getDepartmentSummary(),
  ]);

  const canManage = atLeast(user.role, "admin");
  const pipelineMax = Math.max(...pipeline.map((stage) => stage.count), 1);

  const counts = [
    { label: "Open roles", value: jobs.filter((job) => job.stage === "open").length },
    {
      label: "In interview",
      value: jobs.filter((job) => job.stage === "interviewing" || job.stage === "screening").length,
    },
    { label: "Drafts", value: jobs.filter((job) => job.stage === "draft").length },
    { label: "Applicants", value: jobs.reduce((sum, job) => sum + job.applicants, 0) },
  ];

  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Careers"
        actions={
          <>
            <a href="https://cvspan.com/careers" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" type="button">
                <RiExternalLinkLine size={18} aria-hidden />
                View careers page
              </Button>
            </a>
            {canManage ? (
              <Link href="/careers/new">
                <Button type="button">
                  <RiAddLine size={18} aria-hidden />
                  New listing
                </Button>
              </Link>
            ) : null}
          </>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Listings published here appear on the CVSpan website careers page. Hiring someone from the
        pipeline creates their portal account with the right department and employment type.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Pipeline" />
          <ul className="p-5 pt-4">
            {pipeline.map((stage) => (
              <li key={stage.stage} className="flex items-center gap-3 py-1.5">
                <span className="text-secondary w-22 shrink-0 text-body">
                  {applicationStageLabels[stage.stage]}
                </span>
                <span className="bg-raised h-6 flex-1 overflow-hidden rounded-md">
                  <span
                    className="bg-brand block h-full rounded-md"
                    style={{ width: `${(stage.count / pipelineMax) * 100}%` }}
                  />
                </span>
                <span className="text-primary w-6 text-right text-caption font-semibold">
                  {stage.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Departments hiring" />
          <Table>
            <Thead columns={["Department", "Headcount", "Open roles"]} />
            <tbody>
              {departments.map((department) => (
                <Tr key={department.name}>
                  <Td className="text-primary font-semibold">{department.name}</Td>
                  <Td>{department.headcount}</Td>
                  <Td>
                    {department.openRoles > 0 ? (
                      <Badge tone="accent">{department.openRoles} open</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>

      <Card>
        <CardHeader title="Job listings" action={<Badge>{jobs.length} listings</Badge>} />

        {jobs.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            No listings yet. Open the first role.
          </p>
        ) : (
          <Table>
            <Thead
              columns={["Role", "Type", "Salary", "Applicants", "Closes", "Status", ""]}
            />
            <tbody>
              {jobs.map((job) => {
                const salary = job.salaryMin || job.salaryMax
                  ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)
                  : null;

                return (
                  <Tr key={job.id}>
                    <Td className="max-w-80">
                      <Link
                        href={`/careers/${job.id}`}
                        className="text-primary hover:text-accent block truncate font-semibold"
                      >
                        {job.title}
                        {job.openings > 1 ? (
                          <span className="text-muted font-normal"> · {job.openings} openings</span>
                        ) : null}
                      </Link>
                      <span className="text-muted flex items-center gap-1 truncate text-tiny">
                        {job.department ?? "No department"}
                        {job.location ? (
                          <>
                            <RiMapPinLine size={11} aria-hidden />
                            {job.location}
                          </>
                        ) : null}
                        · {workModeLabels[job.workMode]}
                      </span>
                    </Td>

                    <Td className="whitespace-nowrap">
                      <Badge>{employmentLabels[job.employmentType]}</Badge>
                      <span className="text-muted mt-1 block text-tiny">
                        {seniorityLabels[job.seniority]}
                      </span>
                    </Td>

                    <Td className="whitespace-nowrap">
                      {salary ? (
                        <>
                          {salary}
                          {!job.salaryPublic ? (
                            <span className="text-muted block text-tiny">Internal only</span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Td>

                    <Td>{job.applicants}</Td>

                    <Td className="whitespace-nowrap">
                      {job.closingDate ? (
                        <>
                          {formatDay(job.closingDate)}
                          <span className="text-muted block text-tiny">
                            {relativeDays(job.closingDate)}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted">Open ended</span>
                      )}
                    </Td>

                    <Td>
                      <Badge tone={statusTone(job.stage)}>{jobStageLabels[job.stage]}</Badge>
                    </Td>

                    <Td className="whitespace-nowrap">
                      <span className="flex justify-end">
                        {canManage ? <JobStageActions jobId={job.id} stage={job.stage} /> : null}
                      </span>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
