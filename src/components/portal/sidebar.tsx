"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiAwardLine,
  RiChat3Line,
  RiDashboardLine,
  RiLineChartLine,
  RiSettings3Line,
  RiTaskLine,
  RiTimeLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";

type NavLink = { href: string; label: string; icon: RemixiconComponentType };

const mainNav: NavLink[] = [
  { href: "/", label: "Dashboard", icon: RiDashboardLine },
  { href: "/tasks", label: "My tasks", icon: RiTaskLine },
  { href: "/kpis", label: "My KPIs", icon: RiLineChartLine },
  { href: "/attendance", label: "Attendance", icon: RiTimeLine },
  { href: "/messages", label: "Messages", icon: RiChat3Line },
  { href: "/programmes", label: "Programmes", icon: RiAwardLine },
];

function NavItem({ href, label, icon: Icon }: NavLink) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
        active
          ? "bg-accent-soft text-accent font-semibold"
          : "text-secondary hover:bg-raised hover:text-primary",
      )}
    >
      <Icon size={20} className={active ? "text-accent" : "text-muted"} aria-hidden />
      <span className="text-body">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="border-line bg-card sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r px-3 py-4 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-3 py-2">
        <span className="bg-brand text-on-accent flex size-8 items-center justify-center rounded-lg text-caption font-semibold">
          CV
        </span>
        <span className="text-primary text-para font-semibold">CVSpan Portal</span>
      </Link>

      <p className="text-muted mt-6 px-3 pb-2 text-tiny font-semibold tracking-wider">
        MAIN
      </p>
      <nav className="flex flex-col gap-0.5">
        {mainNav.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-0.5">
        <NavItem href="/settings" label="Settings" icon={RiSettings3Line} />
      </nav>

      <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5">
        <span className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-full text-caption font-semibold">
          {currentUser.initials}
        </span>
        <span className="min-w-0">
          <span className="text-primary block truncate text-body font-semibold">
            {currentUser.name}
          </span>
          <span className="text-muted block truncate text-tiny">
            {currentUser.role} · {currentUser.employmentType}
          </span>
        </span>
      </div>
    </aside>
  );
}
