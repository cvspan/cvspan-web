"use client";

import { RiShieldUserLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { updateAccess } from "@/app/actions/people";
import { ROLES, roleLabels, type Role } from "@/lib/roles";

const statusLabels = {
  active: "Active: can sign in",
  suspended: "Suspended: can't sign in, kept on record",
  alumni: "Alumni: has left, can't sign in",
} as const;

export function ManageAccessButton({
  userId,
  name,
  role,
  status,
  canChangeRole,
}: {
  userId: string;
  name: string;
  role: Role;
  status: string;
  /** Only a super admin can change roles; other admins can still suspend people. */
  canChangeRole: boolean;
}) {
  return (
    <Dialog
      key={`${role}|${status}`}
      trigger={
        <Button variant="secondary">
          <RiShieldUserLine size={18} aria-hidden />
          Manage access
        </Button>
      }
      title={`${name}'s access`}
      description="Their role decides what they can do. Their status decides whether they can sign in."
      submitLabel="Save access"
      action={updateAccess}
    >
      <input type="hidden" name="userId" value={userId} />

      <Field label="Role" hint={canChangeRole ? undefined : "Only a super admin can change roles."}>
        <select name="role" defaultValue={role} disabled={!canChangeRole} className={fieldClass}>
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {roleLabels[value]}
            </option>
          ))}
        </select>
        {/* A disabled select isn't submitted, so send the unchanged role along. */}
        {!canChangeRole ? <input type="hidden" name="role" value={role} /> : null}
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={status === "invited" ? "active" : status} className={fieldClass}>
          {(Object.keys(statusLabels) as (keyof typeof statusLabels)[]).map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </Field>
    </Dialog>
  );
}
