import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-line bg-card overflow-hidden rounded-lg border",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="border-line flex items-center justify-between gap-4 border-b px-5 py-4">
      <h2 className="text-primary text-para font-semibold">{title}</h2>
      {action}
    </header>
  );
}
