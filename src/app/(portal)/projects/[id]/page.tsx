import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiCalendarLine, RiExternalLinkLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { TaskCheckbox } from "@/components/forms/task-forms";
import {
  AddMembersButton,
  DeleteMilestoneButton,
  DeleteProjectButton,
  EditProjectButton,
  MemberRoleSelect,
  MilestoneButton,
  MilestoneDoneToggle,
  NewProjectTaskButton,
  PostUpdateForm,
  ProjectStatusSelect,
  RemoveMemberButton,
} from "@/components/forms/project-forms";
import { HealthBadge } from "@/components/projects/health-badge";
import { StageTracker } from "@/components/projects/stage-tracker";
import { Timeline } from "@/components/projects/timeline";
import { getAssignablePeople, getDepartmentsOverview } from "@/db/queries-departments";
import {
  getMilestones,
  getProject,
  getProjectMembers,
  getProjectRole,
  getProjectTasks,
  getProjectUpdates,
} from "@/db/queries-projects";
import { formatDay, pluralise, relativeDays, taskStatusLabels } from "@/lib/format";
import {
  canBeProjectManager,
  canManageProject,
  describeProject,
  isClosedStatus,
  milestoneProgress,
  milestoneStatusLabels,
  projectRoleLabels,
  projectStatusLabels,
  reportedHealthLabels,
  reportedHealthTone,
  timelineRange,
  todayString,
} from "@/lib/project";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { taskTone, type Tone } from "@/lib/tone";

