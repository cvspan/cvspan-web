import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { PerformanceTabs } from "@/components/portal/performance-tabs";
import { ReviewObjectivesButton } from "@/components/forms/objective-forms";
import { getCycles, getTeamObjectives } from "@/db/queries-objectives";
import { companyDay } from "@/lib/dates";
import {
  objectiveProgress,
  objectiveStatusLabels,
  objectiveStatusTones,
  overallProgress,
  pickCycle,
  type ObjectiveStatus,
} from "@/lib/objectives";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Team reviews · Performance" };

export default async function TeamObjectivesPage({ searchParams }: { searchParams: Promise<{ cycle?: string }> }) {
  const { cycle: wanted } = await searchParams;
  const user = await requireUser();
  if (!atLeast(user.viewRole, "manager")) notFound();
  const isAdmin = atLeast(user.viewRole, "hr");

  const cycles = await getCycles();
  const cycle = pickCycle(cycles, companyDay(), wanted);

  const team = cycle ? await getTeamObjectives({ id: user.id, isAdmin }, cycle.id) : [];
  const waiting = team.filter((person) => person.status === "submitted");
  const rest = team.filter((person) => person.status !== "submitted");

  return (
    <>
      <PageHeader pretitle="Performance" title="Performance" />
      <PerformanceTabs active="team" canReview cycle={cycle?.id} />

      {cycles.length > 1 ? (
        <nav aria-label="Cycle" className="flex flex-wrap gap-1">
          {cycles.map((item) => (
            <Link
              key={item.id}
              href={`/performance/team?cycle=${item.id}`}
              aria-current={item.id === cycle?.id ? "page" : undefined}
              className={cn(
                "rounded-lg px-2.5 py-1 text-caption font-semibold transition-colors",
                item.id === cycle?.id ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      ) : null}

      <p className="text-secondary -mt-1 max-w-200 text-body">
        {isAdmin
          ? "Everyone's objectives for the cycle. Supervisors, usually heads of department, review their own people's; you can step in for anyone."
          : "The people whose objectives you review, as their supervisor. Approve a set to start tracking progress, or send it back with what to change."}
      </p>

      <Card>
        <CardHeader title="Waiting for your review" action={<Badge tone={waiting.length ? "warning" : "success"}>{waiting.length}</Badge>} />
        {waiting.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">Nothing to review.</p>
        ) : (
          <ul>
            {waiting.map((person) => (
              <li key={person.id} className="border-line border-b px-5 py-4 last:border-b-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name={person.name} src={person.avatarUrl} size="lg" />
                  <span className="min-w-52 flex-1">
                    <span className="text-primary block text-body font-semibold">{person.name}</span>
                    <span className="text-muted block text-caption">
                      {[person.jobTitle, person.department].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  {cycle ? <ReviewObjectivesButton userId={person.id} cycleId={cycle.id} name={person.name} /> : null}
                </div>
                <ul className="mt-3 flex flex-col gap-2 pl-13">
                  {person.objectives.map((objective) => (
                    <li key={objective.id} className="bg-raised rounded-lg px-3 py-2">
                      <p className="flex items-center justify-between gap-3 text-body">
                        <span className="text-primary font-semibold">{objective.title}</span>
                        <Badge>{objective.weight}%</Badge>
                      </p>
                      <ul className="text-muted mt-1 list-disc pl-5 text-caption">
                        {objective.keyResults.map((kr) => (
                          <li key={kr.id}>
                            {kr.title} · target {kr.target}
                            {kr.unit ? ` ${kr.unit}` : ""}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title={isAdmin ? "Everyone else" : "Your team"} action={<Badge>{rest.length}</Badge>} />
        {rest.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">No one else yet.</p>
        ) : (
          <ul>
            {rest.map((person) => {
              const status = person.status as ObjectiveStatus | null;
              const approved = person.objectives.filter((objective) => objective.status === "approved");
              const percent = overallProgress(approved);
              return (
                <li key={person.id} className="border-line flex flex-wrap items-center gap-3 border-b px-5 py-3 last:border-b-0">
                  <Avatar name={person.name} src={person.avatarUrl} />
                  <span className="min-w-52 flex-1">
                    <span className="text-primary block text-body font-semibold">{person.name}</span>
                    <span className="text-muted block text-caption">
                      {person.objectives.length} objective{person.objectives.length === 1 ? "" : "s"}
                      {approved.length ? ` · ${approved.map((objective) => `${objectiveProgress(objective.keyResults)}%`).join(", ")}` : ""}
                    </span>
                  </span>
                  {status === "approved" ? (
                    <span className="flex w-44 items-center gap-2">
                      <Progress value={percent} tone={percent >= 100 ? "success" : "brand"} label={`${person.name} overall progress`} />
                      <span className="text-primary text-caption font-semibold">{percent}%</span>
                    </span>
                  ) : null}
                  {status ? <Badge tone={objectiveStatusTones[status]}>{objectiveStatusLabels[status]}</Badge> : <Badge>No objectives</Badge>}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
