"use client";

import { createContext, useContext, useState } from "react";
import { RiEditLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { updatePosition } from "@/app/actions/org";
import { levelRank, orgLevels, storedLevelLabels, type OrgPerson, type StoredLevel } from "@/lib/org";

/** Everyone who could be somebody's manager, plus who sits under whom, so the form can narrow its choices. */
export type EditContext = {
  eligible: { id: string; name: string; title: string | null; rank: number }[];
  /** For each person: everyone beneath them, which they can't report to without making a loop. */
  descendants: Record<string, string[]>;
  /** Heads of department rank above managers whatever their stored level. */
  headIds: string[];
};

const Context = createContext<EditContext | null>(null);

export function OrgEditProvider({ value, children }: { value: EditContext; children: React.ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function EditPositionButton({ person }: { person: OrgPerson }) {
  const context = useContext(Context);
  const [level, setLevel] = useState<StoredLevel>(person.orgLevel);

  if (!context) return null;

  const heads = context.headIds.includes(person.id);
  const proposedRank =
    level === "ceo" || level === "executive" ? levelRank[level] : heads ? levelRank.head : levelRank[level];
  const beneath = new Set(context.descendants[person.id] ?? []);

  /** Advisory only: the server checks every rule again. */
  const options = context.eligible.filter(
    (candidate) => candidate.id !== person.id && !beneath.has(candidate.id) && candidate.rank < proposedRank,
  );

  return (
    // Remounts with fresh state whenever the saved values change.
    <Dialog
      key={`${person.orgLevel}|${person.managerId}|${person.jobTitle}`}
      trigger={
        <Button size="sm" variant="secondary">
          <RiEditLine size={16} aria-hidden />
          Edit
        </Button>
      }
      title={`${person.name}'s position`}
      description="This sets who they report to, and so who grades them, approves their leave and sees them on their team."
      submitLabel="Save position"
      action={updatePosition}
    >
      <input type="hidden" name="userId" value={person.id} />

      <Field
        label="Level"
        hint={
          heads
            ? "They head a department, so they rank as a head of department unless they are an executive or the CEO."
            : "Heads of department are set on the Departments page."
        }
      >
        <select
          name="orgLevel"
          value={level}
          onChange={(event) => setLevel(event.target.value as StoredLevel)}
          className={fieldClass}
        >
          {orgLevels.map((value) => (
            <option key={value} value={value}>
              {storedLevelLabels[value]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Reports to"
        hint={
          level === "ceo"
            ? "The CEO reports to no one."
            : options.length === 0
              ? "No one is senior enough yet. Set a more senior person first."
              : "Only people more senior than this level are listed."
        }
      >
        <select
          name="managerId"
          defaultValue={options.some((option) => option.id === person.managerId) ? (person.managerId ?? "") : ""}
          disabled={level === "ceo"}
          key={`${level}`}
          className={fieldClass}
        >
          <option value="">No one yet</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
              {option.title ? ` · ${option.title}` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Job title" hint="For example CTO, Head of Design, Product Designer.">
        <input name="jobTitle" maxLength={80} defaultValue={person.jobTitle ?? ""} className={fieldClass} />
      </Field>
    </Dialog>
  );
}

