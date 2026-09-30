import Link from "next/link";
import { RiMailLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { GradeButton } from "@/components/forms/grade-dialog";
import { NewTaskButton } from "@/components/forms/task-forms";
import { messageMyTeam } from "@/app/actions/messages";
import { getAttendanceRate, getDirectReports, getLatestKpi, getTasksForTeam } from "@/db/queries";
import { employmentLabels, initials } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function TeamPage() {
  const user = await requireUser();
  const [reports, teamTasks] = await Promise.all([
    getDirectReports(user.id),
    getTasksForTeam(user.id),
  ]);

  const rows = await Promise.all(
    reports.map(async (report) => ({
      ...report,
      kpi: (await getLatestKpi(report.id))?.score ?? 0,
      attendance: await getAttendanceRate(report.id),
      openTasks: teamTasks.filter(
        (task) => task.assigneeId === report.id && task.status !== "done",
      ).length,
    })),
  );

  const assignable = [{ id: user.id, name: `${user.name} (me)` }, ...reports];

  return (
    <>
      <PageHeader
        pretitle="Manage"
        title="My team"
        actions={
          <>
            <form action={messageMyTeam}>
              <Button type="submit" variant="secondary">
                <RiMailLine size={18} aria-hidden />
                Message team
              </Button>
            </form>
            <NewTaskButton
              people={assignable}
              defaultAssigneeId={reports[0]?.id ?? user.id}
              label="Assign task"
            />
          </>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <p className="text-muted px-5 py-8 text-center text-body">
            No one reports to you yet. An admin can set reporting lines on the People page.
          </p>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Members" action={<Badge>{rows.length} people</Badge>} />
          <Table>
            <Thead
              columns={["Member", "Type", "KPI score", "Attendance", "Open tasks", "Status", ""]}
            />
            <tbody>
              {rows.map((member) => (
                <Tr key={member.id}>
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                        {initials(member.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="text-primary block truncate font-semibold">
                          {member.name}
                        </span>
                        <span className="text-muted block truncate text-tiny">
                          {member.jobTitle} · started {member.startDate ?? "—"}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <Badge>{employmentLabels[member.employmentType]}</Badge>
                  </Td>
                  <Td className="w-40">
                    <span className="text-primary mb-1 block text-caption font-semibold">
                      {member.kpi > 0 ? `${member.kpi}%` : "Not graded"}
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
                    <Badge tone={statusTone(member.status)} className="capitalize">
                      {member.status}
                    </Badge>
                  </Td>
                  <Td className="whitespace-nowrap">
                    <span className="flex gap-2">
                      <Link href={`/people/${member.id}`}>
                        <Button size="sm" variant="secondary">
                          Profile
                        </Button>
                      </Link>
                      <GradeButton
                        userId={member.id}
                        name={member.name}
                        currentScore={member.kpi}
                      />
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
}
