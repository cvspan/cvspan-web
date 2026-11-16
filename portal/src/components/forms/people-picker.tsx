"use client";

import { useState } from "react";
import { RiSearchLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { fieldClass } from "@/components/ui/dialog";

export type PickerPerson = {
  id: string;
  name: string;
  /** Job title, or where they sit today ("Currently in Design"). */
  detail?: string | null;
};

/**
 * Searchable checkbox list for assigning several people at once. Filtered-out rows are hidden,
 * not removed, so anything already ticked is still submitted with the form.
 */
export function PeoplePicker({
  people,
  name = "userIds",
  emptyLabel = "Everyone is already assigned.",
}: {
  people: PickerPerson[];
  name?: string;
  emptyLabel?: string;
}) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  if (people.length === 0) {
    return <p className="text-muted text-body">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="relative block">
        <RiSearchLine
          size={16}
          className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people"
          aria-label="Search people"
          className={`${fieldClass} w-full pl-9`}
        />
      </label>

      <ul className="border-line max-h-64 overflow-y-auto rounded-lg border">
        {people.map((person) => {
          const hidden =
            needle !== "" &&
            !`${person.name} ${person.detail ?? ""}`.toLowerCase().includes(needle);

          return (
            <li key={person.id} hidden={hidden} className="border-line border-b last:border-b-0">
              <label className="hover:bg-raised flex cursor-pointer items-center gap-3 px-3 py-2.5">
                <input
                  type="checkbox"
                  name={name}
                  value={person.id}
                  className="accent-brand size-4 cursor-pointer"
                />
                <Avatar name={person.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">
                    {person.name}
                  </span>
                  {person.detail ? (
                    <span className="text-muted block truncate text-tiny">{person.detail}</span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
