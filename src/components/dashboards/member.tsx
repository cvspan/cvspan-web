import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gauge, Progress } from "@/components/ui/chart";
import { Delta } from "@/components/ui/delta";
import { PageHeader } from "@/components/ui/page-header";
import { KpiBars } from "@/components/portal/kpi-bars";
import { ClockButton } from "@/components/forms/attendance-forms";
import { NewTaskButton, TaskCheckbox } from "@/components/forms/task-forms";
import {
  getAssignmentsFor,
  getAttendanceFor,
  getAttendanceRate,
  getKpiTrend,
  getNotificationsFor,
  getTasksFor,
} from "@/db/queries";
import { formatMonth, relativeDays, taskStatusLabels } from "@/lib/format";
import { initials } from "@/lib/format";
import type { Tone } from "@/lib/tone";
import { taskTone } from "@/lib/tone";

export async function MemberDashboard({
  user,
}: {
  user: { id: string; name: string };
}) {
  const [tasks, trend, attendanceRate, notifications, assignments, attendance] = await Promise.all([
    getTasksFor(user.id),
    getKpiTrend(user.id),
    getAttendanceRate(user.id),
    getNotificationsFor(user.id, 5),
    getAssignmentsFor(user.id),
    getAttendanceFor(user.id, 1),
  ]);

  const todayEntry = attendance[0];
  const clockedIn = Boolean(
    todayEntry &&
      todayEntry.day === new Date().toISOString().slice(0, 10) &&
      todayEntry.clockIn &&
      !todayEntry.clockOut,
  );

  const open = tasks.filter((task) => task.status !== "done");
  const overdue = open.filter((task) => task.dueAt && new Date(task.dueAt) < new Date());
  const done = tasks.filter((task) => task.status === "done");
  const latestScore = trend.at(-1)?.score ?? 0;
  const previousScore = trend.at(-2)?.score ?? latestScore;
  const graded = assignments.filter((row) => row.status === "graded");
  const averageGrade =
    graded.length > 0
      ? (graded.reduce((sum, row) => sum + (row.grade ?? 0), 0) / graded.length / 20).toFixed(1)
      : "—";
  const programmeProgress =
    assignments.length > 0
      ? Math.round(
          (assignments.filter((row) => row.status !== "not_started").length / assignments.length) *
            100,
        )
      : 0;

  const deadlines = open
    .filter((task) => task.dueAt)
    .slice(0, 4)
    .map((task) => ({
      title: task.title,
      when: relativeDays(task.dueAt),
      tone: (task.dueAt && new Date(task.dueAt) < new Date() ? "error" : "neutral") as Tone,
    }));

  return (
    <>
      <PageHeader
        pretitle="Overview"
        title="Dashboard"
        actions={
          <>
            <ClockButton clockedIn={clockedIn} />
            <NewTaskButton
              people={[{ id: user.id, name: user.name }]}
              defaultAssigneeId={user.id}
            />
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="bg-accent-soft border-transparent xl:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <h2 className="text-primary text-title font-semibold">
                Welcome back, {user.name.split(" ")[0]}
              </h2>
              <p className="text-secondary mt-1 text-body">
                {open.length} open task{open.length === 1 ? "" : "s"}
                {overdue.length > 0 ? `, ${overdue.length} overdue` : ""} ·{" "}
                {notifications.length} recent update{notifications.length === 1 ? "" : "s"}.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                  Tasks completed
                </p>
                <p className="mt-1 mb-2 flex items-center gap-2">
                  <span className="text-primary text-title font-semibold">
                    {done.length}/{tasks.length}
                  </span>
                </p>
                <Progress
                  value={tasks.length ? (done.length / tasks.length) * 100 : 0}
                  tone="success"
                  label="Task completion"
                />
              </div>
              <div>
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                  Programme progress
                </p>
                <p className="mt-1 mb-2 flex items-center gap-2">
                  <span className="text-primary text-title font-semibold">
                    {programmeProgress}%
                  </span>
                </p>
                <Progress value={programmeProgress} label="Programme progress" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              Attendance this period
            </p>
            <p className="mt-2 flex items-center gap-2">
              <span className="text-primary text-h4 font-semibold">{attendanceRate}%</span>
              <Delta
                value={attendanceRate >= 90 ? "On track" : "Watch"}
                tone={attendanceRate >= 90 ? "success" : "warning"}
              />
            </p>
            <p className="text-muted mt-1 text-caption">Last 21 working days</p>
            <div className="mt-4">
              <Progress value={attendanceRate} tone="success" label="Attendance rate" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-5">
            <p className="text-muted self-start text-tiny font-semibold tracking-wide uppercase">
              KPI score
            </p>
            <Gauge value={latestScore} caption={formatMonth(trend.at(-1)?.periodStart ?? null)} />
            <Delta
              value={`${latestScore - previousScore >= 0 ? "+" : ""}${latestScore - previousScore}`}
              tone={latestScore >= previousScore ? "success" : "error"}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open tasks", value: String(open.length), caption: `${overdue.length} overdue` },
          { label: "Average grade", value: averageGrade, caption: `${graded.length} graded` },
          {
            label: "Assignments left",
            value: String(assignments.filter((row) => row.status === "not_started").length),
            caption: `${assignments.length} in total`,
          },
          {
            label: "Updates",
            value: String(notifications.length),
            caption: "in the last few days",
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

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="My tasks"
            action={
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  View all
                  <RiArrowRightSLine size={16} aria-hidden />
                </Button>
              </Link>
            }
          />
          <ul>
            {tasks.slice(0, 6).map((task) => (
              <li
                key={task.id}
                className="border-line hover:bg-raised flex items-center gap-3 border-b px-5 py-3 transition-colors last:border-b-0"
              >
                <TaskCheckbox
                  taskId={task.id}
                  done={task.status === "done"}
                  label={task.title}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={
                      task.status === "done"
                        ? "text-muted block truncate text-body font-semibold line-through"
                        : "text-primary block truncate text-body font-semibold"
                    }
                  >
                    {task.title}
                  </span>
                  <span className="text-muted block text-tiny">
                    {task.projectName ? `${task.projectName} · ` : ""}due {relativeDays(task.dueAt)}
                  </span>
                </span>
                <Badge tone={taskTone(task.status, task.dueAt)}>
                  {taskStatusLabels[task.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Upcoming deadlines" />
          <ul>
            {deadlines.length === 0 ? (
              <li className="text-muted px-5 py-4 text-body">Nothing due. Enjoy it.</li>
            ) : (
              deadlines.map((deadline) => (
                <li
                  key={deadline.title}
                  className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block truncate text-body font-semibold">
                      {deadline.title}
                    </span>
                  </span>
                  <Badge tone={deadline.tone}>{deadline.when}</Badge>
                </li>
              ))
            )}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="KPI trend" action={<Badge>Last {trend.length} months</Badge>} />
          <KpiBars
            data={trend.map((point) => ({
              month: formatMonth(point.periodStart),
              score: point.score,
            }))}
          />
        </Card>

        <Card>
          <CardHeader title="Recent updates" />
          <ul className="py-2">
            {notifications.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-2.5">
                <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                  {initials(user.name)}
                </span>
                <span className="min-w-0">
                  <span className="text-primary block text-caption">{item.title}</span>
                  <span className="text-muted block text-tiny">
                    {relativeDays(item.createdAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
