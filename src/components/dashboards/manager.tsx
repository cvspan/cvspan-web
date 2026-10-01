import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { KpiBars } from "@/components/portal/kpi-bars";
import { MyLatestReview, ReviewsDue } from "@/components/reviews/snapshots";
import { ApprovalButtons } from "@/components/forms/approval-buttons";
import { GradeButton } from "@/components/forms/grade-dialog";
import { NewTaskButton } from "@/components/forms/task-forms";
import {
  getApprovalsFor,
  getDirectReports,
  getKpiTrend,
  getLatestKpi,
  getTasksForTeam,
  getTeamKpiAverage,
} from "@/db/queries";
import { employmentLabels, formatMonth, initials, relativeDays } from "@/lib/format";
import { taskTone } from "@/lib/tone";

export async function ManagerDashboard({
  user,
}: {
  user: { id: string; name: string };
}) {
  const [reports, approvals, teamTasks, average, trend] = await Promise.all([
    getDirectReports(user.id),
    getApprovalsFor(user.id),
    getTasksForTeam(user.id),
    getTeamKpiAverage(user.id),
    getKpiTrend(user.id),
  ]);

  const scores = await Promise.all(
    reports.map(async (report) => ({
      report,
      kpi: (await getLatestKpi(report.id))?.score ?? 0,
      openTasks: teamTasks.filter(
        (task) => task.assigneeId === report.id && task.status !== "done",
      ).length,
    })),
  );

  const overdue = teamTasks.filter(
    (task) => task.status !== "done" && task.dueAt && new Date(task.dueAt) < new Date(),
  );
  const ungraded = scores.filter((row) => row.kpi === 0);

  return (
    <>
      <PageHeader
        pretitle="Manage"
        title="Team dashboard"
        actions={
          <>
            <Link href="/team">
              <Button variant="secondary">Open team page</Button>
            </Link>
            <NewTaskButton
              people={[{ id: user.id, name: `${user.name} (me)` }, ...reports]}
              defaultAssigneeId={reports[0]?.id ?? user.id}
              label="Assign task"
            />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Team size", value: String(reports.length), caption: "direct reports" },
          { label: "Team KPI average", value: `${average}%`, caption: "latest cycle" },
          {
            label: "Open tasks",
            value: String(teamTasks.filter((task) => task.status !== "done").length),
            caption: `${overdue.length} overdue`,
          },
          {
            label: "Waiting on you",
            value: String(approvals.length),
            caption: "approvals queued",
          },
        ].map((tile) => (
          <Card key={tile.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {tile.label}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{tile.value}</p>
            <p className="text-muted mt-1 text-caption">{tile.caption}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ReviewsDue userId={user.id} />
        <div className="md:col-span-1 xl:col-span-2">
          <MyLatestReview userId={user.id} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="My team"
            action={
              <Link href="/team">
                <Button variant="ghost" size="sm">
                  Open team page
                  <RiArrowRightSLine size={16} aria-hidden />
                </Button>
              </Link>
            }
          />
          <Table>
            <Thead columns={["Member", "Type", "KPI", "Open tasks", "This cycle"]} />
            <tbody>
              {scores.map(({ report, kpi, openTasks }) => (
                <Tr key={report.id}>
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                        {initials(report.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="text-primary block truncate font-semibold">
                          {report.name}
                        </span>
                        <span className="text-muted block truncate text-tiny">
                          {report.jobTitle}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <Badge>{employmentLabels[report.employmentType]}</Badge>
                  </Td>
                  <Td className="w-40">
                    <span className="text-primary mb-1 block text-caption font-semibold">
                      {kpi > 0 ? `${kpi}%` : "Not graded"}
                    </span>
                    <Progress value={kpi} label={`${report.name} KPI score`} />
                  </Td>
                  <Td>{openTasks}</Td>
                  <Td>
                    <GradeButton userId={report.id} name={report.name} currentScore={kpi} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader
            title="Waiting on you"
            action={<Badge tone={approvals.length > 0 ? "warning" : "success"}>{approvals.length}</Badge>}
          />
          <ul>
            {approvals.length === 0 ? (
              <li className="text-muted px-5 py-4 text-body">Nothing to approve.</li>
            ) : (
              approvals.map((item) => (
                <li
                  key={item.id}
                  className="border-line flex items-start gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                    {initials(item.requestedBy ?? "??")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block text-body font-semibold capitalize">
                      {item.kind.replace("_", " ")}
                    </span>
                    <span className="text-muted block truncate text-tiny">
                      {item.requestedBy} · {item.detail}
                    </span>
                  </span>
                  <ApprovalButtons
                    approvalId={item.id}
                    label={`${item.kind.replace("_", " ")} from ${item.requestedBy}`}
                    compact
                  />
                </li>
              ))
            )}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Team tasks at risk" action={<Badge tone="error">{overdue.length}</Badge>} />
          <ul>
            {overdue.length === 0 ? (
              <li className="text-muted px-5 py-4 text-body">Nothing overdue.</li>
            ) : (
              overdue.map((task) => (
                <li
                  key={task.id}
                  className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block truncate text-body font-semibold">
                      {task.title}
                    </span>
                    <span className="text-muted block text-tiny">
                      {task.assigneeName} · due {relativeDays(task.dueAt)}
                    </span>
                  </span>
                  <Badge tone={taskTone(task.status, task.dueAt)}>Overdue</Badge>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Your own KPI trend" />
          {trend.length > 0 ? (
            <KpiBars
              data={trend.map((point) => ({
                month: formatMonth(point.periodStart),
                score: point.score,
              }))}
            />
          ) : (
            <p className="text-muted px-5 py-6 text-body">No scores recorded yet.</p>
          )}
          {ungraded.length > 0 ? (
            <p className="text-muted border-line border-t px-5 py-3 text-caption">
              {ungraded.length} team member{ungraded.length === 1 ? "" : "s"} still need grading
              this cycle.
            </p>
          ) : null}
        </Card>
      </section>
    </>
  );
}
