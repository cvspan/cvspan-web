import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OrgEditProvider, type EditContext } from "@/components/org/edit-position";
import { OrgChart } from "@/components/org/org-chart";
import { getOrgPeople } from "@/db/queries-org";
import { pluralise } from "@/lib/format";
import {
  chartRoots,
  childrenMap,
  descendantIds,
  hierarchyIssues,
  indexPeople,
  levelOf,
  levelRank,
  type Level,
} from "@/lib/org";
import { buildChart, focusRoots } from "@/lib/org-chart";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Org chart · CVSpan Portal" };

const levelsInOrder: Level[] = ["ceo", "head", "manager", "member"];

const levelPlurals: Record<Level, string> = {
  ceo: "CEO",
  head: "Department heads",
  manager: "Managers",
  member: "Members",
};

export default async function OrgPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const user = await requireUser();
  const { view } = await searchParams;

  const people = await getOrgPeople();
  const byId = indexPeople(people);
  const byManager = childrenMap(people);
  const me = byId.get(user.id) ?? null;

  const isAdmin = atLeast(user.viewRole, "hr");
  const showCompany = isAdmin && view !== "mine";
  /** Managers and above may open other people's profiles; members only see names. */
  const linkProfiles = atLeast(user.viewRole, "manager");

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="Org chart"
        actions={
          isAdmin ? (
            <nav aria-label="Org chart view" className="flex gap-1">
              {[
                { key: "company", label: "Company", active: showCompany, href: "/org" },
                { key: "mine", label: "My place", active: !showCompany, href: "/org?view=mine" },
              ].map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-body font-semibold transition-colors",
                    tab.active ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          ) : null
        }
      />

      {showCompany ? (
        <CompanyView people={people} byId={byId} byManager={byManager} youId={user.id} linkProfiles={linkProfiles} />
      ) : (
        <MyPlace
          me={me}
          people={people}
          byId={byId}
          byManager={byManager}
          linkProfiles={linkProfiles}
        />
      )}
    </>
  );
}

/* ----------------------------------------------------------------- Company */

