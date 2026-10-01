import Link from "next/link";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { NewProjectButton } from "@/components/forms/project-forms";
import { HealthBadge } from "@/components/projects/health-badge";
import { getAssignablePeople, getDepartmentsOverview } from "@/db/queries-departments";
import { getMembersForProjects, getProjects } from "@/db/queries-projects";
import { formatDay, pluralise } from "@/lib/format";
import {
  canBeProjectManager,
  describeProject,
  inFlightStatuses,
  isClosedStatus,
  projectStatusLabels,
  projectStatuses,
  todayString,
  type ProjectStatus,
} from "@/lib/project";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone, type Tone } from "@/lib/tone";
import { cn } from "@/lib/utils";

export const metadata = { title: "Projects · CVSpan Portal" };

const projectStatusTone: Record<ProjectStatus, Tone> = {
  not_started: "neutral",
  planning: "accent",
  design: "accent",
  development: "accent",
  live: "success",
  on_hold: "warning",
  cancelled: "neutral",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status: statusFilter } = await searchParams;
  const canAdmin = atLeast(user.viewRole, "admin");

  /** Admins see every project; everyone else sees the ones they have been added to. */
  const all = await getProjects(canAdmin ? {} : { memberUserId: user.id });
  const members = await getMembersForProjects(all.map((project) => project.id));

  const today = todayString();
  const rows = all.map((project) => ({ ...project, ...describeProject(project, today) }));

  const filter = projectStatuses.includes(statusFilter as ProjectStatus)
    ? (statusFilter as ProjectStatus)
    : "all";
  const visible = filter === "all" ? rows : rows.filter((row) => row.status === filter);

  const counts = [
    {
      label: "In progress",
      value: rows.filter((row) => inFlightStatuses.includes(row.status as (typeof inFlightStatuses)[number])).length,
      tone: "accent" as Tone,
    },
    {
      label: "Needs attention",
      value: rows.filter((row) => row.health === "at_risk" || row.health === "behind").length,
      tone: "warning" as Tone,
    },
    { label: "On hold", value: rows.filter((row) => row.status === "on_hold").length, tone: "neutral" as Tone },
    { label: "Live", value: rows.filter((row) => row.status === "live").length, tone: "success" as Tone },
  ];

  const [departments, people] = canAdmin
    ? await Promise.all([getDepartmentsOverview(), getAssignablePeople()])
    : [[], []];

  const tabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: rows.length },
    ...projectStatuses.map((status) => ({
      key: status,
      label: projectStatusLabels[status],
      count: rows.filter((row) => row.status === status).length,
    })),
  ];

  return (
    <>
      <PageHeader
        pretitle="Work"
        title="Projects"
        actions={
          canAdmin ? (
            <NewProjectButton
              departments={departments.map((row) => ({ id: row.id, name: row.name }))}
              people={people.map((person) => ({ id: person.id, name: person.name, isMember: !canBeProjectManager(person.role) }))}
            />
          ) : null
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <span className="text-primary text-h5 font-semibold">{item.value}</span>
              <Badge tone={item.tone}>{item.label}</Badge>
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader
          title={canAdmin ? "All projects" : "My projects"}
          action={
            <nav aria-label="Filter by status" className="flex flex-wrap gap-1">
              {tabs
                .filter((tab) => tab.key === "all" || tab.count > 0 || tab.key === filter)
                .map((tab) => (
                  <Link
                    key={tab.key}
                    href={tab.key === "all" ? "/projects" : `/projects?status=${tab.key}`}
                    aria-current={filter === tab.key ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-caption font-semibold transition-colors",
                      filter === tab.key
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-raised hover:text-primary",
                    )}
                  >
                    {tab.label} <span className="font-normal">{tab.count}</span>
                  </Link>
                ))}
            </nav>
          }
        />

        {visible.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            {rows.length === 0
              ? canAdmin
                ? "No projects yet. Create the first one."
                : "You haven't been added to a project yet."
              : "No projects with this status."}
          </p>
        ) : (
          <Table>
            <Thead
              columns={["Project", "Manager", "Team", "Timeline", "Progress", "Health", "Status"]}
            />
            <tbody>
              {visible.map((project) => (
                <Tr key={project.id}>
                  <Td className="max-w-72">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-primary hover:text-accent block truncate font-semibold"
                    >
                      {project.name}
                    </Link>
                    <span className="text-muted block truncate text-tiny">
                      <span className="font-semibold">{project.code}</span>
                      {project.departmentName ? ` · ${project.departmentName}` : ""}
                    </span>
                  </Td>
                  <Td>
                    {project.leadName ? (
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <Avatar name={project.leadName} size="sm" />
                        {project.leadName}
                      </span>
                    ) : (
                      <span className="text-muted">No manager</span>
                    )}
                  </Td>
                  <Td>
                    <AvatarStack people={members.get(project.id) ?? []} />
                  </Td>
                  <Td className="whitespace-nowrap">
                    {project.startDate || project.targetDate ? (
                      <>
                        {formatDay(project.startDate)} – {formatDay(project.targetDate)}
                        <span className="text-muted block text-tiny">
                          {isClosedStatus(project.status)
                            ? " "
                            : project.daysLeft === null
                              ? "No target"
                              : project.daysLeft >= 0
                                ? `${pluralise(project.daysLeft, "day")} left`
                                : `${pluralise(Math.abs(project.daysLeft), "day")} over`}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">Not scheduled</span>
                    )}
                  </Td>
                  <Td className="min-w-36">
                    <span className="flex items-center gap-2">
                      <span className="flex-1">
                        <Progress
                          value={project.progress}
                          tone={
                            project.health === "behind"
                              ? "error"
                              : project.health === "at_risk"
                                ? "warning"
                                : project.status === "live"
                                  ? "success"
                                  : "brand"
                          }
                          label={`${project.name} progress`}
                        />
                      </span>
                      <span className="text-primary w-9 text-right text-caption font-semibold">
                        {project.progress}%
                      </span>
                    </span>
                    <span className="text-muted mt-1 block text-tiny">
                      {project.tasksDone}/{project.tasksTotal} tasks
                    </span>
                  </Td>
                  <Td>
                    <HealthBadge health={project.health} />
                  </Td>
                  <Td>
                    <Badge tone={projectStatusTone[project.status] ?? statusTone(project.status)}>
                      {projectStatusLabels[project.status]}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
