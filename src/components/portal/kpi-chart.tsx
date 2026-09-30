import { kpiTrend } from "@/lib/mock-data";

const MAX = 100;

export function KpiChart() {
  const latest = kpiTrend[kpiTrend.length - 1];

  return (
    <div className="px-5 pt-5 pb-4">
      <div
        className="flex h-45 items-end gap-5 sm:gap-7"
        role="img"
        aria-label={`KPI score by month. ${kpiTrend
          .map((p) => `${p.month} ${p.score} percent`)
          .join(", ")}.`}
      >
        {kpiTrend.map((point) => (
          <div key={point.month} className="flex h-full flex-1 flex-col justify-end gap-2">
            <span className="text-muted text-center text-tiny">{point.score}</span>
            <div
              className={
                point.month === latest.month
                  ? "bg-brand mx-auto w-full max-w-11 rounded-md"
                  : "bg-[var(--cv-p3)] mx-auto w-full max-w-11 rounded-md"
              }
              style={{ height: `${(point.score / MAX) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-5 sm:gap-7">
        {kpiTrend.map((point) => (
          <span key={point.month} className="text-muted flex-1 text-center text-tiny">
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}
