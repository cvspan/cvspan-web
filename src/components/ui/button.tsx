import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-accent hover:bg-brand-hover border-transparent",
  secondary: "bg-card text-primary border-line hover:bg-raised",
  ghost: "bg-transparent text-secondary border-transparent hover:bg-raised hover:text-primary",
  /** Matches the Destructive variant in the CVSpan design system. */
  destructive:
    "bg-error-surface text-error-text border-error-border hover:bg-error-border hover:text-on-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 gap-1.5 text-caption",
  md: "h-10 px-4 gap-2 text-body",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
