"use client";

import { useRouter } from "next/navigation";
import { RiFilter3Line } from "@remixicon/react";

const options = [
  { value: "all", label: "All tasks" },
  { value: "overdue", label: "Overdue" },
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

/** Filtering lives in the URL, so a filtered view can be shared or bookmarked. */
export function TaskFilter({ value }: { value: string }) {
  const router = useRouter();

  return (
    <label className="border-line text-secondary hover:bg-raised bg-card flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-body transition-colors">
      <RiFilter3Line size={18} className="text-muted" aria-hidden />
      <span className="sr-only">Filter tasks by status</span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          router.push(next === "all" ? "/tasks" : `/tasks?status=${next}`);
        }}
        className="cursor-pointer bg-transparent outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
