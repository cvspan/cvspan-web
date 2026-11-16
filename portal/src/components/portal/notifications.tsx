"use client";

import { useState } from "react";
import Link from "next/link";
import { RiNotification3Line } from "@remixicon/react";

export type NotificationItem = {
  id: string;
  title: string;
  href: string | null;
  unread: boolean;
  when: string;
};

/** Bell with a small popover. Closes on outside blur, so no global listener. */
export function NotificationBell({ items }: { items: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const unread = items.filter((item) => item.unread).length;

  return (
    <span
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        className="text-secondary hover:bg-raised hover:text-primary relative flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
      >
        <RiNotification3Line size={20} aria-hidden />
        {unread > 0 ? (
          <span className="bg-brand absolute top-1.5 right-1.5 size-2 rounded-full" />
        ) : null}
      </button>

      {open ? (
        <div className="border-line bg-card absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border shadow-lg">
          <p className="border-line text-primary border-b px-4 py-2.5 text-body font-semibold">
            Notifications
          </p>
          {items.length === 0 ? (
            <p className="text-muted px-4 py-6 text-center text-caption">Nothing new.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => setOpen(false)}
                    className="border-line hover:bg-raised block border-b px-4 py-3 last:border-b-0"
                  >
                    <span
                      className={
                        item.unread
                          ? "text-primary block text-caption font-semibold"
                          : "text-secondary block text-caption"
                      }
                    >
                      {item.title}
                    </span>
                    <span className="text-muted block text-tiny">{item.when}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </span>
  );
}
