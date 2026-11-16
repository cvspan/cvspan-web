import { Avatar } from "@/components/ui/avatar";
import { withBasePath } from "@/lib/base-path";
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
import {
  countByGroup,
  directoryGroup,
  directoryGroupLabels,
  directoryGroups,
  directoryStatusLabels,
  isDirectoryGroup,
} from "@/lib/directory";
import { employmentLabels, relativeDays } from "@/lib/format";
import { ENGAGEMENTS, accessSummary } from "@/lib/roles";
import { statusTone } from "@/lib/tone";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>;
}) {
  const user = await requireUser();
  const { q, group: groupParam } = await searchParams;
  const group = isDirectoryGroup(groupParam) ? groupParam : "all";
  const [people, headcount, departments] = await Promise.all([
    getPeople(),
    getHeadcountByType(),
    getDepartmentSummary(),
  ]);

  const byId = new Map(people.map((person) => [person.id, person]));

  /** The directory, narrowed by whatever was typed into the search box. */
  const counts = countByGroup(people);
  const inGroup = group === "all" ? people : people.filter((person) => directoryGroup(person) === group);
  const needle = (q ?? "").trim().toLowerCase();
  const matches = needle
    ? inGroup.filter((person) =>
        [person.name, person.email, person.jobTitle, person.department, person.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : inGroup;

  /** A tab link that keeps the search text but resets to the chosen group. */
  const tabHref = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("group", key);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/people?${qs}` : "/people";
  };
  const tabs = [
    { key: "all", label: "Everyone", count: people.length },
    ...directoryGroups.map((key) => ({ key, label: directoryGroupLabels[key], count: counts[key] })),
  ];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="People"
        actions={
          <>
            <a href={withBasePath("/api/export/people")} download>
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
              viewerRole={user.role}
            />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headcount.filter((row) => (ENGAGEMENTS as readonly string[]).includes(row.type)).map((row) => (
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
        <nav
          aria-label="Filter by status"
          className="border-line flex flex-wrap gap-1 border-b px-4 py-2.5"
        >
          {tabs
            .filter((tab) => tab.key === "all" || tab.count > 0 || tab.key === group)
            .map((tab) => (
              <Link
                key={tab.key}
                href={tabHref(tab.key)}
                aria-current={group === tab.key ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-caption font-semibold transition-colors",
                  group === tab.key ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary",
                )}
              >
                {tab.label} <span className="font-normal">{tab.count}</span>
              </Link>
            ))}
        </nav>
        <Table>
          <Thead
            columns={["Member", "Department", "Type", "Access", "Manager", "Started", "Status"]}
          />
          <tbody>
            {matches.map((person) => (
              <Tr key={person.id}>
                <Td>
                  <span className="flex items-center gap-2.5">
                    <Avatar name={person.name} src={person.avatarUrl} />
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
                <Td className="whitespace-nowrap">{accessSummary({ role: person.access, isHr: person.isHr, isManagement: person.isManagement })}</Td>
                <Td className="whitespace-nowrap">
                  {person.managerId ? (byId.get(person.managerId)?.name ?? "—") : "—"}
                </Td>
                <Td className="whitespace-nowrap">
                  {person.startDate ?? "—"}
                  {person.endDate && directoryGroup(person) !== "active" ? (
                    <span className="text-muted block text-tiny">Ended {person.endDate}</span>
                  ) : person.startDate && person.startDate > today ? (
                    <span className="text-muted block text-tiny">Starts {relativeDays(person.startDate)}</span>
                  ) : null}
                </Td>
                <Td>
                  <Badge tone={statusTone(person.status)}>{directoryStatusLabels[directoryGroup(person)]}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {matches.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">
            {q ? `No one matches “${q}”.` : "No one in this group yet."}
          </p>
        ) : null}
      </Card>
    </>
  );
}
