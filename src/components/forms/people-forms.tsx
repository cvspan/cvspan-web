"use client";

import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { inviteMember } from "@/app/actions/people";
import { ENGAGEMENTS, atLeast, type Role } from "@/lib/roles";
import { employmentLabels } from "@/lib/format";

export function InviteMemberButton({
  departments,
  managers,
  viewerRole,
}: {
  departments: string[];
  managers: { id: string; name: string }[];
  viewerRole: Role;
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
        <Field label="Engagement" hint="Sets their leave allowance and, for interns, the six-month period.">
          <select name="employmentType" defaultValue="full_time" className={fieldClass}>
            {ENGAGEMENTS.map((type) => (
              <option key={type} value={type}>
                {employmentLabels[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Access" hint={viewerRole === "super_admin" ? undefined : "Only a super admin can add an Admin."}>
          <select name="access" defaultValue="employee" disabled={viewerRole !== "super_admin"} className={fieldClass}>
            <option value="employee">Employee</option>
            {viewerRole === "super_admin" ? <option value="admin">Admin</option> : null}
          </select>
          {viewerRole !== "super_admin" ? <input type="hidden" name="access" value="employee" /> : null}
        </Field>
      </div>

      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="text-primary mb-1.5 text-body font-semibold">Functions (employees)</legend>
        <label className="text-secondary flex items-center gap-2 text-body">
          <input type="checkbox" name="isManagement" value="1" className="size-4 accent-[var(--color-accent)]" />
          Management
        </label>
        {atLeast(viewerRole, "admin") ? (
          <label className="text-secondary flex items-center gap-2 text-body">
            <input type="checkbox" name="isHr" value="1" className="size-4 accent-[var(--color-accent)]" />
            HR
          </label>
        ) : null}
        <p className="text-muted w-full text-tiny">With neither ticked they are Staff.</p>
      </fieldset>

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
