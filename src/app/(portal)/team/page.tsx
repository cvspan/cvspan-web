import { RiAddLine, RiMailLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { teamMembers } from "@/lib/mock-data";

export default function TeamPage() {
  return (
    <>
      <PageHeader
        pretitle="Manage"
        title="My team"
        actions={
          <>
            <Button variant="secondary">
              <RiMailLine size={18} aria-hidden />
              Message team
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              Assign task
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader title="Members" action={<Badge>{teamMembers.length} people</Badge>} />
        <Table>
          <Thead
            columns={["Member", "Type", "KPI score", "Attendance", "Open tasks", "This cycle", ""]}
          />
          <tbody>
            {teamMembers.map((member) => (
              <Tr key={member.id}>
                <Td>
                  <span className="flex items-center gap-2.5">
                    <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                      {member.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block truncate font-semibold">
                        {member.name}
                      </span>
                      <span className="text-muted block truncate text-tiny">
                        {member.jobTitle} · started {member.started}
                      </span>
                    </span>
                  </span>
                </Td>
                <Td>
                  <Badge>{member.employmentType}</Badge>
                </Td>
                <Td className="w-40">
                  <span className="text-primary mb-1 block text-caption font-semibold">
                    {member.kpi}%
                  </span>
                  <Progress
                    value={member.kpi}
                    tone={member.kpi >= 80 ? "success" : "brand"}
                    label={`${member.name} KPI score`}
                  />
                </Td>
                <Td>
                  <Badge tone={member.attendance >= 90 ? "success" : "warning"}>
                    {member.attendance}%
                  </Badge>
                </Td>
                <Td>{member.openTasks}</Td>
                <Td>
                  {member.graded ? (
                    <Badge tone="success">Graded</Badge>
                  ) : (
                    <Badge tone="warning">Pending</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap">
                  <span className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Profile
                    </Button>
                    <Button size="sm">{member.graded ? "Regrade" : "Grade"}</Button>
                  </span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
