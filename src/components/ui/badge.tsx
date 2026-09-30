import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/mock-data";

const tones: Record<Tone, string> = {
  neutral: "bg-raised text-secondary border-line",
  accent: "bg-accent-soft text-accent border-transparent",
  success: "bg-success-surface text-success-text border-success-border",
  warning: "bg-warning-surface text-warning-text border-warning-border",
  error: "bg-error-surface text-error-text border-error-border",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-tiny font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
