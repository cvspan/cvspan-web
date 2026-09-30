"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";
import { navFor, settingsLink, type NavLink } from "@/lib/nav";
import { roleLabels } from "@/lib/roles";
import { useRole } from "./role-context";

function NavItem({ href, label, icon: Icon }: NavLink) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

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

export function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const { role } = useRole();
  const sections = navFor(role);

  return (
    <>
      {/* Scrim behind the mobile drawer */}
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-20 cursor-default bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "bg-sidebar border-sidebar-line z-30 h-dvh w-65 shrink-0 flex-col overflow-y-auto border-r py-4",
          "fixed inset-y-0 left-0 transition-transform lg:sticky lg:top-0 lg:flex lg:translate-x-0",
          open ? "flex translate-x-0" : "hidden -translate-x-full",
        )}
        onClick={(event) => {
          // Any navigation inside the drawer closes it on small screens.
          if (onClose && (event.target as HTMLElement).closest("a")) onClose();
        }}
      >
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

      <div className="min-h-6 flex-1" />

      <NavItem {...settingsLink} />

      <div className="border-sidebar-line mx-2 mt-3 flex items-center gap-2.5 border-t px-3 pt-3">
        <span className="bg-sidebar-active text-sidebar-text flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
          {currentUser.initials}
        </span>
        <span className="min-w-0">
          <span className="text-sidebar-text block truncate text-body font-semibold">
            {currentUser.name}
          </span>
          <span className="text-sidebar-muted block truncate text-tiny">
            {roleLabels[role]} · {currentUser.employmentType}
          </span>
        </span>
        </div>
      </aside>
    </>
  );
}