const milestoneTone: Record<string, Tone> = {
  not_started: "neutral",
  in_progress: "accent",
  done: "success",
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const project = await getProject(id);
  if (!project) notFound();

  const canAdmin = atLeast(user.viewRole, "admin");
  const myRole = await getProjectRole(id, user.id);

  /** Admins see every project; everyone else only the ones they are on. */
  if (!canAdmin && !myRole) notFound();
  /** Admins, or this project's manager. Only admins delete a project. */
  const canManage = canManageProject(user.viewRole, myRole);

  const [members, milestones, tasks, updates] = await Promise.all([
    getProjectMembers(id),
    getMilestones(id),
    getProjectTasks(id),
    getProjectUpdates(id),
  ]);

  const [departments, everyone] = canManage
    ? await Promise.all([getDepartmentsOverview(), getAssignablePeople()])
    : [[], []];

  const today = todayString();
  const described = describeProject(project, today);
  const range = timelineRange(project, milestones, today);
  const memberIds = new Set(members.map((member) => member.id));

  const overdueTasks = project.overdueTasks;
  const closed = isClosedStatus(project.status);

  const timeLeft =
    described.daysLeft === null || closed
      ? "—"
      : described.daysLeft >= 0
        ? pluralise(described.daysLeft, "day")
        : `${pluralise(Math.abs(described.daysLeft), "day")} over`;

  const progressTone =
    described.health === "behind" ? "error" : described.health === "at_risk" ? "warning" : "brand";

  return (
    <>
      <Link
        href="/projects"
        className="text-muted hover:text-primary flex items-center gap-1 text-caption"
      >
        <RiArrowLeftLine size={14} aria-hidden />
        All projects
      </Link>

      <PageHeader
        pretitle={`${project.code}${project.departmentName ? ` · ${project.departmentName}` : ""}`}
        title={project.name}
        actions={
          <>
            {canManage ? <ProjectStatusSelect projectId={id} status={project.status} /> : (
              <Badge>{projectStatusLabels[project.status]}</Badge>
            )}
            {canManage ? (
              <EditProjectButton
                project={{
                  id: project.id,
                  name: project.name,
                  code: project.code,
                  description: project.description,
                  departmentId: project.departmentId,
                  status: project.status,
                  startDate: project.startDate,
                  targetDate: project.targetDate,
                  links: project.links,
                  updatedAt: project.updatedAt,
                }}
                departments={departments.map((row) => ({ id: row.id, name: row.name }))}
              />
            ) : null}
            {canAdmin ? <DeleteProjectButton id={id} name={project.name} /> : null}
          </>
        }
      />

      {project.description ? (
        <p className="text-secondary -mt-1 max-w-200 text-body">{project.description}</p>
      ) : null}

      <Card className="p-5">
        <StageTracker status={project.status} />
        {project.links.length > 0 ? (
          <ul className="border-line mt-4 flex flex-wrap gap-2 border-t pt-4" aria-label="Project links">
            {project.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line text-primary hover:bg-raised flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-caption font-semibold transition-colors"
                >
                  {link.name}
                  <RiExternalLinkLine size={14} className="text-muted" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Progress</p>
          <p className="text-primary mt-1 text-h5 font-semibold">{described.progress}%</p>
          <div className="mt-3">
            <Progress value={described.progress} tone={progressTone} label="Project progress" />
          </div>
          <p className="text-muted mt-2 text-tiny">
            {project.tasksDone} of {project.tasksTotal} tasks done
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
            Schedule elapsed
          </p>
          <p className="text-primary mt-1 text-h5 font-semibold">
            {described.planned === null ? "—" : `${described.planned}%`}
          </p>
          <div className="mt-3">
            <Progress value={described.planned ?? 0} label="Schedule elapsed" />
          </div>
          <p className="text-muted mt-2 text-tiny">
            {project.startDate || project.targetDate
              ? `${formatDay(project.startDate)} – ${formatDay(project.targetDate)}`
              : "No dates set"}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Time left</p>
          <p className="text-primary mt-1 text-h5 font-semibold">{timeLeft}</p>
          <p className="text-muted mt-5 flex items-center gap-1.5 text-tiny">
            <RiCalendarLine size={14} aria-hidden />
            {project.targetDate ? `Target ${formatDay(project.targetDate)}` : "No target date"}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Health</p>
          <p className="mt-2">
            <HealthBadge health={described.health} />
          </p>
          <p className="text-muted mt-4 text-tiny">
            {pluralise(project.overdueMilestones, "overdue milestone")} · {pluralise(overdueTasks, "overdue task")}
          </p>
        </Card>
      </section>

      <section className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader title="Timeline" />
            {range ? (
              <Timeline
                range={range}
                projectStart={project.startDate}
                projectTarget={project.targetDate}
                milestones={milestones}
                today={today}
              />
            ) : (
              <p className="text-muted px-5 py-8 text-body">
                Set a start and target date, or add milestones, to see the timeline.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Milestones"
              action={canManage ? <MilestoneButton projectId={id} /> : <Badge>{milestones.length}</Badge>}
            />
            {milestones.length === 0 ? (
              <p className="text-muted px-5 py-8 text-body">
                No milestones yet.{canManage ? " Add the phases that make up this project." : ""}
              </p>
            ) : (
              <Table>
                <Thead columns={["", "Milestone", "Window", "Progress", "Status", ""]} />
                <tbody>
                  {milestones.map((milestone) => {
                    const progress = milestoneProgress(milestone.status, {
                      done: milestone.tasksDone,
                      total: milestone.tasksTotal,
                    });
                    const overdue = milestone.status !== "done" && milestone.dueDate < today;

                    return (
                      <Tr key={milestone.id}>
                        <Td className="w-10 pr-0">
                          {canManage ? (
                            <MilestoneDoneToggle
                              milestoneId={milestone.id}
                              status={milestone.status}
                              title={milestone.title}
                            />
                          ) : null}
                        </Td>
                        <Td className="max-w-72">
                          <span
                            className={
                              milestone.status === "done"
                                ? "text-muted block truncate font-semibold line-through"
                                : "text-primary block truncate font-semibold"
                            }
                          >
                            {milestone.title}
                          </span>
                          {milestone.description ? (
                            <span className="text-muted block truncate text-tiny">
                              {milestone.description}
                            </span>
                          ) : null}
                        </Td>
                        <Td className="whitespace-nowrap">
                          {milestone.startDate ? `${formatDay(milestone.startDate)} – ` : "Due "}
                          {formatDay(milestone.dueDate)}
                          <span
                            className={`block text-tiny ${overdue ? "text-error-text" : "text-muted"}`}
                          >
                            {overdue ? "Overdue · " : ""}
                            {relativeDays(milestone.dueDate)}
                          </span>
                        </Td>
                        <Td className="min-w-32">
                          <span className="flex items-center gap-2">
                            <span className="flex-1">
                              <Progress value={progress} label={`${milestone.title} progress`} />
                            </span>
                            <span className="text-primary w-9 text-right text-caption font-semibold">
                              {progress}%
                            </span>
                          </span>
                          {milestone.tasksTotal > 0 ? (
                            <span className="text-muted mt-1 block text-tiny">
                              {milestone.tasksDone}/{milestone.tasksTotal} tasks
                            </span>
                          ) : null}
                        </Td>
                        <Td>
                          <Badge tone={overdue ? "error" : milestoneTone[milestone.status]}>
                            {milestoneStatusLabels[milestone.status]}
                          </Badge>
                        </Td>
                        <Td className="whitespace-nowrap">
                          {canManage ? (
                            <span className="flex justify-end gap-0.5">
                              <MilestoneButton projectId={id} milestone={milestone} />
                              <DeleteMilestoneButton
                                milestoneId={milestone.id}
                                title={milestone.title}
                              />
                            </span>
                          ) : null}
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Tasks"
              action={
                <NewProjectTaskButton
                  projectId={id}
                  members={(canManage ? members : members.filter((member) => member.id === user.id)).map(
                    (member) => ({ id: member.id, name: member.name }),
                  )}
                  milestones={milestones.map((milestone) => ({
                    id: milestone.id,
                    title: milestone.title,
                  }))}
                  defaultAssigneeId={memberIds.has(user.id) ? user.id : undefined}
                />
              }
            />
            {tasks.length === 0 ? (
              <p className="text-muted px-5 py-8 text-body">
                No tasks yet. Finished tasks drive the project&apos;s progress.
              </p>
            ) : (
              <Table>
                <Thead columns={["", "Task", "Milestone", "Assignee", "Due", "Status"]} />
                <tbody>
                  {tasks.map((task) => (
                    <Tr key={task.id}>
                      <Td className="w-10 pr-0">
                        {canManage || task.assigneeId === user.id ? (
                          <TaskCheckbox
                            taskId={task.id}
                            done={task.status === "done"}
                            label={task.title}
                          />
                        ) : null}
                      </Td>
                      <Td
                        className={
                          task.status === "done"
                            ? "text-muted max-w-72 truncate line-through"
                            : "text-primary max-w-72 truncate font-semibold"
                        }
                      >
                        {task.title}
                      </Td>
                      <Td className="whitespace-nowrap">{task.milestoneTitle ?? "—"}</Td>
                      <Td>
                        {task.assigneeName ? (
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <Avatar name={task.assigneeName} size="sm" />
                            {task.assigneeName}
                          </span>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </Td>
                      <Td className="whitespace-nowrap">
                        {formatDay(task.dueAt)}
                        <span className="text-muted block text-tiny">{relativeDays(task.dueAt)}</span>
                      </Td>
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
        </div>

        {/* Beside the main column on wide screens; side by side underneath it otherwise. */}
        <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-1">
          <Card>
            <CardHeader
              title="Team"
              action={
                canManage ? (
                  <AddMembersButton
                    projectId={id}
                    projectName={project.name}
                    people={everyone
                      .filter((person) => !memberIds.has(person.id))
                      .map((person) => ({
                        id: person.id,
                        name: person.name,
                        detail: [person.jobTitle, person.departmentName].filter(Boolean).join(" · "),
                      }))}
                  />
                ) : (
                  <Badge>{members.length}</Badge>
                )
              }
            />
            {members.length === 0 ? (
              <p className="text-muted px-5 py-6 text-body">No one is on this project yet.</p>
            ) : (
              <ul>
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
                  >
                    <Avatar name={member.name} />
                    <span className="min-w-0 flex-1">
                      <Link
                        href={`/people/${member.id}`}
                        className="text-primary hover:text-accent block truncate text-body font-semibold"
                      >
                        {member.name}
                      </Link>
                      <span className="text-muted block truncate text-tiny">
                        {member.jobTitle ?? member.departmentName ?? "—"}
                        {member.openTasks > 0 ? ` · ${member.openTasks} open` : ""}
                      </span>
                    </span>
                    {canManage ? (
                      <>
                        <MemberRoleSelect
                          projectId={id}
                          userId={member.id}
                          role={member.role}
                          name={member.name}
                          canBeManager={canBeProjectManager(member.userRole) || canAdmin}
                        />
                        <RemoveMemberButton projectId={id} userId={member.id} name={member.name} />
                      </>
                    ) : (
                      <Badge tone={member.role === "lead" ? "accent" : "neutral"}>
                        {projectRoleLabels[member.role]}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Status updates" />
            {canManage ? <PostUpdateForm projectId={id} /> : null}
            {updates.length === 0 ? (
              <p className="text-muted px-5 py-6 text-body">No updates posted yet.</p>
            ) : (
              <ul>
                {updates.map((update) => (
                  <li key={update.id} className="border-line border-b px-5 py-4 last:border-b-0">
                    <span className="flex items-center justify-between gap-2">
                      <Badge tone={reportedHealthTone[update.health]}>
                        {reportedHealthLabels[update.health]}
                      </Badge>
                      <span className="text-muted text-tiny">
                        {relativeDays(update.createdAt)}
                      </span>
                    </span>
                    <p className="text-secondary mt-2 text-body whitespace-pre-line">{update.body}</p>
                    <p className="text-muted mt-1.5 text-tiny">{update.authorName ?? "Unknown"}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
