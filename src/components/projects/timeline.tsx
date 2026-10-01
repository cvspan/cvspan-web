import { formatDay } from "@/lib/format";
import {
  milestoneStatusLabels,
  monthTicks,
  percentAlong,
  type MilestoneStatus,
  type TimelineRange,
} from "@/lib/project";

type TimelineMilestone = {
  id: string;
  title: string;
  startDate: string | null;
  dueDate: string;
  status: MilestoneStatus;
};

/**
 * Gantt-style view of a project: the overall window, then one row per milestone, with today
 * marked. It is a visual summary only; the milestone table beside it is the accessible
 * equivalent, so the chart itself is hidden from assistive tech.
 */
export function Timeline({
  range,
  projectStart,
  projectTarget,
  milestones,
  today,
}: {
  range: TimelineRange;
  projectStart: string | null;
  projectTarget: string | null;
  milestones: TimelineMilestone[];
  today: string;
}) {
  const ticks = monthTicks(range);
  const showToday = today >= range.start && today <= range.end;
  const todayPercent = percentAlong(range, today);

  return (
    <div className="overflow-x-auto" aria-hidden>
      <div className="min-w-120 px-5 pt-3 pb-5">
        {/* Month axis */}
        <div className="grid grid-cols-[11rem_1fr] gap-4">
          <span />
          <div className="border-line relative h-6 border-b">
            {ticks.map((tick) => (
              <span
                key={tick.label}
                className="text-muted absolute top-0 text-tiny font-semibold"
                style={{ left: `${tick.percent}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Gridlines and today marker sit behind the rows */}
          <div className="pointer-events-none absolute inset-y-0 right-0 left-[12rem]">
            {ticks.map((tick) => (
              <span
                key={tick.label}
                className="bg-line absolute inset-y-0 w-px"
                style={{ left: `${tick.percent}%` }}
              />
            ))}
            {showToday ? (
              <span
                className="absolute inset-y-0 z-10 w-0.5 bg-[var(--cv-error-3)]"
                style={{ left: `${todayPercent}%` }}
              >
                <span className="absolute -top-1 left-1 rounded bg-[var(--cv-error-3)] px-1 text-tiny font-semibold text-white">
                  Today
                </span>
              </span>
            ) : null}
          </div>

          {projectStart && projectTarget ? (
            <Row label="Project" sub={`${formatDay(projectStart)} – ${formatDay(projectTarget)}`}>
              <span
                className="bg-accent-soft border-brand absolute top-1/2 h-3 -translate-y-1/2 rounded-full border"
                style={{
                  left: `${percentAlong(range, projectStart)}%`,
                  width: `${Math.max(percentAlong(range, projectTarget) - percentAlong(range, projectStart), 1)}%`,
                }}
              />
            </Row>
          ) : null}

          {milestones.map((milestone) => {
            const overdue = milestone.status !== "done" && milestone.dueDate < today;
            const colour =
              milestone.status === "done"
                ? "bg-[var(--cv-success-3)]"
                : overdue
                  ? "bg-[var(--cv-error-3)]"
                  : milestone.status === "in_progress"
                    ? "bg-brand"
                    : "bg-line-strong";
            const title = `${milestone.title} · ${milestoneStatusLabels[milestone.status]}${overdue ? " · overdue" : ""}`;

            return (
              <Row
                key={milestone.id}
                label={milestone.title}
                sub={`Due ${formatDay(milestone.dueDate)}`}
              >
                {milestone.startDate ? (
                  <span
                    title={title}
                    className={`absolute top-1/2 h-5 -translate-y-1/2 rounded-md ${colour}`}
                    style={{
                      left: `${percentAlong(range, milestone.startDate)}%`,
                      width: `${Math.max(percentAlong(range, milestone.dueDate) - percentAlong(range, milestone.startDate), 1.5)}%`,
                    }}
                  />
                ) : (
                  /* No start date: a single-day marker on the due date */
                  <span
                    title={title}
                    className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs ${colour}`}
                    style={{ left: `${percentAlong(range, milestone.dueDate)}%` }}
                  />
                )}
              </Row>
            );
          })}
        </div>

        <Legend />
      </div>
    </div>
  );
}

function Row({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line grid grid-cols-[11rem_1fr] gap-4 border-b py-2 last:border-b-0">
      <span className="min-w-0">
        <span className="text-primary block truncate text-caption font-semibold">{label}</span>
        <span className="text-muted block truncate text-tiny">{sub}</span>
      </span>
      <span className="relative block h-8">{children}</span>
    </div>
  );
}

function Legend() {
  const items = [
    ["bg-[var(--cv-success-3)]", "Done"],
    ["bg-brand", "In progress"],
    ["bg-line-strong", "Not started"],
    ["bg-[var(--cv-error-3)]", "Overdue"],
  ];
  return (
    <ul className="text-muted mt-3 flex flex-wrap gap-4 text-tiny">
      {items.map(([colour, label]) => (
        <li key={label} className="flex items-center gap-1.5">
          <span className={`size-2.5 rounded-xs ${colour}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
