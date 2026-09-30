"use client";

import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { messagePerson } from "@/app/actions/messages";

export function NewMessageButton({ people }: { people: { id: string; name: string }[] }) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          New message
        </Button>
      }
      title="New message"
      description="Opens a direct conversation, or reuses the existing one."
      submitLabel="Open conversation"
      action={async (formData) => {
        await messagePerson(String(formData.get("personId")));
      }}
    >
      <Field label="Who">
        <select name="personId" className={fieldClass}>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </Field>
    </Dialog>
  );
}
