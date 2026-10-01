"use client";

import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiLogoutBoxRLine } from "@remixicon/react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { navFor, settingsLink, type NavLink } from "@/lib/nav";
import { roleLabels } from "@/lib/roles";
import { useRole } from "./role-context";
import { signOutAction } from "@/app/actions/auth";

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

export function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const { user, role } = useRole();
  const sections = navFor(role);

  return (
    <>
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
          "bg-sidebar border-sidebar-line z-30 h-dvh w-65 shrink-0 flex-col border-r",
          "fixed inset-y-0 left-0 transition-transform lg:sticky lg:top-0 lg:flex lg:translate-x-0",
          open ? "flex translate-x-0" : "hidden -translate-x-full",
        )}
        onClick={(event) => {
          // Any navigation inside the drawer closes it on small screens.
          if (onClose && (event.target as HTMLElement).closest("a")) onClose();
        }}
      >
        {/* Fixed: the logo never scrolls away. */}
        <Link
          href="/"
          aria-label="CVSpan Portal home"
          className="mx-2 mt-4 flex shrink-0 items-center rounded-lg px-3 py-2"
        >
          <Logo tone="white" height={26} />
        </Link>

        {/* Only the menu scrolls, and its scrollbar stays hidden until you hover it. */}
        <nav aria-label="Main" className="sidebar-scroll mt-2 flex min-h-0 flex-1 flex-col gap-0.5">
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

        {/* Fixed: settings and the signed-in user stay in view however long the menu is. */}
        <div className="border-sidebar-line shrink-0 border-t pt-2 pb-4">
          <NavItem {...settingsLink} />

          <div className="mx-2 mt-2 flex items-center gap-2.5 px-3 pt-2">
            <Avatar
              name={user.name}
              src={user.avatarUrl}
              size="lg"
              className="bg-sidebar-active text-sidebar-text"
            />
            <span className="min-w-0 flex-1">
              <span className="text-sidebar-text block truncate text-body font-semibold">
                {user.name}
              </span>
              <span className="text-sidebar-muted block truncate text-tiny">
                {roleLabels[user.role]} · {user.employmentType}
              </span>
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
              >
                <RiLogoutBoxRLine size={18} aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
