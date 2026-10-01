"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RiAddLine, RiDeleteBin6Line, RiEditLine, RiUserAddLine, RiUserUnfollowLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { PeoplePicker, type PickerPerson } from "./people-picker";
import {
  assignToDepartment,
  createDepartment,
  deleteDepartment,
  removeFromDepartment,
  updateDepartment,
} from "@/app/actions/departments";

export function NewDepartmentButton() {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          New department
        </Button>
      }
      title="New department"
      description="Add people and projects to it once it exists."
      submitLabel="Create department"
      action={createDepartment}
    >
      <Field label="Name" hint="Department names also appear as filters on the website careers page.">
        <input name="name" required maxLength={80} placeholder="e.g. Customer Success" className={fieldClass} />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          placeholder="What this department is responsible for"
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </Dialog>
  );
}

export function EditDepartmentButton({
  department,
  members,
}: {
  department: { id: string; name: string; description: string | null; headId: string | null; updatedAt: Date };
  members: { id: string; name: string }[];
}) {
  return (
    <Dialog
      key={department.updatedAt.toISOString()}
      trigger={
        <Button variant="secondary">
          <RiEditLine size={18} aria-hidden />
          Edit
        </Button>
      }
      title="Edit department"
      submitLabel="Save changes"
      action={updateDepartment}
    >
      <input type="hidden" name="id" value={department.id} />
      <Field label="Name" hint="Renaming changes the filter shown on the website careers page.">
        <input name="name" required maxLength={80} defaultValue={department.name} className={fieldClass} />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={department.description ?? ""}
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
      <Field
        label="Department head"
        hint={members.length === 0 ? "Add people to the department first." : "Chosen from its members."}
      >
        <select
          name="headId"
          defaultValue={department.headId ?? ""}
          disabled={members.length === 0}
          className={fieldClass}
        >
          <option value="">No head</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </Field>
    </Dialog>
  );
}

export function DeleteDepartmentButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  return (
    <Dialog
      trigger={
        <Button variant="destructive">
          <RiDeleteBin6Line size={18} aria-hidden />
          Delete
        </Button>
      }
      title={`Delete ${name}?`}
      description="This can't be undone. A department can only be deleted once it has no people, projects, teams or job listings."
      submitLabel="Delete department"
      destructive
      action={async () => {
        const result = await deleteDepartment(id);
        if (result.ok) router.push("/departments");
        return result;
      }}
    >
      <p className="text-secondary text-body">
        You&apos;re about to delete <strong className="text-primary">{name}</strong>.
      </p>
    </Dialog>
  );
}

export function AddToDepartmentButton({
  departmentId,
  departmentName,
  people,
}: {
  departmentId: string;
  departmentName: string;
  people: PickerPerson[];
}) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiUserAddLine size={18} aria-hidden />
          Add people
        </Button>
      }
      title={`Add people to ${departmentName}`}
      description="A person belongs to one department, so anyone already in another is moved."
      submitLabel="Add to department"
      action={assignToDepartment}
    >
      <input type="hidden" name="departmentId" value={departmentId} />
      <PeoplePicker people={people} emptyLabel="Everyone is already in this department." />
    </Dialog>
  );
}

export function RemoveFromDepartmentButton({
  departmentId,
  userId,
  name,
}: {
  departmentId: string;
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Remove ${name} from this department`}
      title="Remove from department"
      onClick={() => {
        if (!confirm(`Remove ${name} from this department?`)) return;
        startTransition(async () => {
          const result = await removeFromDepartment(departmentId, userId);
          if (!result.ok) alert(result.error);
          router.refresh();
        });
      }}
      className="text-muted hover:text-error-text hover:bg-error-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50"
    >
      <RiUserUnfollowLine size={18} aria-hidden />
    </button>
  );
}
