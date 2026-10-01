"use client";

import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { inviteMember } from "@/app/actions/people";
import { ROLES, roleLabels } from "@/lib/roles";
import { employmentLabels, type EmploymentType } from "@/lib/format";

export function InviteMemberButton({
  departments,
  managers,
}: {
  departments: string[];
  managers: { id: string; name: string }[];
}) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          Invite member
        </Button>
      }
      title="Invite a member"
      description="They are created as invited, and become active on first sign-in."
      submitLabel="Send invite"
      action={inviteMember}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input name="name" required placeholder="Ada Obi" className={fieldClass} />
        </Field>
        <Field label="Work email">
          <input
            name="email"
            type="email"
            required
            placeholder="ada@cvspan.com"
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job title">
          <input name="jobTitle" placeholder="Product Designer" className={fieldClass} />
        </Field>
        <Field label="Department">
          <select name="department" className={fieldClass}>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Employment type" hint="Separate from access level.">
          <select name="employmentType" defaultValue="full_time" className={fieldClass}>
            {(Object.keys(employmentLabels) as EmploymentType[]).map((type) => (
              <option key={type} value={type}>
                {employmentLabels[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Access level">
          <select name="role" defaultValue="member" className={fieldClass}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Manager">
          <select name="managerId" defaultValue="" className={fieldClass}>
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Start date">
          <input name="startDate" type="date" className={fieldClass} />
        </Field>
      </div>

      <Field label="End date" hint="Optional. Internships default to six months from the start date.">
        <input name="endDate" type="date" className={fieldClass} />
      </Field>
    </Dialog>
  );
}
