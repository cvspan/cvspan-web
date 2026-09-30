import { RiAddLine, RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { departments, hiringPipeline, jobListings, type Tone } from "@/lib/mock-data";

const stageTone: Record<string, Tone> = {
  Interviewing: "accent",
  Screening: "warning",
  Applied: "neutral",
  Draft: "neutral",
};

export default function CareersPage() {
  const pipelineMax = Math.max(...hiringPipeline.map((stage) => stage.count));

  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Careers"
        actions={
          <>
            <Button variant="secondary">
              <RiExternalLinkLine size={18} aria-hidden />
              View careers page
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New listing
            </Button>
          </>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Listings published here appear on the CVSpan website careers page. Hiring someone from the
        pipeline creates their portal account with the right department and employment type.
      </p>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Pipeline" />
          <ul className="p-5 pt-4">
            {hiringPipeline.map((stage) => (
              <li key={stage.stage} className="flex items-center gap-3 py-1.5">
                <span className="text-secondary w-22 shrink-0 text-body">{stage.stage}</span>
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
            <Thead columns={["Department", "Head", "Headcount", "Open roles"]} />
            <tbody>
              {departments.map((department) => (
                <Tr key={department.name}>
                  <Td className="text-primary font-semibold">{department.name}</Td>
                  <Td>{department.head}</Td>
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
        <CardHeader title="Job listings" action={<Badge>{jobListings.length} listings</Badge>} />
        <Table>
          <Thead
            columns={["Role", "Department", "Type", "Applicants", "Stage", "Posted", ""]}
          />
          <tbody>
            {jobListings.map((job) => (
              <Tr key={job.id}>
                <Td className="text-primary font-semibold">{job.title}</Td>
                <Td>{job.department}</Td>
                <Td>
                  <Badge>{job.type}</Badge>
                </Td>
                <Td>{job.applicants}</Td>
                <Td>
                  <Badge tone={stageTone[job.stage]}>{job.stage}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{job.posted}</Td>
                <Td>
                  <Button size="sm" variant="secondary">
                    Open
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
