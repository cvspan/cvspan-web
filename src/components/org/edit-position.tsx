"use client";

import { createContext, useContext, useState } from "react";
import { RiEditLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { updatePosition } from "@/app/actions/org";
import {
  levelOf,
  levelRank,
  positionLevelLabels,
  positionLevels,
  type OrgPerson,
  type PositionLevel,
} from "@/lib/org";

/** What the form needs to show and narrow its choices. The server checks every rule again. */
export type EditContext = {
  /** Everyone who could be somebody's manager, with their rank. */
  eligible: { id: string; name: string; title: string | null; rank: number }[];
  /** For each person: everyone beneath them, whom they can't report to without making a loop. */
  descendants: Record<string, string[]>;
  ceo: { id: string; name: string } | null;
  /** The head of each department, by department id. */
  departmentHeads: Record<string, { id: string; name: string }>;
};

const Context = createContext<EditContext | null>(null);

export function OrgEditProvider({ value, children }: { value: EditContext; children: React.ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function EditPositionButton({ person }: { person: OrgPerson }) {
  const context = useContext(Context);
  const [level, setLevel] = useState<PositionLevel>(levelOf(person));

  if (!context) return null;

  const currentHead = person.departmentId ? context.departmentHeads[person.departmentId] : undefined;
  const departmentHead = currentHead && currentHead.id !== person.id ? currentHead : undefined;

  /** Where the structure decides the reporting line, say who it is; otherwise it is a choice. */
  const automatic =
    level === "ceo"
      ? "Reports to no one."
      : level === "head"
        ? context.ceo && context.ceo.id !== person.id
          ? `Reports to ${context.ceo.name}, the CEO. This is automatic.`
          : "Reports to the CEO once one is set. This is automatic."
        : level === "manager" && departmentHead
          ? `Reports to ${departmentHead.name}, head of ${person.departmentName}. This is automatic.`
          : null;

  const rank = levelRank[level];
  const beneath = new Set(context.descendants[person.id] ?? []);
  const options = context.eligible.filter(
    (candidate) => candidate.id !== person.id && !beneath.has(candidate.id) && candidate.rank < rank,
  );

  const needsAccess = person.role === "member" && (level === "head" || level === "manager");

  return (
    // Remounts with fresh state whenever the saved values change.
    <Dialog
      key={`${person.orgLevel}|${person.headOf.join(",")}|${person.managerId}|${person.jobTitle}`}
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

      <Field label="Level">
        <select
          name="level"
          value={level}
          onChange={(event) => setLevel(event.target.value as PositionLevel)}
          className={fieldClass}
        >
          {positionLevels.map((value) => (
            <option key={value} value={value} disabled={value === "head" && !person.departmentId}>
              {positionLevelLabels[value]}
              {value === "head" && !person.departmentId ? " (needs a department)" : ""}
            </option>
          ))}
        </select>
      </Field>

      {level === "head" ? (
        <p className="bg-accent-soft text-secondary rounded-lg px-3.5 py-2.5 text-caption">
          {person.name} becomes the head of <strong className="text-primary">{person.departmentName}</strong>
          {currentHead && currentHead.id !== person.id ? `, replacing ${currentHead.name}` : ""}. Managers and
          members in that department then report up to them.
        </p>
      ) : null}

      {needsAccess ? (
        <p className="text-muted text-caption">
          They are a member today, so they also get manager access to be able to run people.
        </p>
      ) : null}

      {automatic ? (
        <div>
          <p className="text-primary text-body font-semibold">Reports to</p>
          <p className="text-secondary mt-1 text-body">{automatic}</p>
        </div>
      ) : (
        <Field
          label="Reports to"
          hint={
            level === "manager"
              ? `${person.departmentName ?? "Their department"} has no head yet. Once it does, they will report to them automatically.`
              : options.length === 0
                ? "No one is senior enough yet."
                : "Defaults to their project manager, else their department head, when left empty."
          }
        >
          <select
            name="managerId"
            defaultValue={options.some((option) => option.id === person.managerId) ? (person.managerId ?? "") : ""}
            key={level}
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
      )}

      <Field label="Job title" hint="For example CTO, Head of Design, Product Designer.">
        <input name="jobTitle" maxLength={80} defaultValue={person.jobTitle ?? ""} className={fieldClass} />
      </Field>
    </Dialog>
  );
}
