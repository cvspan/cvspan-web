import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import {
  AddToDepartmentButton,
  DeleteDepartmentButton,
  EditDepartmentButton,
  RemoveFromDepartmentButton,
} from "@/components/forms/department-forms";
import { NewProjectButton } from "@/components/forms/project-forms";
import { HealthBadge } from "@/components/projects/health-badge";
import {
  getAssignablePeople,
  getDepartmentMembers,
  getDepartmentOverview,
  getDepartmentsOverview,
} from "@/db/queries-departments";
import { getProjects } from "@/db/queries-projects";
import { employmentLabels, formatDay } from "@/lib/format";
import { canBeProjectManager, describeProject, projectStatusLabels, todayString } from "@/lib/project";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function DepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  if (!atLeast(user.viewRole, "admin")) notFound();

  const department = await getDepartmentOverview(id);
  if (!department) notFound();

  const [members, projects, everyone, departments] = await Promise.all([
    getDepartmentMembers(id),
    getProjects({ departmentId: id }),
    getAssignablePeople(),
    getDepartmentsOverview(),
  ]);

  const today = todayString();
  const current = members.filter((member) => member.status !== "alumni");

  const stats = [
    { label: "People", value: department.headcount },
    { label: "Teams", value: department.teamCount },
    { label: "Active projects", value: department.activeProjects },
    { label: "Open roles", value: department.openRoles },
  ];

  return (
    <>
      <Link
        href="/departments"
        className="text-muted hover:text-primary flex items-center gap-1 text-caption"
      >
        <RiArrowLeftLine size={14} aria-hidden />
        All departments
      </Link>

      <PageHeader
        pretitle="Department"
        title={department.name}
        actions={
          <>
            <AddToDepartmentButton
              departmentId={id}
              departmentName={department.name}
              people={everyone
                .filter((person) => person.departmentId !== id)
                .map((person) => ({
                  id: person.id,
                  name: person.name,
                  detail: person.departmentName
                    ? `Currently in ${person.departmentName}`
                    : (person.jobTitle ?? "Not in a department"),
                }))}
            />
            <NewProjectButton
              departments={departments.map((row) => ({ id: row.id, name: row.name }))}
              people={everyone.map((person) => ({ id: person.id, name: person.name, isMember: !canBeProjectManager(person.role) }))}
              defaultDepartmentId={id}
            />
            <EditDepartmentButton
              department={department}
              members={current.map((member) => ({ id: member.id, name: member.name }))}
            />
            <DeleteDepartmentButton id={id} name={department.name} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="People" action={<Badge>{members.length} total</Badge>} />
          {members.length === 0 ? (
            <p className="text-muted px-5 py-10 text-center text-body">
              No one is in this department yet. Choose “Add people” to place them.
            </p>
          ) : (
            <Table>
              <Thead columns={["Member", "Team", "Type", "Projects", "Status", ""]} />
              <tbody>
                {members.map((member) => (
                  <Tr key={member.id}>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Avatar name={member.name} />
                        <span className="min-w-0">
                          <Link
                            href={`/people/${member.id}`}
                            className="text-primary hover:text-accent flex items-center gap-2 truncate font-semibold"
                          >
                            {member.name}
                            {member.id === department.headId ? (
                              <Badge tone="accent">Head</Badge>
                            ) : null}
                          </Link>
                          <span className="text-muted block truncate text-tiny">
                            {member.jobTitle ?? member.email}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">{member.teamName ?? "—"}</Td>
                    <Td>
                      <Badge>{employmentLabels[member.employmentType]}</Badge>
                    </Td>
                    <Td>{member.projectCount || "—"}</Td>
                    <Td>
                      <Badge tone={statusTone(member.status)} className="capitalize">
                        {member.status}
                      </Badge>
                    </Td>
                    <Td className="w-12">
                      <RemoveFromDepartmentButton
                        departmentId={id}
                        userId={member.id}
                        name={member.name}
                      />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="About" />
            <dl className="flex flex-col gap-4 p-5 text-body">
              <div>
                <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Head</dt>
                <dd className="text-primary mt-0.5">
                  {department.headName ?? <span className="text-muted">Not set</span>}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">
                  Description
                </dt>
                <dd className="text-secondary mt-0.5">
                  {department.description ?? <span className="text-muted">No description</span>}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Projects" action={<Badge>{projects.length}</Badge>} />
            {projects.length === 0 ? (
              <p className="text-muted px-5 py-6 text-body">No projects in this department.</p>
            ) : (
              <ul>
                {projects.map((project) => {
                  const described = describeProject(project, today);
                  return (
                    <li key={project.id} className="border-line border-b px-5 py-3 last:border-b-0">
                      <span className="flex items-center justify-between gap-3">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-primary hover:text-accent min-w-0 truncate text-body font-semibold"
                        >
                          {project.name}
                        </Link>
                        <HealthBadge health={described.health} />
                      </span>
                      <span className="text-muted mt-0.5 block text-tiny">
                        {projectStatusLabels[project.status]}
                        {project.targetDate ? ` · target ${formatDay(project.targetDate)}` : ""}
                      </span>
                      <span className="mt-2 flex items-center gap-2">
                        <span className="flex-1">
                          <Progress value={described.progress} label={`${project.name} progress`} />
                        </span>
                        <span className="text-secondary w-9 text-right text-caption font-semibold">
                          {described.progress}%
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
