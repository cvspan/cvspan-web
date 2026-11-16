import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "objectives", label: "Objectives", href: "/performance" },
  { key: "team", label: "Team reviews", href: "/performance/team", supervisorsOnly: true },
  { key: "scores", label: "KPI scores", href: "/performance/scores" },
] as const;

/** The sub-menu of the Performance section. Team reviews only shows for people who can review. */
export function PerformanceTabs({ active, canReview, cycle }: { active: (typeof tabs)[number]["key"]; canReview: boolean; cycle?: string }) {
  return (
    <nav aria-label="Performance" className="border-line -mb-1 flex gap-1 border-b">
      {tabs
        .filter((tab) => !("supervisorsOnly" in tab) || canReview)
        .map((tab) => (
          <Link
            key={tab.key}
            href={cycle && tab.key !== "scores" ? `${tab.href}?cycle=${cycle}` : tab.href}
            aria-current={active === tab.key ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-body font-semibold transition-colors",
              active === tab.key ? "border-accent text-accent" : "text-muted hover:text-primary border-transparent",
            )}
          >
            {tab.label}
          </Link>
        ))}
    </nav>
  );
}
