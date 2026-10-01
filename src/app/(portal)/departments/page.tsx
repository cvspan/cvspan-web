import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { NewDepartmentButton } from "@/components/forms/department-forms";
import { getDepartmentsOverview } from "@/db/queries-departments";
import { getPeople } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Departments · CVSpan Portal" };

export default async function DepartmentsPage() {
  const user = await requireUser();
  if (!atLeast(user.viewRole, "admin")) notFound();

  const [departments, people] = await Promise.all([getDepartmentsOverview(), getPeople()]);

  const active = people.filter((person) => person.status !== "alumni");
  const unassigned = active.filter((person) => !person.departmentId);

  const counts = [
    { label: "Departments", value: departments.length },
    { label: "People assigned", value: active.length - unassigned.length },
    { label: "Unassigned", value: unassigned.length },
    { label: "Active projects", value: departments.reduce((sum, row) => sum + row.activeProjects, 0) },
  ];

  return (
    <>
      <PageHeader pretitle="Organisation" title="Departments" actions={<NewDepartmentButton />} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.value}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="All departments" action={<Badge>{departments.length} total</Badge>} />
        {departments.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            No departments yet. Create the first one.
          </p>
        ) : (
          <Table>
            <Thead columns={["Department", "Head", "People", "Teams", "Projects", "Open roles"]} />
            <tbody>
              {departments.map((department) => (
                <Tr key={department.id}>
                  <Td className="max-w-96">
                    <Link
                      href={`/departments/${department.id}`}
                      className="text-primary hover:text-accent block truncate font-semibold"
                    >
                      {department.name}
                    </Link>
                    {department.description ? (
                      <span className="text-muted block truncate text-tiny">
                        {department.description}
                      </span>
                    ) : null}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {department.headName ?? <span className="text-muted">No head</span>}
                  </Td>
                  <Td>{department.headcount}</Td>
                  <Td>{department.teamCount}</Td>
                  <Td>
                    {department.activeProjects > 0 ? (
                      <Badge tone="accent">{department.activeProjects} active</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </Td>
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
        )}
      </Card>

      {unassigned.length > 0 ? (
        <Card>
          <CardHeader
            title="Not in a department"
            action={<Badge tone="warning">{unassigned.length} people</Badge>}
          />
          <p className="text-secondary px-5 pt-4 text-body">
            Open a department and choose <strong className="text-primary">Add people</strong> to place them.
          </p>
          <ul className="flex flex-wrap gap-2 p-5">
            {unassigned.map((person) => (
              <li key={person.id}>
                <Link
                  href={`/people/${person.id}`}
                  className="border-line text-primary hover:bg-raised rounded-full border px-3 py-1 text-caption"
                >
                  {person.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </>
  );
}
