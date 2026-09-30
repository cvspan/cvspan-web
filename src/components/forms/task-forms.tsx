"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { createTask, deleteTask, setTaskDone } from "@/app/actions/tasks";

export type Assignable = { id: string; name: string };

export function NewTaskButton({
  people,
  defaultAssigneeId,
  label = "New task",
}: {
  people: Assignable[];
  defaultAssigneeId: string;
  label?: string;
}) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          {label}
        </Button>
      }
      title="New task"
      description="Tasks appear on the assignee's dashboard and in their deadline list."
      submitLabel="Create task"
      action={createTask}
    >
      <Field label="Title">
        <input name="title" required placeholder="What needs doing?" className={fieldClass} />
      </Field>

      <Field label="Assignee">
        <select name="assigneeId" defaultValue={defaultAssigneeId} className={fieldClass}>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project">
          <input name="project" placeholder="e.g. Website" className={fieldClass} />
        </Field>
        <Field label="Due date">
          <input name="dueAt" type="date" className={fieldClass} />
        </Field>
      </div>

      <Field label="Priority">
        <select name="priority" defaultValue="normal" className={fieldClass}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </Field>
    </Dialog>
  );
}

export function TaskCheckbox({
  taskId,
  done,
  label,
}: {
  taskId: string;
  done: boolean;
  label: string;
}) {
  const router = useRouter();

  return (
    <input
      type="checkbox"
      defaultChecked={done}
      aria-label={`Mark “${label}” as ${done ? "not done" : "done"}`}
      onChange={async (event) => {
        await setTaskDone(taskId, event.target.checked);
        router.refresh();
      }}
      className="accent-brand size-4 cursor-pointer"
    />
  );
}

export function DeleteTaskButton({ taskId, label }: { taskId: string; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Delete “${label}”`}
      onClick={() => {
        if (!confirm(`Delete “${label}”? This cannot be undone.`)) return;
        startTransition(async () => {
          await deleteTask(taskId);
          router.refresh();
        });
      }}
      className="text-muted hover:text-error-text hover:bg-error-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50"
    >
      <RiDeleteBin6Line size={18} aria-hidden />
    </button>
  );
}
