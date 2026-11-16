"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiLogoutBoxRLine, RiSettings3Line, RiUserLine } from "@remixicon/react";
import { signOutAction } from "@/app/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import { useRole } from "./role-context";

const item =
  "text-secondary hover:bg-raised hover:text-primary flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-body transition-colors focus-visible:outline-2";

/** The avatar in the top bar: opens a small menu with Profile, Settings and Log out. */
export function UserMenu() {
  const { user } = useRole();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="focus-visible:outline-brand flex cursor-pointer rounded-full outline-offset-2"
      >
        <Avatar name={user.name} src={user.avatarUrl} />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-line bg-card absolute right-0 z-30 mt-2 w-60 rounded-lg border p-1.5 shadow-lg"
        >
          <div className="border-line mb-1.5 flex items-center gap-3 border-b px-3 pt-2 pb-3">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div className="min-w-0">
              <p className="text-primary truncate text-body font-semibold">{user.name}</p>
              <p className="text-muted truncate text-caption">{user.email}</p>
            </div>
          </div>

          <Link href={`/people/${user.id}`} role="menuitem" className={item} onClick={() => setOpen(false)}>
            <RiUserLine size={18} aria-hidden />
            Profile
          </Link>
          <Link href="/settings" role="menuitem" className={item} onClick={() => setOpen(false)}>
            <RiSettings3Line size={18} aria-hidden />
            Settings
          </Link>
          <form action={signOutAction} className="border-line mt-1.5 border-t pt-1.5">
            <button type="submit" role="menuitem" className={item}>
              <RiLogoutBoxRLine size={18} aria-hidden />
              Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
