"use client";

import { useTransition } from "react";
import { RiEyeLine } from "@remixicon/react";
import { ROLES, roleLabels, type Role } from "@/lib/roles";
import { setViewRole } from "@/app/actions/view-role";
import { useRole } from "./role-context";

/** Super-admin preview: render the portal as a lower role, data included. */
export function RoleSwitcher() {
  const { role, canSwitch } = useRole();
  const [pending, startTransition] = useTransition();

  if (!canSwitch) return null;

  return (
    <label className="border-line text-secondary hover:bg-raised hidden h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-caption transition-colors sm:flex">
      <RiEyeLine size={16} className="text-muted" aria-hidden />
      <span className="sr-only">View portal as role</span>
      <select
        value={role}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as Role;
          startTransition(() => setViewRole(next));
        }}
        className="cursor-pointer bg-transparent pr-1 outline-none"
      >
        {ROLES.map((value) => (
          <option key={value} value={value}>
            {roleLabels[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
