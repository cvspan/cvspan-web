import { Card } from "./card";
import { Delta } from "./delta";
import { BarSpark, Sparkline } from "./chart";
import type { Tone } from "@/lib/tone";

export function SparkStat({
  label,
  value,
  delta,
  tone,
  spark,
  kind,
  period = "Last 12 weeks",
}: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  spark: number[];
  kind: "line" | "bar";
  period?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2 p-5 pb-3">
        <p className="text-muted text-tiny font-semibold tracking-wide uppercase">{label}</p>
        <span className="text-muted text-tiny whitespace-nowrap">{period}</span>
      </div>
      <p className="flex items-center gap-2 px-5 pb-3">
        <span className="text-primary text-h5 font-semibold">{value}</span>
        <Delta value={delta} tone={tone} />
      </p>
      {kind === "line" ? (
        <Sparkline points={spark} label={`${label} trend`} />
      ) : (
        <div className="px-5 pb-5">
          <BarSpark points={spark} label={`${label} trend`} />
        </div>
      )}
    </Card>
  );
}
