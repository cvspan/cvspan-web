"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { NotificationItem } from "./notifications";

export function Shell({
  children,
  notifications,
}: {
  children: React.ReactNode;
  notifications: NotificationItem[];
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setNavOpen(true)} notifications={notifications} />
        <main className="flex flex-col gap-4 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