function CompanyView({
  people,
  byId,
  byManager,
  youId,
  linkProfiles,
}: {
  people: Awaited<ReturnType<typeof getOrgPeople>>;
  byId: ReturnType<typeof indexPeople<Awaited<ReturnType<typeof getOrgPeople>>[number]>>;
  byManager: ReturnType<typeof childrenMap<Awaited<ReturnType<typeof getOrgPeople>>[number]>>;
  youId: string;
  linkProfiles: boolean;
}) {
  const { roots, unplaced } = chartRoots(people);
  const issues = hierarchyIssues(people);
  const chart = buildChart(roots, byManager, byId, { youId }, people);
  const unplacedChart = buildChart(unplaced, byManager, byId, { youId }, people);

  const counts = levelsInOrder.map((level) => ({
    level,
    count: people.filter((person) => levelOf(person) === level).length,
  }));

  /** What the edit form needs to narrow its choices; the server checks every rule again. */
  const ceo = people.find((person) => person.orgLevel === "ceo");
  const context: EditContext = {
    eligible: people
      .filter((person) => atLeast(person.role, "manager"))
      .map((person) => ({
        id: person.id,
        name: person.name,
        title: person.jobTitle,
        rank: levelRank[levelOf(person)],
      })),
    descendants: Object.fromEntries(
      people.map((person) => [person.id, [...descendantIds(person.id, byManager)]]),
    ),
    ceo: ceo ? { id: ceo.id, name: ceo.name } : null,
    departmentHeads: Object.fromEntries(
      people.flatMap((person) =>
        person.headOf.length > 0 && person.departmentId
          ? [[person.departmentId, { id: person.id, name: person.name }] as const]
          : [],
      ),
    ),
  };

  return (
    <OrgEditProvider value={context}>
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.level} className="p-4">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {levelPlurals[item.level]}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.count}</p>
          </Card>
        ))}
      </section>

      {issues.length > 0 ? (
        <Card className="border-[var(--status-warning-border)]">
          <CardHeader title="Needs attention" action={<Badge tone="warning">{pluralise(issues.length, "issue")}</Badge>} />
          <ul className="flex flex-col gap-1.5 p-5 text-body">
            {issues.map((issue) => (
              <li key={`${issue.kind}-${issue.personIds.join(",")}`} className="text-secondary">
                {issue.message}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Organisation" action={<Badge>{pluralise(people.length, "person", "people")}</Badge>} />
        <div className="p-5">
          {roots.length === 0 ? (
            <p className="text-muted text-body">
              No one is at the top yet. Edit someone and set their level to CEO or Executive.
            </p>
          ) : (
            <OrgChart nodes={chart} youId={youId} canEdit linkProfiles={linkProfiles} />
          )}
        </div>
      </Card>

      {unplaced.length > 0 ? (
        <Card>
          <CardHeader title="Not placed yet" action={<Badge tone="warning">{unplaced.length}</Badge>} />
          <p className="text-secondary px-5 pt-4 text-body">
            These people have no reporting line. Choose Edit and set who they report to.
          </p>
          <div className="p-5">
            <OrgChart nodes={unplacedChart} youId={youId} canEdit linkProfiles={linkProfiles} />
          </div>
        </Card>
      ) : null}
    </OrgEditProvider>
  );
}

/* ---------------------------------------------------------------- My place */

function MyPlace({
  me,
  people,
  byId,
  byManager,
  linkProfiles,
}: {
  me: Awaited<ReturnType<typeof getOrgPeople>>[number] | null;
  people: Awaited<ReturnType<typeof getOrgPeople>>;
  byId: ReturnType<typeof indexPeople<Awaited<ReturnType<typeof getOrgPeople>>[number]>>;
  byManager: ReturnType<typeof childrenMap<Awaited<ReturnType<typeof getOrgPeople>>[number]>>;
  linkProfiles: boolean;
}) {
  if (!me) {
    return (
      <Card>
        <p className="text-muted px-5 py-10 text-center text-body">
          You aren&apos;t in the org chart yet. HR or an admin can place you.
        </p>
      </Card>
    );
  }

  const manager = me.managerId ? byId.get(me.managerId) : undefined;
  const departmentHead = me.departmentName
    ? people.find((person) => person.headOf.includes(me.departmentName!))
    : undefined;
  const teammates = manager ? (byManager.get(manager.id) ?? []).filter((person) => person.id !== me.id).length : 0;
  const myTeam = descendantIds(me.id, byManager).size;

  const roots = focusRoots(me.id, byId, chartRoots(people).roots);
  const chart = buildChart(roots, byManager, byId, { youId: me.id, focus: true }, people);

  const facts = [
    { label: "You report to", value: manager?.name ?? (me.orgLevel === "ceo" ? "No one, you lead the company" : "Not set yet"), note: manager?.jobTitle },
    {
      label: "Head of your department",
      value: departmentHead ? (departmentHead.id === me.id ? "You" : departmentHead.name) : me.departmentName ? "Not set yet" : "No department yet",
      note: me.departmentName,
    },
    { label: "Your teammates", value: String(teammates), note: manager ? `Also report to ${manager.name.split(" ")[0]}` : undefined },
    { label: "Your team", value: String(myTeam), note: myTeam === 0 ? "No one reports to you" : "People under you" },
  ];

  return (
    <>
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Where you sit">
        {facts.map((fact) => (
          <Card key={fact.label} className="p-4">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">{fact.label}</p>
            <p className="text-primary mt-1 truncate text-title font-semibold">{fact.value}</p>
            {fact.note ? <p className="text-muted truncate text-caption">{fact.note}</p> : null}
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Where you fit" action={<Badge>{me.departmentName ?? "No department"}</Badge>} />
        <div className="p-5">
          <p className="text-muted mb-4 text-body">
            The CEO and every department head, your manager, everyone in your department and anyone who reports to
            you.
          </p>
          <OrgChart nodes={chart} youId={me.id} linkProfiles={linkProfiles} showLegend />
        </div>
      </Card>
    </>
  );
}
