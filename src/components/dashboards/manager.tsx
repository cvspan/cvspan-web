import { RiAddLine, RiArrowRightSLine, RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { SparkStat } from "@/components/ui/stat-card";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { KpiBars } from "@/components/portal/kpi-bars";
import {
  approvals,
  barAssignments,
  kpiTrend,
  sparkAttendance,
  sparkTaskCompletion,
  tasks,
  teamMembers,
} from "@/lib/mock-data";

export function ManagerDashboard() {
  const ungraded = teamMembers.filter((member) => !member.graded).length;
  const overdue = tasks.filter((task) => task.status === "Overdue").length;

  return (
    <>
      <PageHeader
        pretitle="Design team"
        title="Team dashboard"
        actions={
          <>
            <Button variant="secondary">Start grading</Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              Assign task
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SparkStat
          label="Team KPI average"
          value="81%"
          delta="+3%"
          tone="success"
          spark={kpiTrend.map((point) => point.score)}
          kind="line"
          period="Last 6 months"
        />
        <SparkStat
          label="Tasks completed"
          value="34"
          delta="+12%"
          tone="success"
          spark={sparkTaskCompletion}
          kind="line"
        />
        <SparkStat
          label="Team attendance"
          value="92%"
          delta="-1%"
          tone="error"
          spark={sparkAttendance}
          kind="line"
        />
        <SparkStat
          label="Grading submitted"
          value={`${teamMembers.length - ungraded}/${teamMembers.length}`}
          delta={ungraded > 0 ? `${ungraded} left` : "Complete"}
          tone={ungraded > 0 ? "warning" : "success"}
          spark={barAssignments}
          kind="bar"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="My team"
            action={
              <Button variant="ghost" size="sm">
                Open team page
                <RiArrowRightSLine size={16} aria-hidden />
              </Button>
            }
          />
          <Table>
            <Thead columns={["Member", "Type", "KPI", "Open tasks", "This cycle"]} />
            <tbody>
              {teamMembers.map((member) => (
                <Tr key={member.id}>
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                        {member.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="text-primary block truncate font-semibold">
                          {member.name}
                        </span>
                        <span className="text-muted block truncate text-tiny">
                          {member.jobTitle}
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
                    <Progress value={member.kpi} label={`${member.name} KPI score`} />
                  </Td>
                  <Td>{member.openTasks}</Td>
                  <Td>
                    {member.graded ? (
                      <Badge tone="success">Graded</Badge>
                    ) : (
                      <Button size="sm">Grade</Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Waiting on you"
            action={<Badge tone="warning">{approvals.length}</Badge>}
          />
          <ul>
            {approvals.map((item) => (
              <li
                key={item.id}
                className="border-line flex items-start gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                  {item.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-primary block text-body font-semibold">{item.kind}</span>
                  <span className="text-muted block truncate text-tiny">
                    {item.who} · {item.detail}
                  </span>
                </span>
                <span className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Approve ${item.kind} from ${item.who}`}
                    className="text-success-text hover:bg-success-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                  >
                    <RiCheckLine size={18} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`Decline ${item.kind} from ${item.who}`}
                    className="text-error-text hover:bg-error-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                  >
                    <RiCloseLine size={18} aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Team KPI trend" action={<Badge>Last 6 months</Badge>} />
          <KpiBars data={kpiTrend} />
        </Card>

        <Card>
          <CardHeader title="Attention needed" />
          <ul className="p-5 pt-4">
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Overdue tasks</span>
              <Badge tone={overdue > 0 ? "error" : "success"}>{overdue}</Badge>
            </li>
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Grading not submitted</span>
              <Badge tone={ungraded > 0 ? "warning" : "success"}>{ungraded}</Badge>
            </li>
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Attendance below 85%</span>
              <Badge tone="warning">1</Badge>
            </li>
            <li className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-secondary text-body">Probation reviews due</span>
              <Badge>2</Badge>
            </li>
          </ul>
        </Card>
      </section>
    </>
  );
}
