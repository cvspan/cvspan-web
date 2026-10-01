import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OrgEditProvider, type EditContext } from "@/components/org/edit-position";
import { OrgTree } from "@/components/org/org-tree";
import { PersonRow } from "@/components/org/person-row";
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
  reportingLine,
  type Level,
} from "@/lib/org";
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

  const isAdmin = atLeast(user.viewRole, "admin");
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
        <CompanyView people={people} byManager={byManager} youId={user.id} linkProfiles={linkProfiles} />
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
  byManager,
  youId,
  linkProfiles,
}: {
  people: Awaited<ReturnType<typeof getOrgPeople>>;
  byManager: ReturnType<typeof childrenMap<Awaited<ReturnType<typeof getOrgPeople>>[number]>>;
  youId: string;
  linkProfiles: boolean;
}) {
  const { roots, unplaced } = chartRoots(people);
  const issues = hierarchyIssues(people);

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
            <OrgTree nodes={roots} byManager={byManager} youId={youId} canEdit linkProfiles={linkProfiles} />
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
            <OrgTree nodes={unplaced} byManager={byManager} youId={youId} canEdit linkProfiles={linkProfiles} />
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
          You aren&apos;t in the org chart yet. An admin can place you.
        </p>
      </Card>
    );
  }

  /** From the top of the organisation down to you. */
  const above = reportingLine(me.id, byId).reverse();
  const manager = me.managerId ? byId.get(me.managerId) : undefined;
  const colleagues = manager ? (byManager.get(manager.id) ?? []).filter((person) => person.id !== me.id) : [];
  const mine = byManager.get(me.id) ?? [];

  const departmentHead = me.departmentName
    ? people.find((person) => person.headOf.includes(me.departmentName!))
    : undefined;
  const link = (id: string) => (linkProfiles || id === me.id ? `/people/${id}` : undefined);

  return (
    <>
      <Card>
        <CardHeader title="Your reporting line" action={<Badge>{above.length === 0 ? "Top of the organisation" : `${above.length} above you`}</Badge>} />
        <div className="p-5">
          {above.length === 0 && !me.managerId ? (
            <p className="text-muted mb-4 text-body">
              {me.orgLevel === "ceo"
                ? "You are at the top of the organisation."
                : "You don't have a reporting line yet. An admin sets this from the org chart."}
            </p>
          ) : null}

          <ol aria-label="From the top of the organisation down to you">
            {[...above, me].map((person, index, line) => (
              <li key={person.id} className="relative">
                <PersonRow
                  person={person}
                  you={person.id === me.id}
                  emphasis={departmentHead?.id === person.id && person.id !== me.id}
                  href={link(person.id)}
                />
                {index < line.length - 1 ? (
                  <span aria-hidden className="bg-line mx-auto my-0 block h-4 w-px" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Card>

      <section className="grid items-start gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Your department" action={me.departmentName ? <Badge>{me.departmentName}</Badge> : null} />
          <div className="flex flex-col gap-3 p-5">
            {!me.departmentName ? (
              <p className="text-muted text-body">You aren&apos;t in a department yet.</p>
            ) : departmentHead ? (
              <>
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Head of department</p>
                <PersonRow person={departmentHead} you={departmentHead.id === me.id} href={link(departmentHead.id)} />
              </>
            ) : (
              <p className="text-muted text-body">{me.departmentName} doesn&apos;t have a head set yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title={manager ? `Your team under ${manager.name.split(" ")[0]}` : "Your colleagues"}
            action={<Badge>{pluralise(colleagues.length, "colleague")}</Badge>}
          />
          <div className="flex flex-col gap-2 p-5">
            {colleagues.length === 0 ? (
              <p className="text-muted text-body">
                {manager ? "No one else reports to your manager." : "Colleagues appear once you have a manager."}
              </p>
            ) : (
              colleagues.map((person) => (
                <PersonRow key={person.id} person={person} href={link(person.id)} />
              ))
            )}
          </div>
        </Card>
      </section>

      {mine.length > 0 ? (
        <Card>
          <CardHeader
            title="People who report to you"
            action={<Badge>{pluralise(descendantIds(me.id, byManager).size, "person", "people")} in your team</Badge>}
          />
          <div className="p-5">
            <OrgTree nodes={mine} byManager={byManager} linkProfiles={linkProfiles} />
          </div>
        </Card>
      ) : null}
    </>
  );
}
