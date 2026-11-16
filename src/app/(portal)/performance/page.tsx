import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { PerformanceTabs } from "@/components/portal/performance-tabs";
import {
  DeleteObjectiveButton,
  NewCycleButton,
  ObjectiveButton,
  ProgressInput,
  SubmitObjectivesButton,
  WithdrawButton,
} from "@/components/forms/objective-forms";
import { getCycles, getObjectivesFor, getSupervisorFor, type ObjectiveView } from "@/db/queries-objectives";
import { companyDay } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import {
  TOTAL_WEIGHT,
  isEditable,
  keyResultProgress,
  objectiveProgress,
  objectiveStatusLabels,
  objectiveStatusTones,
  overallProgress,
  pickCycle,
  progressTone,
  setStatus,
  submissionProblem,
  type ObjectiveStatus,
} from "@/lib/objectives";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Performance" };

const progressBar = (percent: number) => (progressTone(percent) === "success" ? "success" : "brand");

function ObjectiveCard({
  objective,
  cycleId,
  maxWeight,
}: {
  objective: ObjectiveView;
  cycleId: string;
  maxWeight: number;
}) {
  const status = objective.status as ObjectiveStatus;
  const percent = objectiveProgress(objective.keyResults);
  const approved = status === "approved";

  return (
    <Card>
      <CardHeader
        title={objective.title}
        action={
          <span className="flex items-center gap-2">
            <Badge>{objective.weight}% weight</Badge>
            <Badge tone={objectiveStatusTones[status]}>{objectiveStatusLabels[status]}</Badge>
          </span>
        }
      />
      <div className="px-5 py-4">
        {objective.description ? <p className="text-secondary mb-4 text-body">{objective.description}</p> : null}

        {approved ? (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-primary w-12 text-caption font-semibold">{percent}%</span>
            <Progress value={percent} tone={progressBar(percent)} label={`${objective.title} progress`} />
          </div>
        ) : null}

        <ul className="divide-line divide-y">
          {objective.keyResults.map((kr) => {
            const krPercent = keyResultProgress(kr);
            return (
              <li key={kr.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                <span className="min-w-52 flex-1">
                  <span className="text-primary block text-body">{kr.title}</span>
                  <span className="text-muted block text-tiny">
                    {approved ? `${kr.current} of ${kr.target}` : `Target ${kr.target}`}
                    {kr.unit ? ` ${kr.unit}` : ""}
                  </span>
                </span>
                {approved ? (
                  <>
                    <span className="w-32">
                      <Progress value={krPercent} tone={progressBar(krPercent)} label={`${kr.title} progress`} />
                    </span>
                    <ProgressInput keyResultId={kr.id} current={kr.current} label={kr.title} />
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {isEditable(status) ? (
        <div className="border-line flex items-center justify-end gap-2 border-t px-5 py-3">
          <DeleteObjectiveButton objectiveId={objective.id} title={objective.title} />
          <ObjectiveButton
            cycleId={cycleId}
            maxWeight={maxWeight}
            objective={{
              id: objective.id,
              title: objective.title,
              description: objective.description,
              weight: objective.weight,
              keyResults: objective.keyResults.map((kr) => ({ title: kr.title, target: kr.target, unit: kr.unit })),
              updatedAt: `${objective.createdAt.toISOString()}-${objective.weight}-${objective.title}-${objective.keyResults.length}`,
            }}
          />
        </div>
      ) : null}
    </Card>
  );
}

export default async function PerformancePage({ searchParams }: { searchParams: Promise<{ cycle?: string }> }) {
  const { cycle: wanted } = await searchParams;
  const user = await requireUser();
  const isAdmin = atLeast(user.viewRole, "hr");
  const canReview = atLeast(user.viewRole, "manager");

  const cycles = await getCycles();
  const cycle = pickCycle(cycles, companyDay(), wanted);

  if (!cycle) {
    return (
      <>
        <PageHeader pretitle="Performance" title="Performance" actions={isAdmin ? <NewCycleButton /> : null} />
        <PerformanceTabs active="objectives" canReview={canReview} />
        <Card>
          <p className="text-muted px-5 py-10 text-center text-body">
            {isAdmin
              ? "No performance cycle yet. Create one, such as a quarter, so people can set their objectives."
              : "There is no performance cycle yet. Objectives open once an admin creates one."}
          </p>
        </Card>
      </>
    );
  }

  const [items, supervisor] = await Promise.all([getObjectivesFor(user.id, cycle.id), getSupervisorFor(user.id)]);

  const ended = cycle.endDate < companyDay();
  const used = items.reduce((sum, item) => sum + item.weight, 0);
  const status = setStatus(items.map((item) => item.status as ObjectiveStatus));
  const problem = submissionProblem(
    items.map((item) => ({ title: item.title, weight: item.weight, keyResultCount: item.keyResults.length })),
  );
  const hasEditable = items.some((item) => isEditable(item.status as ObjectiveStatus));
  const sentBack = items.find((item) => item.status === "changes_requested");
  const awaiting = items.some((item) => item.status === "submitted");
  const progress = overallProgress(items.filter((item) => item.status === "approved"));

  const reviewer = supervisor?.name
    ? `${supervisor.name}${supervisor.isHead ? ", head of your department" : ", your manager"}`
    : "an admin";

  return (
    <>
      <PageHeader
        pretitle="Performance"
        title="Performance"
        actions={
          <>
            {isAdmin ? <NewCycleButton /> : null}
            {!ended && hasEditable ? <ObjectiveButton cycleId={cycle.id} maxWeight={TOTAL_WEIGHT - used} /> : null}
            {!ended && hasEditable ? <SubmitObjectivesButton cycleId={cycle.id} disabled={Boolean(problem)} /> : null}
            {!ended && items.length === 0 ? <ObjectiveButton cycleId={cycle.id} maxWeight={TOTAL_WEIGHT} /> : null}
          </>
        }
      />

      <PerformanceTabs active="objectives" canReview={canReview} cycle={cycle.id} />

      {cycles.length > 1 ? (
        <nav aria-label="Cycle" className="flex flex-wrap gap-1">
          {cycles.map((item) => (
            <Link
              key={item.id}
              href={`/performance?cycle=${item.id}`}
              aria-current={item.id === cycle.id ? "page" : undefined}
              className={cn(
                "rounded-lg px-2.5 py-1 text-caption font-semibold transition-colors",
                item.id === cycle.id ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Cycle</p>
          <p className="text-primary mt-1 text-h5 font-semibold">{cycle.name}</p>
          <p className="text-muted mt-1 text-caption">
            {formatDay(cycle.startDate)} to {formatDay(cycle.endDate)}
            {ended ? " · ended" : ""}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Overall progress</p>
          <p className="text-primary mt-1 text-h5 font-semibold">{status === "approved" ? `${progress}%` : "—"}</p>
          <p className="text-muted mt-1 text-caption">
            {status === "approved" ? "Weighted across your objectives" : "Starts once your objectives are approved"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Weights used</p>
          <p className="text-primary mt-1 text-h5 font-semibold">
            {used}% <span className="text-muted text-body font-normal">of {TOTAL_WEIGHT}%</span>
          </p>
          <p className="text-muted mt-1 text-caption">{used === TOTAL_WEIGHT ? "Ready to submit" : `${TOTAL_WEIGHT - used}% still to allocate`}</p>
        </Card>
        <Card className="p-5">
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Status</p>
          <p className="mt-2">{status ? <Badge tone={objectiveStatusTones[status]}>{objectiveStatusLabels[status]}</Badge> : <Badge>Not started</Badge>}</p>
          <p className="text-muted mt-1 text-caption">Reviewed by {reviewer}</p>
        </Card>
      </section>

      {sentBack ? (
        <Card className="border-warning-border bg-warning-surface">
          <div className="p-5">
            <p className="text-warning-text text-body font-semibold">Changes requested</p>
            <p className="text-warning-text mt-1 text-body">{sentBack.reviewNote ?? "Your supervisor asked for changes."}</p>
            <p className="text-warning-text mt-1 text-caption">Update your objectives, then submit them again.</p>
          </div>
        </Card>
      ) : null}

      {awaiting ? (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-secondary text-body">Your objectives are with {reviewer}. You can withdraw them to make changes before they are reviewed.</p>
            <WithdrawButton cycleId={cycle.id} />
          </div>
        </Card>
      ) : null}

      {hasEditable && problem && items.length > 0 ? <p className="text-muted -mt-2 text-caption">{problem}</p> : null}

      {items.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <p className="text-primary text-body font-semibold">No objectives for {cycle.name} yet</p>
            <p className="text-muted max-w-120 text-body">
              Set the outcomes you will work towards, each with key results you can measure. {reviewer} reviews them before you start tracking progress.
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <ObjectiveCard key={item.id} objective={item} cycleId={cycle.id} maxWeight={TOTAL_WEIGHT - used + item.weight} />
          ))}
        </div>
      )}
    </>
  );
}
