"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiCloseLine, RiDeleteBin6Line } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, fieldClass } from "@/components/ui/dialog";
import { deleteTask, updateTask } from "@/app/actions/tasks";
import { BOARD_STATUSES, positionBetween, type BoardStatus, type BoardTask } from "@/lib/board";
import { taskStatusLabels } from "@/lib/format";

export type BoardPerson = { id: string; name: string };
export type BoardProject = { id: string; name: string; code: string };

const priorityLabels = { low: "Low", normal: "Normal", high: "High" } as const;

/** The date part of an ISO timestamp, for <input type="date">. */
const dateValue = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

/**
 * One task, opened from its card. Managers edit every field; anyone who may move the task can change
 * its status; everyone else reads it. It is a native <dialog>, so Escape and focus trapping just work.
 */
export function TaskDialog({
  task,
  people,
  projects,
  canEdit,
  canMove,
  onClose,
  onStatusChange,
}: {
  task: BoardTask | null;
  people: BoardPerson[];
  projects: BoardProject[];
  canEdit: boolean;
  canMove: boolean;
  onClose: () => void;
  /** Lets the board update the card straight away when the status is changed in here. */
  onStatusChange: (taskId: string, status: BoardStatus) => Promise<string | null>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (task && !dialog.open) dialog.showModal();
    if (!task && dialog.open) dialog.close();
  }, [task]);

  const close = () => {
    setError(null);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(event) => {
        /** A click on the backdrop lands on the dialog element itself. */
        if (event.target === ref.current) close();
      }}
      className="bg-card text-primary border-line m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] rounded-lg border p-0 backdrop:bg-black/50"
    >
      {task ? (
        <form
          key={task.id}
          onSubmit={(event) => {
            event.preventDefault();
            if (!canEdit) return;
            const data = new FormData(event.currentTarget);
            data.set("taskId", task.id);
            /** An untouched date is left exactly as stored, so saving never nudges it by a time-zone day. */
            if (data.get("dueAt") === dateValue(task.dueAt)) data.set("keepDue", "1");
            startTransition(async () => {
              const result = await updateTask(data);
              if (!result.ok) return setError(result.error);
              const status = String(data.get("status")) as BoardStatus;
              if (status !== task.status) {
                const problem = await onStatusChange(task.id, status);
                if (problem) return setError(problem);
              }
              router.refresh();
              close();
            });
          }}
          className="flex max-h-[inherit] flex-col"
        >
          <header className="border-line flex items-start gap-4 border-b px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                {task.projectCode ? `${task.projectCode} · ` : ""}
                {taskStatusLabels[task.status]}
              </p>
              {canEdit ? (
                <input
                  name="title"
                  defaultValue={task.title}
                  required
                  maxLength={160}
                  aria-label="Title"
                  className="text-primary mt-1 w-full bg-transparent text-para font-semibold outline-none"
                />
              ) : (
                <h2 className="text-primary mt-1 text-para font-semibold">{task.title}</h2>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="text-muted hover:bg-raised hover:text-primary flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
            >
              <RiCloseLine size={18} aria-hidden />
            </button>
          </header>

          <div className="flex flex-col gap-4 overflow-y-auto p-5">
            <Field label="Status">
              {canEdit ? (
                <select name="status" defaultValue={task.status} className={fieldClass}>
                  {BOARD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {taskStatusLabels[status]}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={task.status}
                  disabled={!canMove || pending}
                  onChange={(event) =>
                    startTransition(async () => {
                      setError(null);
                      const problem = await onStatusChange(task.id, event.target.value as BoardStatus);
                      if (problem) setError(problem);
                    })
                  }
                  className={fieldClass}
                >
                  {BOARD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {taskStatusLabels[status]}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            {canEdit ? (
              <>
                <Field label="Description">
                  <textarea
                    name="description"
                    defaultValue={task.description ?? ""}
                    rows={4}
                    maxLength={1000}
                    placeholder="Add detail, links or acceptance criteria"
                    className="border-line-input text-primary placeholder:text-muted rounded-lg border bg-transparent px-3.5 py-2.5 text-para outline-none"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Assignee">
                    <select name="assigneeId" defaultValue={task.assigneeId ?? ""} className={fieldClass}>
                      <option value="">Unassigned</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Project">
                    <select name="projectId" defaultValue={task.projectId ?? ""} className={fieldClass}>
                      <option value="">No project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.code})
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Due date">
                    <input name="dueAt" type="date" defaultValue={dateValue(task.dueAt)} className={fieldClass} />
                  </Field>
                  <Field label="Priority">
                    <select name="priority" defaultValue={task.priority} className={fieldClass}>
                      {(["low", "normal", "high"] as const).map((priority) => (
                        <option key={priority} value={priority}>
                          {priorityLabels[priority]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Description</dt>
                  <dd className="text-secondary mt-1 text-body whitespace-pre-line">
                    {task.description || "No description."}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Assignee</dt>
                  <dd className="mt-1 flex items-center gap-2 text-body">
                    {task.assigneeName ? (
                      <>
                        <Avatar name={task.assigneeName} src={task.assigneeAvatar} size="sm" />
                        {task.assigneeName}
                      </>
                    ) : (
                      "Unassigned"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Project</dt>
                  <dd className="mt-1 text-body">{task.projectName ?? "No project"}</dd>
                </div>
                <div>
                  <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Due</dt>
                  <dd className="mt-1 text-body">{task.dueAt ? new Date(task.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No due date"}</dd>
                </div>
                <div>
                  <dt className="text-muted text-tiny font-semibold tracking-wide uppercase">Priority</dt>
                  <dd className="mt-1 text-body">{priorityLabels[task.priority]}</dd>
                </div>
              </dl>
            )}

            {error ? (
              <p role="alert" className="bg-error-surface text-error-text border-error-border rounded-lg border px-3.5 py-2.5 text-body">
                {error}
              </p>
            ) : null}
          </div>

          <footer className="border-line flex items-center justify-between gap-2 border-t px-5 py-4">
            {canEdit ? (
              <Button
                type="button"
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  if (!confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
                  startTransition(async () => {
                    await deleteTask(task.id);
                    router.refresh();
                    close();
                  });
                }}
              >
                <RiDeleteBin6Line size={16} aria-hidden />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={close}>
                {canEdit ? "Cancel" : "Close"}
              </Button>
              {canEdit ? (
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving…" : "Save changes"}
                </Button>
              ) : null}
            </div>
          </footer>
        </form>
      ) : null}
    </dialog>
  );
}

/** Where a card lands when its status is changed from the dialog: the bottom of the new column. */
export function bottomOf(tasks: BoardTask[], status: BoardStatus) {
  const positions = tasks.filter((task) => task.status === status).map((task) => task.position);
  return positionBetween(positions.length > 0 ? Math.max(...positions) : null, null);
}
