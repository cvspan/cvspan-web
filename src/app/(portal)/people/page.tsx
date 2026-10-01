import Link from "next/link";
import { RiDownloadLine, RiNodeTree } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { DirectorySearch } from "@/components/forms/directory-search";
import { InviteMemberButton } from "@/components/forms/people-forms";
import { getDepartmentSummary, getHeadcountByType, getPeople } from "@/db/queries";
import { employmentLabels, initials } from "@/lib/format";
import { roleLabels } from "@/lib/roles";
import { statusTone } from "@/lib/tone";

export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const [people, headcount, departments] = await Promise.all([
    getPeople(),
    getHeadcountByType(),
    getDepartmentSummary(),
  ]);

  const byId = new Map(people.map((person) => [person.id, person]));

  /** The directory, narrowed by whatever was typed into the search box. */
  const needle = (q ?? "").trim().toLowerCase();
  const matches = needle
    ? people.filter((person) =>
        [person.name, person.email, person.jobTitle, person.department, person.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : people;

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="People"
        actions={
          <>
            <a href="/api/export/people" download>
              <Button variant="secondary" type="button">
                <RiDownloadLine size={18} aria-hidden />
                Export CSV
              </Button>
            </a>
            <InviteMemberButton
              departments={departments.map((department) => department.name)}
              managers={people
                .filter((person) => person.role !== "member")
                .map((person) => ({ id: person.id, name: person.name }))}
            />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {headcount.map((row) => (
          <Card key={row.type} className="p-4">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {employmentLabels[row.type]}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{row.count}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader
          title="Org chart"
          action={<Badge>{departments.length} departments</Badge>}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <p className="text-secondary max-w-150 text-body">
            Set the hierarchy from the CEO through heads of department and managers, and
            see who reports to whom. Everyone can see their own reporting line and team.
          </p>
          <Link href="/org">
            <Button variant="secondary" type="button">
              <RiNodeTree size={18} aria-hidden />
              Open org chart
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Directory"
          action={
            <DirectorySearch initial={q ?? ""} label="Search people" />
          }
        />
        <Table>
          <Thead
            columns={["Member", "Department", "Type", "Access", "Manager", "Started", "Status"]}
          />
          <tbody>
            {matches.map((person) => (
              <Tr key={person.id}>
                <Td>
                  <span className="flex items-center gap-2.5">
                    <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {initials(person.name)}
                    </span>
                    <span className="min-w-0">
                      <Link
                        href={`/people/${person.id}`}
                        className="text-primary hover:text-accent block truncate font-semibold"
                      >
                        {person.name}
                      </Link>
                      <span className="text-muted block truncate text-tiny">{person.email}</span>
                    </span>
                  </span>
                </Td>
                <Td>{person.department ?? "—"}</Td>
                <Td>
                  <Badge>{employmentLabels[person.employmentType]}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{roleLabels[person.role]}</Td>
                <Td className="whitespace-nowrap">
                  {person.managerId ? (byId.get(person.managerId)?.name ?? "—") : "—"}
                </Td>
                <Td className="whitespace-nowrap">{person.startDate ?? "—"}</Td>
                <Td>
                  <Badge tone={statusTone(person.status)} className="capitalize">
                    {person.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {matches.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">No one matches “{q}”.</p>
        ) : null}
      </Card>
    </>
  );
}
