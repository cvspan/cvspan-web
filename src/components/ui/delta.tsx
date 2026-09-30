import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";
import type { Tone } from "@/lib/tone";

/** Percentage or count change shown next to a metric. */
export function Delta({ value, tone }: { value: string; tone: Tone }) {
  const colour =
    tone === "success"
      ? "text-success-text"
      : tone === "error"
        ? "text-error-text"
        : "text-muted";
  const Icon = tone === "success" ? RiArrowUpLine : tone === "error" ? RiArrowDownLine : null;

  return (
    <span className={`inline-flex items-center gap-0.5 text-caption font-semibold ${colour}`}>
      {value}
      {Icon ? <Icon size={14} aria-hidden /> : null}
    </span>
  );
}
