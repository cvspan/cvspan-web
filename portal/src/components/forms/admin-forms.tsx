"use client";

import { RiAddLine, RiUserUnfollowLine } from "@remixicon/react";
import { addAdmin, removeAdmin } from "@/app/actions/people";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";

/** Super admins only: pick someone from the people who can sign in and make them an Admin. */
export function AddAdminButton({ candidates }: { candidates: { id: string; name: string; hint: string }[] }) {
  return (
    <Dialog
      key={candidates.length}
      trigger={
        <Button type="button">
          <RiAddLine size={18} aria-hidden />
          Add admin
        </Button>
      }
      title="Add an admin"
      description="An Admin can do everything HR and Management can, plus publish to the website, change Site settings and give out HR."
      submitLabel="Make admin"
      action={addAdmin}
    >
      {candidates.length === 0 ? (
        <p className="text-muted text-body">Everyone who can sign in is already an Admin or a Super admin. Invite someone from People first.</p>
      ) : (
        <Field label="Who">
          <select name="userId" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Choose a person
            </option>
            {candidates.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} · {person.hint}
              </option>
            ))}
          </select>
        </Field>
      )}
    </Dialog>
  );
}

export function RemoveAdminButton({ id, name }: { id: string; name: string }) {
  return (
    <Dialog
      trigger={
        <Button type="button" variant="secondary" size="sm">
          <RiUserUnfollowLine size={14} aria-hidden />
          Remove admin
        </Button>
      }
      title={`Remove ${name} as an Admin?`}
      description="They stay in the portal as an Employee, with whatever HR or Management functions they held before. They lose the website, Site settings and the power to give out HR."
      submitLabel="Remove admin"
      destructive
      action={() => removeAdmin(id)}
    >
      <p className="text-secondary text-body">You can make them an Admin again at any time.</p>
    </Dialog>
  );
}
