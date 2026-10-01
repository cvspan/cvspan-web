import { ratingTone } from "@/lib/grading";
import { cn } from "@/lib/utils";

const fills = {
  success: "bg-[var(--cv-success-3)]",
  accent: "bg-brand",
  warning: "bg-[var(--cv-warning-3)]",
  error: "bg-[var(--cv-error-3)]",
} as const;

/** Overall rating per week, oldest to newest. A week with no review is left empty. */
export function WeeklyTrend({ points }: { points: { label: string; value: number | null }[] }) {
  return (
    <div className="flex h-40 items-end gap-3 px-5 pt-4 pb-4">
      {points.map((point) => (
        <div key={point.label} className="flex h-full min-w-0 flex-1 flex-col items-center gap-1.5">
          <span className="text-secondary text-tiny font-semibold">
            {point.value === null ? "" : point.value.toFixed(1)}
          </span>
          <span className="bg-raised flex w-full max-w-10 flex-1 items-end overflow-hidden rounded-md">
            {point.value === null ? null : (
              <span
                role="img"
                aria-label={`${point.label}: ${point.value} out of 5`}
                className={cn("w-full rounded-md", fills[ratingTone(point.value)])}
                style={{ height: `${(point.value / 5) * 100}%` }}
              />
            )}
          </span>
          <span className="text-muted truncate text-tiny">{point.label}</span>
        </div>
      ))}
    </div>
  );
}
