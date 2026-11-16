"use client";

import { useState } from "react";
import { RiEditLine, RiShieldUserLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { updateAccess, updateMemberDetails } from "@/app/actions/people";
import { ACCESS_LEVELS, accessLabels, atLeast, type AccessLevel, type Role } from "@/lib/roles";

const statusLabels = {
  active: "Active: can sign in",
  suspended: "Suspended: can't sign in, kept on record",
  alumni: "Alumni: has left, can't sign in",
} as const;

/** Access, then the two functions an employee can hold. Admins and Super admins have both already. */
function AccessFields({
  access: initialAccess,
  isHr,
  isManagement,
  status,
  canChangeAccess,
  canChangeHr,
}: {
  access: AccessLevel;
  isHr: boolean;
  isManagement: boolean;
  status: string;
  canChangeAccess: boolean;
  canChangeHr: boolean;
}) {
  const [access, setAccess] = useState<AccessLevel>(initialAccess);
  const employee = access === "employee";

  return (
    <>
      <Field
        label="Access"
        hint={canChangeAccess ? "Employees work in the portal; Admins also run the system and the website." : "Only a super admin can change access."}
      >
        <select
          name="access"
          value={access}
          onChange={(event) => setAccess(event.target.value as AccessLevel)}
          disabled={!canChangeAccess}
          className={fieldClass}
        >
          {ACCESS_LEVELS.map((value) => (
            <option key={value} value={value}>
              {accessLabels[value]}
            </option>
          ))}
        </select>
        {/* A disabled select isn't submitted, so send the unchanged access along. */}
        {!canChangeAccess ? <input type="hidden" name="access" value={initialAccess} /> : null}
      </Field>

      {employee ? (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="text-primary mb-1 text-body font-semibold">Functions</legend>
          {[
            { name: "isManagement", label: "Management", hint: "Supervises people: approves their leave, reviews their objectives, grades them.", value: isManagement, locked: false },
            { name: "isHr", label: "HR", hint: "Runs people operations: the directory, leave and attendance, recruitment, certificates.", value: isHr, locked: !canChangeHr },
          ].map((item) => (
            <label key={item.name} className="border-line flex items-start gap-3 rounded-lg border p-3">
              <input type="hidden" name={item.name} value="0" disabled={item.locked} />
              {item.locked ? <input type="hidden" name={item.name} value={item.value ? "1" : "0"} /> : null}
              <input
                type="checkbox"
                name={item.name}
                value="1"
                defaultChecked={item.value}
                disabled={item.locked}
                className="mt-0.5 size-4 accent-[var(--color-accent)]"
              />
              <span>
                <span className="text-primary block text-body font-semibold">
                  {item.label}
                  {item.locked ? <span className="text-muted ml-2 text-tiny font-normal">Only an admin can change this</span> : null}
                </span>
                <span className="text-muted block text-caption">{item.hint}</span>
              </span>
            </label>
          ))}
          <p className="text-muted text-tiny">With neither, they are Staff. A person can hold both.</p>
        </fieldset>
      ) : (
        <>
          <input type="hidden" name="isHr" value="0" />
          <input type="hidden" name="isManagement" value="0" />
          <p className="text-muted text-caption">
            {accessLabels[access]}s can do everything HR and Management can, so there are no functions to choose.
          </p>
        </>
      )}

      <Field label="Status">
        <select name="status" defaultValue={status === "invited" ? "active" : status} className={fieldClass}>
          {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}

export function ManageAccessButton({
  userId,
  name,
  access,
  isHr,
  isManagement,
  status,
  viewerRole,
}: {
  userId: string;
  name: string;
  access: AccessLevel;
  isHr: boolean;
  isManagement: boolean;
  status: string;
  viewerRole: Role;
}) {
  return (
    <Dialog
      key={`${access}|${isHr}|${isManagement}|${status}`}
      trigger={
        <Button variant="secondary">
          <RiShieldUserLine size={18} aria-hidden />
          Manage access
        </Button>
      }
      title={`${name}'s access`}
      description="Access and functions decide what they can do. Status decides whether they can sign in."
      submitLabel="Save access"
      action={updateAccess}
    >
      <input type="hidden" name="userId" value={userId} />
      <AccessFields
        access={access}
        isHr={isHr}
        isManagement={isManagement}
        status={status}
        canChangeAccess={viewerRole === "super_admin"}
        canChangeHr={atLeast(viewerRole, "admin")}
      />
    </Dialog>
  );
}

/** Name, work email and job title can only be changed by an admin, here. */
export function EditDetailsButton({
  userId,
  name,
  email,
  jobTitle,
}: {
  userId: string;
  name: string;
  email: string;
  jobTitle: string | null;
}) {
  return (
    <Dialog
      key={`${name}|${email}|${jobTitle}`}
      trigger={
        <Button variant="secondary">
          <RiEditLine size={18} aria-hidden />
          Edit details
        </Button>
      }
      title={`${name}'s details`}
      description="People can't change these themselves. Changing the email changes what they sign in with."
      submitLabel="Save details"
      action={updateMemberDetails}
    >
      <input type="hidden" name="userId" value={userId} />
      <Field label="Full name">
        <input name="name" required maxLength={120} defaultValue={name} className={fieldClass} />
      </Field>
      <Field label="Work email">
        <input name="email" type="email" required defaultValue={email} className={fieldClass} />
      </Field>
      <Field label="Job title">
        <input name="jobTitle" maxLength={120} defaultValue={jobTitle ?? ""} className={fieldClass} />
      </Field>
    </Dialog>
  );
}
