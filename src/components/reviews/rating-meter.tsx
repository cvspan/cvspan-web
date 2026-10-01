import { ratingTone } from "@/lib/grading";
import { cn } from "@/lib/utils";

const fills = {
  success: "bg-[var(--cv-success-3)]",
  accent: "bg-brand",
  warning: "bg-[var(--cv-warning-3)]",
  error: "bg-[var(--cv-error-3)]",
} as const;

/**
 * Five segments filled to a rating. Fractions fill part of a segment, so an average of 4.3 reads
 * as 4.3 rather than being rounded to a whole point.
 */
export function RatingMeter({
  value,
  className,
  size = "md",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const fill = fills[ratingTone(value)];

  return (
    <span
      role="img"
      aria-label={`${value} out of 5`}
      className={cn("flex gap-1", className)}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={cn("bg-raised relative overflow-hidden rounded-full", size === "sm" ? "h-1.5 w-5" : "h-2 w-8")}
        >
          <span
            className={cn("absolute inset-y-0 left-0 rounded-full", fill)}
            style={{ width: `${Math.min(1, Math.max(0, value - index)) * 100}%` }}
          />
        </span>
      ))}
    </span>
  );
}
