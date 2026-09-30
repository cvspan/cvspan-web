"use client";

import { RiMenuLine, RiSearchLine } from "@remixicon/react";
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

      <label className="border-line focus-within:border-line-input flex h-10 w-full max-w-90 items-center gap-2 rounded-lg border px-3">
        <RiSearchLine size={18} className="text-muted shrink-0" aria-hidden />
        <input
          type="search"
          placeholder="Search people, tasks, posts…"
          className="text-primary placeholder:text-muted w-full bg-transparent text-body outline-none"
        />
        <kbd className="border-line text-muted hidden rounded-md border px-1.5 py-0.5 text-tiny sm:block">
          ⌘K
        </kbd>
      </label>

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
