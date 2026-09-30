import { RiAddLine, RiDownloadLine, RiSearchLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getDepartmentSummary, getHeadcountByType, getPeople } from "@/db/queries";
import { employmentLabels, initials } from "@/lib/format";
import { roleLabels } from "@/lib/roles";
import { statusTone } from "@/lib/tone";

export default async function PeoplePage() {
  const [people, headcount, departments] = await Promise.all([
    getPeople(),
    getHeadcountByType(),
    getDepartmentSummary(),
  ]);

  const byId = new Map(people.map((person) => [person.id, person]));
  const leads = people.filter((person) => person.role === "manager");
  const top = people.find((person) => person.role === "super_admin");

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="People"
        actions={
          <>
            <Button variant="secondary">
              <RiDownloadLine size={18} aria-hidden />
              Export
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              Invite member
            </Button>
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
        <CardHeader title="Org chart" action={<Badge>{departments.length} departments</Badge>} />
        <div className="flex flex-col items-center gap-4 p-6">
          {top ? (
            <span className="border-line bg-accent-soft flex items-center gap-2.5 rounded-lg border px-4 py-2.5">
              <span className="bg-brand text-on-accent flex size-9 items-center justify-center rounded-full text-caption font-semibold">
                {initials(top.name)}
              </span>
              <span>
                <span className="text-primary block text-body font-semibold">{top.name}</span>
                <span className="text-muted block text-tiny">{top.jobTitle}</span>
              </span>
            </span>
          ) : null}

          <span className="bg-line h-6 w-px" aria-hidden />

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {leads.map((lead) => {
              const reports = people.filter((person) => person.managerId === lead.id);
              return (
                <div key={lead.id} className="border-line rounded-lg border p-4">
                  <span className="flex items-center gap-2.5">
                    <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                      {initials(lead.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block truncate text-body font-semibold">
                        {lead.name}
                      </span>
                      <span className="text-muted block truncate text-tiny">{lead.jobTitle}</span>
                    </span>
                  </span>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {reports.length === 0 ? (
                      <li className="text-muted text-tiny">No direct reports</li>
                    ) : (
                      reports.map((report) => (
                        <li
                          key={report.id}
                          className="text-secondary flex items-center gap-2 text-caption"
                        >
                          <span className="bg-raised text-muted flex size-6 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                            {initials(report.name)}
                          </span>
                          <span className="truncate">{report.name}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Directory"
          action={
            <label className="border-line flex h-9 items-center gap-2 rounded-lg border px-2.5">
              <RiSearchLine size={16} className="text-muted" aria-hidden />
              <input
                type="search"
                placeholder="Search people"
                aria-label="Search people"
                className="text-primary placeholder:text-muted w-40 bg-transparent text-caption outline-none"
              />
            </label>
          }
        />
        <Table>
          <Thead
            columns={["Member", "Department", "Type", "Access", "Manager", "Started", "Status"]}
          />
          <tbody>
            {people.map((person) => (
              <Tr key={person.id}>
                <Td>
                  <span className="flex items-center gap-2.5">
                    <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {initials(person.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block truncate font-semibold">
                        {person.name}
                      </span>
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
      </Card>
    </>
  );
}
