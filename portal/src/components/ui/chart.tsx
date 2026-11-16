import { cn } from "@/lib/utils";

/** Sparkline: a small filled line chart used inside stat cards. */
export function Sparkline({
  points,
  className,
  stroke = "var(--accent-primary)",
  fill = "color-mix(in srgb, var(--accent-primary) 12%, transparent)",
  label,
}: {
  points: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  label: string;
}) {
  const width = 200;
  const height = 48;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;

  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      role="img"
      aria-label={label}
    >
      <polygon points={`0,${height} ${coords.join(" ")} ${width},${height}`} fill={fill} />
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Bar sparkline, for counts rather than trends. */
export function BarSpark({ points, label }: { points: number[]; label: string }) {
  const max = Math.max(...points) || 1;
  return (
    <div className="flex h-12 items-end gap-0.5" role="img" aria-label={label}>
      {points.map((value, index) => (
        <span
          key={index}
          className="bg-brand/70 flex-1 rounded-xs"
          style={{ height: `${Math.max((value / max) * 100, 6)}%` }}
        />
      ))}
    </div>
  );
}

/** Ring gauge for a single percentage, as on Tabler's "active users" card. */
export function Gauge({
  value,
  caption,
  size = 132,
}: {
  value: number;
  caption: string;
  size?: number;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  /** Leave a quarter open at the bottom, so the ring reads as a gauge. */
  const arc = circumference * 0.75;
  const progress = arc * (value / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${caption}: ${value} percent`}
        className="-rotate-[225deg]"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={stroke}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted text-tiny font-semibold tracking-wide uppercase">
          {caption}
        </span>
        <span className="text-primary text-h5 font-semibold">{value}%</span>
      </span>
    </div>
  );
}

/** Thin progress bar used under the welcome-card metrics. */
export function Progress({
  value,
  tone = "brand",
  label,
}: {
  value: number;
  tone?: "brand" | "success" | "warning" | "error";
  label: string;
}) {
  const colour =
    tone === "success"
      ? "bg-[var(--cv-success-3)]"
      : tone === "warning"
        ? "bg-[var(--cv-warning-3)]"
        : tone === "error"
          ? "bg-[var(--cv-error-3)]"
          : "bg-brand";

  return (
    <div
      className="bg-raised h-1.5 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full", colour)} style={{ width: `${value}%` }} />
    </div>
  );
}
