import { RiCheckLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
  lifecycleStages,
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/project";
import { cn } from "@/lib/utils";

/**
 * Where a project is in its lifecycle: Not started → Planning → Design → Development → Live.
 * On hold and cancelled sit outside that path, so they are shown as a badge with the path faded.
 */
export function StageTracker({ status }: { status: ProjectStatus }) {
  const outsidePath = status === "on_hold" || status === "cancelled";
  const current = lifecycleStages.indexOf(status as (typeof lifecycleStages)[number]);

  return (
    <div className="flex flex-col gap-2">
      <ol
        aria-label="Project stage"
        className={cn("flex items-center gap-1", outsidePath && "opacity-40")}
      >
        {lifecycleStages.map((stage, index) => {
          const done = !outsidePath && index < current;
          const active = !outsidePath && index === current;

          return (
            <li
              key={stage}
              aria-current={active ? "step" : undefined}
              className="flex min-w-0 flex-1 flex-col gap-1.5"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  done || (active && stage === "live")
                    ? "bg-[var(--cv-success-3)]"
                    : active
                      ? "bg-brand"
                      : "bg-raised",
                )}
              />
              {/* Five labels don't fit on a phone, so there the line below names the stage instead. */}
              <span
                className={cn(
                  "hidden items-center gap-1 truncate text-tiny sm:flex",
                  active ? "text-primary font-semibold" : "text-muted",
                )}
              >
                {done ? <RiCheckLine size={12} aria-hidden /> : null}
                {projectStatusLabels[stage]}
              </span>
            </li>
          );
        })}
      </ol>
      {!outsidePath && current >= 0 ? (
        <p className="text-primary text-caption font-semibold sm:hidden">
          {projectStatusLabels[status]}
          <span className="text-muted font-normal"> · stage {current + 1} of {lifecycleStages.length}</span>
        </p>
      ) : null}
      {outsidePath ? (
        <Badge tone={status === "on_hold" ? "warning" : "neutral"} className="w-fit">
          {projectStatusLabels[status]}
        </Badge>
      ) : null}
    </div>
  );
}
