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

const sections: { title: string; links: NavLink[] }[] = [
  {
    title: "Overview",
    links: [
      { href: "/", label: "Dashboard", icon: RiDashboardLine },
      { href: "/tasks", label: "My tasks", icon: RiTaskLine },
      { href: "/kpis", label: "My KPIs", icon: RiLineChartLine },
    ],
  },
  {
    title: "Workplace",
    links: [
      { href: "/attendance", label: "Attendance", icon: RiTimeLine },
      { href: "/messages", label: "Messages", icon: RiChat3Line },
      { href: "/programmes", label: "Programmes", icon: RiAwardLine },
    ],
  },
];

function NavItem({ href, label, icon: Icon }: NavLink) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-body transition-colors",
        active
          ? "bg-sidebar-active text-sidebar-text font-semibold"
          : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text",
      )}
    >
      <Icon size={20} aria-hidden />
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-line sticky top-0 hidden h-dvh w-65 shrink-0 flex-col border-r py-4 lg:flex">
      <Link href="/" className="mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
        <span className="text-brand flex size-9 items-center justify-center rounded-lg bg-white text-caption font-bold">
          CV
        </span>
        <span className="text-sidebar-text text-para font-semibold">CVSpan Portal</span>
      </Link>

      <nav className="mt-4 flex flex-col gap-0.5">
        {sections.map((section) => (
          <div key={section.title} className="pb-2">
            <p className="text-sidebar-muted px-5 pt-3 pb-1.5 text-tiny font-semibold tracking-widest uppercase">
              {section.title}
            </p>
            {section.links.map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      <NavItem href="/settings" label="Settings" icon={RiSettings3Line} />

      <div className="border-sidebar-line mx-2 mt-3 flex items-center gap-2.5 border-t px-3 pt-3">
        <span className="bg-sidebar-active text-sidebar-text flex size-9 items-center justify-center rounded-full text-caption font-semibold">
          {currentUser.initials}
        </span>
        <span className="min-w-0">
          <span className="text-sidebar-text block truncate text-body font-semibold">
            {currentUser.name}
          </span>
          <span className="text-sidebar-muted block truncate text-tiny">
            {currentUser.role} · {currentUser.employmentType}
          </span>
        </span>
      </div>
    </aside>
  );
}
