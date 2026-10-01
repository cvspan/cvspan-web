"use client";

import { GlobalSearch } from "./global-search";
import { RiMenuLine } from "@remixicon/react";
import { ThemeToggle } from "./theme-toggle";
import { RoleSwitcher } from "./role-switcher";
import { useRole } from "./role-context";
import { NotificationBell, type NotificationItem } from "./notifications";

export function Topbar({
  onOpenNav,
  notifications = [],
}: {
  onOpenNav?: () => void;
  notifications?: NotificationItem[];
}) {
  const { user } = useRole();

  return (
    <header className="border-line bg-card sticky top-0 z-10 flex h-16 items-center gap-3 border-b px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="text-secondary hover:bg-raised hover:text-primary flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors lg:hidden"
      >
        <RiMenuLine size={20} aria-hidden />
      </button>

      <GlobalSearch />

      <div className="flex-1" />

      <RoleSwitcher />
      <ThemeToggle />

      <NotificationBell items={notifications} />

      <span
        title={user.email}
        className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold"
      >
        {user.initials}
      </span>
    </header>
  );
}
