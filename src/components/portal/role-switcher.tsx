"use client";

import { RiEyeLine } from "@remixicon/react";
import { ROLES, roleLabels, type Role } from "@/lib/roles";
import { useRole } from "./role-context";

/** Preview control: view the portal as any role. Replaced by real auth later. */
export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <label className="border-line text-secondary hover:bg-raised hidden h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-caption transition-colors sm:flex">
      <RiEyeLine size={16} className="text-muted" aria-hidden />
      <span className="sr-only">View portal as role</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as Role)}
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
