"use client";

import { GlobalSearch } from "./global-search";
import { RiGlobalLine, RiMenuLine } from "@remixicon/react";
import { ThemeToggle } from "./theme-toggle";
import { RoleSwitcher } from "./role-switcher";
import { UserMenu } from "./user-menu";
import { websiteUrl } from "@/lib/website";
import { NotificationBell, type NotificationItem } from "./notifications";

export function Topbar({
  onOpenNav,
  notifications = [],
}: {
  onOpenNav?: () => void;
  notifications?: NotificationItem[];
}) {
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
      <a
        href={websiteUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the CVSpan website in a new tab"
        title="Visit the CVSpan website"
        className="text-secondary hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
      >
        <RiGlobalLine size={20} aria-hidden />
      </a>
      <ThemeToggle />

      <NotificationBell items={notifications} />

      <UserMenu />
    </header>
  );
}
