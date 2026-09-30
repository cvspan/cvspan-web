import { RiAddLine, RiDownloadLine, RiSearchLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { departments, headcountByType, people, type Tone } from "@/lib/mock-data";

const statusTone: Record<string, Tone> = {
  Active: "success",
  Invited: "warning",
  Alumni: "neutral",
};

/** Two levels is enough to read the shape of the org at a glance. */
function OrgChart() {
  const lead = people.find((person) => person.name === "Seyi Bankole");
  const heads = people.filter((person) =>
    ["Ada Obi", "Tunde Ke", "Ngozi Uche", "Kemi Lawal"].includes(person.name),
  );

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {lead ? (
        <span className="border-line bg-accent-soft flex items-center gap-2.5 rounded-lg border px-4 py-2.5">
          <span className="bg-brand text-on-accent flex size-9 items-center justify-center rounded-full text-caption font-semibold">
            {lead.initials}
          </span>
          <span>
            <span className="text-primary block text-body font-semibold">{lead.name}</span>
            <span className="text-muted block text-tiny">{lead.jobTitle}</span>
          </span>
        </span>
      ) : null}

      <span className="bg-line h-6 w-px" aria-hidden />

      <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {heads.map((head) => {
          const reports = people.filter((person) => person.manager === head.name);
          return (
            <div key={head.id} className="border-line rounded-lg border p-4">
              <span className="flex items-center gap-2.5">
                <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                  {head.initials}
                </span>
                <span className="min-w-0">
                  <span className="text-primary block truncate text-body font-semibold">
                    {head.name}
                  </span>
                  <span className="text-muted block truncate text-tiny">{head.jobTitle}</span>
                </span>
              </span>
              <ul className="mt-3 flex flex-col gap-1.5">
                {reports.length === 0 ? (
                  <li className="text-muted text-tiny">No direct reports</li>
                ) : (
                  reports.map((report) => (
                    <li key={report.id} className="text-secondary flex items-center gap-2 text-caption">
                      <span className="bg-raised text-muted flex size-6 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                        {report.initials}
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
  );
}

export default function PeoplePage() {
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
        {headcountByType.map((row) => (
          <Card key={row.type} className="p-4">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {row.type}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{row.count}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Org chart" action={<Badge>{departments.length} departments</Badge>} />
        <OrgChart />
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
            columns={["Member", "Department", "Type", "Manager", "KPI", "Attendance", "Status"]}
          />
          <tbody>
            {people.map((person) => (
              <Tr key={person.id}>
                <Td>
                  <span className="flex items-center gap-2.5">
                    <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {person.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block truncate font-semibold">
                        {person.name}
                      </span>
                      <span className="text-muted block truncate text-tiny">
                        {person.jobTitle}
                      </span>
                    </span>
                  </span>
                </Td>
                <Td>{person.department}</Td>
                <Td>
                  <Badge>{person.employmentType}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{person.manager}</Td>
                <Td>{person.kpi > 0 ? `${person.kpi}%` : "—"}</Td>
                <Td>{person.attendance > 0 ? `${person.attendance}%` : "—"}</Td>
                <Td>
                  <Badge tone={statusTone[person.status]}>{person.status}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
