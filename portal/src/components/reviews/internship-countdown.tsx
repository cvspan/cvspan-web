import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { addMonths, daysBetween } from "@/lib/dates";
import { pluralise } from "@/lib/format";
import { type InternshipWindow } from "@/lib/grading";
import { formatDay } from "@/lib/format";

const formatLong = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** An intern's countdown to the end of their programme: the bar fills as the months go by. */
export function InternshipCountdown({ window, name }: { window: InternshipWindow; name?: string }) {
  const { status, percent, daysLeft, weekNumber, totalWeeks, start, end, totalDays } = window;

  /** A marker where each month of the programme ends. */
  const months: number[] = [];
  for (let month = 1; ; month++) {
    const marker = addMonths(start, month);
    if (marker >= end) break;
    months.push((daysBetween(start, marker) / totalDays) * 100);
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
            {name ? `${name}'s internship` : "My internship"}
          </p>
          <p className="text-primary mt-1 text-h5 font-semibold">
            {status === "completed"
              ? "Programme complete"
              : status === "upcoming"
                ? `Starts ${formatDay(start)}`
                : `${pluralise(daysLeft, "day")} to go`}
          </p>
        </div>
        <Badge tone={status === "completed" ? "success" : status === "upcoming" ? "neutral" : "accent"}>
          {status === "completed"
            ? "Completed"
            : status === "upcoming"
              ? "Not started"
              : `Week ${weekNumber} of ${totalWeeks}`}
        </Badge>
      </div>

      <div className="mt-5">
        <div
          className="bg-raised relative h-3 overflow-hidden rounded-full"
          role="progressbar"
          aria-label="Internship progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full ${status === "completed" ? "bg-[var(--cv-success-3)]" : "bg-brand"}`}
            style={{ width: `${percent}%` }}
          />
          {months.map((position) => (
            <span
              key={position}
              aria-hidden
              className="bg-card absolute inset-y-0 w-0.5 opacity-70"
              style={{ left: `${position}%` }}
            />
          ))}
        </div>
        <div className="text-muted mt-2 flex justify-between text-tiny">
          <span>{formatLong.format(new Date(start))}</span>
          <span className="text-primary font-semibold">{percent}% complete</span>
          <span>{formatLong.format(new Date(end))}</span>
        </div>
      </div>
    </Card>
  );
}
