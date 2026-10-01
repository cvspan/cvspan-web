"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveNotificationPreferences } from "@/app/actions/profile";
import { notificationCategories } from "@/lib/notification-categories";

/** One switch per kind of notification the portal really sends. Saved as one set. */
export function NotificationPreferences({ initial }: { initial: Record<string, boolean> }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          await saveNotificationPreferences(formData);
          setSaved(true);
        });
      }}
      onChange={() => setSaved(false)}
    >
      <ul className="px-5 pt-2">
        {notificationCategories.map((category) => (
          <li key={category.key} className="border-line border-b last:border-b-0">
            <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
              <span className="text-secondary text-body">{category.label}</span>
              <input
                type="checkbox"
                name="category"
                value={category.key}
                defaultChecked={initial[category.key] ?? true}
                className="accent-brand size-4 shrink-0 cursor-pointer"
              />
            </label>
          </li>
        ))}
      </ul>
      <footer className="border-line flex items-center justify-end gap-3 border-t px-5 py-4">
        {saved ? (
          <span role="status" className="text-success-text text-body">
            Saved
          </span>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save preferences"}
        </Button>
      </footer>
    </form>
  );
}
