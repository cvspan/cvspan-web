import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiMailLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gauge, Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { KpiBars } from "@/components/portal/kpi-bars";
import { GradeButton } from "@/components/forms/grade-dialog";
import { messagePerson } from "@/app/actions/messages";
import {
  getAttendanceFor,
  getAttendanceRate,
  getKpiHistory,
  getKpiTrend,
  getTasksFor,
  getUserById,
} from "@/db/queries";
import { getDepartmentOverview } from "@/db/queries-departments";
import { getReviewsForUser } from "@/db/queries-reviews";
import { EditDatesButton } from "@/components/forms/review-forms";
import { InternshipCountdown } from "@/components/reviews/internship-countdown";
import { RatingMeter } from "@/components/reviews/rating-meter";
import { getProjectsForPerson } from "@/db/queries-projects";
import {
  attendanceLabels,
  employmentLabels,
  formatDay,
  formatMonth,
  formatTime,
  initials,
  relativeDays,
  taskStatusLabels,
} from "@/lib/format";
import { atLeast, roleLabels } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { companyDay } from "@/lib/dates";
import { CRITERIA, internshipWindow, ratingTone } from "@/lib/grading";
import { projectRoleLabels, projectStatusLabels } from "@/lib/project";
import { attendanceTone, statusTone, taskTone } from "@/lib/tone";

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireUser();
  const person = await getUserById(id);

  if (!person) notFound();

  /** Members may only open their own profile. */
  const canView = viewer.id === person.id || atLeast(viewer.role, "manager");
  if (!canView) notFound();

  const [tasks, trend, history, attendance, rate, department, projects, reviews] = await Promise.all([
    getTasksFor(person.id),
    getKpiTrend(person.id),
    getKpiHistory(person.id),
    getAttendanceFor(person.id, 7),
    getAttendanceRate(person.id),
    person.departmentId ? getDepartmentOverview(person.departmentId) : null,
    getProjectsForPerson(person.id),
    getReviewsForUser(person.id, 8),
  ]);

  const internship =
    person.employmentType === "internship" ? internshipWindow(person, companyDay()) : null;

  const latest = trend.at(-1);
  const open = tasks.filter((task) => task.status !== "done");

  return (
    <>
      <Link href="/team" className="text-muted hover:text-primary flex items-center gap-1 text-caption">
        <RiArrowLeftLine size={14} aria-hidden />
        Back to team
      </Link>

      <PageHeader
        pretitle={person.jobTitle ?? "Member"}
        title={person.name}
        actions={
          <>
            <form
              action={async () => {
                "use server";
                await messagePerson(person.id);
              }}
            >
              <Button type="submit" variant="secondary">
                <RiMailLine size={18} aria-hidden />
                Message
              </Button>
            </form>
            {atLeast(viewer.role, "admin") ? (
              <EditDatesButton
                userId={person.id}
                startDate={person.startDate}
                endDate={person.endDate}
              />
            ) : null}
            {atLeast(viewer.role, "manager") && viewer.id !== person.id ? (
              <GradeButton
                userId={person.id}
                name={person.name}
                currentScore={latest?.score ?? 0}
              />
            ) : null}
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center gap-4 p-5">
            <span className="bg-accent-soft text-accent flex size-16 shrink-0 items-center justify-center rounded-full text-title font-semibold">
              {initials(person.name)}
            </span>
            <div className="min-w-0">
              <p className="text-primary text-title font-semibold">{person.name}</p>
              <p className="text-muted text-body">{person.email}</p>
              <p className="mt-2 flex flex-wrap gap-2">
                <Badge>{employmentLabels[person.employmentType]}</Badge>
                <Badge tone="accent">{roleLabels[person.role]}</Badge>
                <Badge tone={statusTone(person.status)} className="capitalize">
                  {person.status}
                </Badge>
              </p>
            </div>
          </div>
          <dl className="border-line grid grid-cols-3 gap-4 border-t px-5 py-4 text-body">
            <div>
              <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">
                Department
              </dt>
              <dd className="text-primary">
                {department ? (
                  atLeast(viewer.role, "admin") ? (
                    <Link href={`/departments/${department.id}`} className="hover:text-accent">
                      {department.name}
                    </Link>
                  ) : (
                    department.name
                  )
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">
                Started
              </dt>
              <dd className="text-primary">{person.startDate ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Ends</dt>
              <dd className="text-primary">{person.endDate ?? "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-5">
            <p className="text-muted self-start text-tiny font-semibold tracking-wide uppercase">
              KPI score
            </p>
            {latest ? (
              <Gauge value={latest.score} caption={formatMonth(latest.periodStart)} />
            ) : (
              <p className="text-muted py-8 text-body">Not graded yet</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex h-full flex-col gap-3 p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              Attendance
            </p>
            <p className="text-primary text-h4 font-semibold">{rate}%</p>
            <p className="text-muted text-caption">{open.length} open tasks</p>
            <div className="mt-auto">
              <Progress value={rate} tone={rate >= 90 ? "success" : "brand"} label="Attendance" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Tasks" action={<Badge>{open.length} open</Badge>} />
          {tasks.length === 0 ? (
            <p className="text-muted px-5 py-6 text-body">No tasks assigned.</p>
          ) : (
            <Table>
              <Thead columns={["Task", "Project", "Due", "Status"]} />
              <tbody>
                {tasks.map((task) => (
                  <Tr key={task.id}>
                    <Td className="text-primary font-semibold">{task.title}</Td>
                    <Td className="whitespace-nowrap">
                      {task.projectId && atLeast(viewer.role, "admin") ? (
                        <Link href={`/projects/${task.projectId}`} className="hover:text-accent">
                          {task.projectName}
                        </Link>
                      ) : (
                        (task.projectName ?? "—")
                      )}
                    </Td>
                    <Td className="whitespace-nowrap">{relativeDays(task.dueAt)}</Td>
                    <Td>
                      <Badge tone={taskTone(task.status, task.dueAt)}>
                        {taskStatusLabels[task.status]}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent attendance" />
          <Table>
            <Thead columns={["Day", "Type", "In", "Out"]} />
            <tbody>
              {attendance.map((entry) => (
                <Tr key={entry.id}>
                  <Td className="text-primary font-semibold whitespace-nowrap">
                    {formatDay(entry.day)}
                  </Td>
                  <Td>
                    <Badge tone={attendanceTone(entry.kind)}>{attendanceLabels[entry.kind]}</Badge>
                  </Td>
                  <Td>{formatTime(entry.clockIn)}</Td>
                  <Td>{formatTime(entry.clockOut)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>

      {internship ? <InternshipCountdown window={internship} name={person.name.split(" ")[0]} /> : null}

      <Card>
        <CardHeader title="Weekly reviews" action={<Badge>{reviews.length === 1 ? "1 week" : `${reviews.length} weeks`} graded</Badge>} />
        {reviews.length === 0 ? (
          <p className="text-muted px-5 py-6 text-body">No weekly reviews yet.</p>
        ) : (
          <Table>
            <Thead columns={["Week of", "Overall", ...CRITERIA.map((criterion) => criterion.name), "Reviewer"]} />
            <tbody>
              {reviews.map((review) => (
                <Tr key={review.id}>
                  <Td className="whitespace-nowrap font-semibold text-primary">{formatDay(review.weekStart)}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      <RatingMeter value={review.average ?? 0} size="sm" />
                      <Badge tone={ratingTone(review.average ?? 0)}>{review.average?.toFixed(1)}</Badge>
                    </span>
                  </Td>
                  {CRITERIA.map((criterion) => (
                    <Td key={criterion.key}>{review.ratings[criterion.key] ?? "—"}</Td>
                  ))}
                  <Td className="whitespace-nowrap">{review.reviewerName ?? "—"}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <CardHeader title="Projects" action={<Badge>{projects.length}</Badge>} />
        {projects.length === 0 ? (
          <p className="text-muted px-5 py-6 text-body">Not on any projects.</p>
        ) : (
          <Table>
            <Thead columns={["Project", "Role", "Target", "Status"]} />
            <tbody>
              {projects.map((project) => (
                <Tr key={project.id}>
                  <Td>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-primary hover:text-accent font-semibold"
                    >
                      {project.name}
                    </Link>
                    <span className="text-muted ml-2 text-tiny">{project.code}</span>
                  </Td>
                  <Td>{projectRoleLabels[project.role]}</Td>
                  <Td className="whitespace-nowrap">{formatDay(project.targetDate)}</Td>
                  <Td>
                    <Badge>{projectStatusLabels[project.status]}</Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="KPI trend" />
          {trend.length > 0 ? (
            <KpiBars
              data={trend.map((point) => ({
                month: formatMonth(point.periodStart),
                score: point.score,
              }))}
            />
          ) : (
            <p className="text-muted px-5 py-8 text-body">No scores recorded yet.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Grading history" />
          {history.length === 0 ? (
            <p className="text-muted px-5 py-6 text-body">Nothing recorded.</p>
          ) : (
            <ul>
              {history.map((row) => (
                <li
                  key={row.id}
                  className="border-line flex items-start gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block text-body font-semibold">
                      {formatMonth(row.periodStart)} — {row.score}%
                    </span>
                    <span className="text-muted block text-tiny">
                      {row.comment ?? "No comment"} · {row.gradedBy ?? "—"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
