"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiUserAddLine,
  RiUserUnfollowLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, fieldClass } from "@/components/ui/dialog";
import { PeoplePicker, type PickerPerson } from "./people-picker";
import {
  addProjectMembers,
  createProject,
  deleteMilestone,
  deleteProject,
  postProjectUpdate,
  removeProjectMember,
  saveMilestone,
  setMilestoneStatus,
  setProjectMemberRole,
  setProjectStatus,
  updateProject,
} from "@/app/actions/projects";
import { createTask } from "@/app/actions/tasks";
import {
  milestoneStatuses,
  milestoneStatusLabels,
  projectRoleLabels,
  projectRoles,
  projectStatuses,
  projectStatusLabels,
  reportedHealthLabels,
  type MilestoneStatus,
  type ProjectRole,
  type ProjectStatus,
} from "@/lib/project";

const iconButton =
  "text-muted hover:bg-raised hover:text-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50";
const dangerIconButton =
  "text-muted hover:text-error-text hover:bg-error-surface flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50";

type DepartmentOption = { id: string; name: string };

type ProjectValues = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  departmentId: string | null;
  status: ProjectStatus;
  startDate: string | null;
  targetDate: string | null;
  updatedAt: Date;
};

function ProjectFields({
  project,
  departments,
  leads,
}: {
  project?: ProjectValues;
  departments: DepartmentOption[];
  /** Offered on create only; afterwards the lead is a role on the team list. */
  leads?: { id: string; name: string }[];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <Field label="Project name">
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={project?.name}
            placeholder="e.g. Website relaunch"
            className={fieldClass}
          />
        </Field>
        <Field label="Code" hint={project ? undefined : "Blank to generate one"}>
          <input
            name="code"
            maxLength={8}
            defaultValue={project?.code}
            placeholder="WEB"
            className={`${fieldClass} uppercase`}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={project?.description ?? ""}
          placeholder="What is this project for, and what does done look like?"
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Department">
          <select name="departmentId" defaultValue={project?.departmentId ?? ""} className={fieldClass}>
            <option value="">No department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={project?.status ?? "planning"} className={fieldClass}>
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {projectStatusLabels[status]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date">
          <input name="startDate" type="date" defaultValue={project?.startDate ?? ""} className={fieldClass} />
        </Field>
        <Field label="Target date">
          <input name="targetDate" type="date" defaultValue={project?.targetDate ?? ""} className={fieldClass} />
        </Field>
      </div>

      {leads ? (
        <Field label="Project lead" hint="Leads run the schedule: milestones, status and updates.">
          <select name="leadId" defaultValue="" className={fieldClass}>
            <option value="">Assign later</option>
            {leads.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
    </>
  );
}

export function NewProjectButton({
  departments,
  people,
  defaultDepartmentId,
}: {
  departments: DepartmentOption[];
  people: { id: string; name: string }[];
  defaultDepartmentId?: string;
}) {
  return (
    <Dialog
      trigger={
        <Button>
          <RiAddLine size={18} aria-hidden />
          New project
        </Button>
      }
      title="New project"
      description="Set the window now; add people, milestones and tasks from the project page."
      submitLabel="Create project"
      action={createProject}
      wide
    >
      <ProjectFields
        departments={departments}
        leads={people}
        project={
          defaultDepartmentId
            ? ({ departmentId: defaultDepartmentId, status: "planning" } as ProjectValues)
            : undefined
        }
      />
    </Dialog>
  );
}

export function EditProjectButton({
  project,
  departments,
}: {
  project: ProjectValues;
  departments: DepartmentOption[];
}) {
  return (
    <Dialog
      key={project.updatedAt.toISOString()}
      trigger={
        <Button variant="secondary">
          <RiEditLine size={18} aria-hidden />
          Edit
        </Button>
      }
      title="Edit project"
      submitLabel="Save changes"
      action={updateProject}
      wide
    >
      <input type="hidden" name="id" value={project.id} />
      <ProjectFields project={project} departments={departments} />
    </Dialog>
  );
}

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
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
      description="Its milestones, team and status updates are removed. Tasks stay, but are no longer attached to a project."
      submitLabel="Delete project"
      destructive
      action={async () => {
        const result = await deleteProject(id);
        if (result.ok) router.push("/projects");
        return result;
      }}
    >
      <p className="text-secondary text-body">
        You&apos;re about to delete <strong className="text-primary">{name}</strong>. This can&apos;t be undone.
      </p>
    </Dialog>
  );
}

/** Status changes are available to the lead too, so they live on the page rather than in Edit. */
export function ProjectStatusSelect({
  projectId,
  status,
}: {
  projectId: string;
  status: ProjectStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Project status"
      value={status}
      disabled={pending}
      onChange={(event) =>
        startTransition(async () => {
          const result = await setProjectStatus(projectId, event.target.value as ProjectStatus);
          if (!result.ok) alert(result.error);
          router.refresh();
        })
      }
      className={`${fieldClass} h-10 cursor-pointer py-0 pr-8 disabled:opacity-60`}
    >
      {projectStatuses.map((value) => (
        <option key={value} value={value}>
          {projectStatusLabels[value]}
        </option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------- Team */

export function AddMembersButton({
  projectId,
  projectName,
  people,
}: {
  projectId: string;
  projectName: string;
  people: PickerPerson[];
}) {
  return (
    <Dialog
      trigger={
        <Button size="sm">
          <RiUserAddLine size={16} aria-hidden />
          Add people
        </Button>
      }
      title={`Add people to ${projectName}`}
      description="They are notified and can see the project, its timeline and its tasks."
      submitLabel="Add to project"
      action={addProjectMembers}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <Field label="Role">
        <select name="role" defaultValue="contributor" className={fieldClass}>
          {projectRoles.map((role) => (
            <option key={role} value={role}>
              {projectRoleLabels[role]}
            </option>
          ))}
        </select>
      </Field>
      <PeoplePicker people={people} emptyLabel="Everyone is already on this project." />
    </Dialog>
  );
}

export function MemberRoleSelect({
  projectId,
  userId,
  role,
  name,
}: {
  projectId: string;
  userId: string;
  role: ProjectRole;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label={`Project role for ${name}`}
      value={role}
      disabled={pending}
      onChange={(event) =>
        startTransition(async () => {
          const result = await setProjectMemberRole(projectId, userId, event.target.value as ProjectRole);
          if (!result.ok) alert(result.error);
          router.refresh();
        })
      }
      className="border-line-input text-primary h-8 w-28 cursor-pointer rounded-lg border bg-transparent px-2 text-caption outline-none disabled:opacity-60"
    >
      {projectRoles.map((value) => (
        <option key={value} value={value}>
          {projectRoleLabels[value]}
        </option>
      ))}
    </select>
  );
}

export function RemoveMemberButton({
  projectId,
  userId,
  name,
}: {
  projectId: string;
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Remove ${name} from the project`}
      title="Remove from project"
      onClick={() => {
        if (!confirm(`Remove ${name} from this project? Their tasks stay assigned to them.`)) return;
        startTransition(async () => {
          const result = await removeProjectMember(projectId, userId);
          if (!result.ok) alert(result.error);
          router.refresh();
        });
      }}
      className={dangerIconButton}
    >
      <RiUserUnfollowLine size={18} aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------------- Milestones */

type MilestoneValues = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  dueDate: string;
  status: MilestoneStatus;
};

export function MilestoneButton({
  projectId,
  milestone,
}: {
  projectId: string;
  milestone?: MilestoneValues;
}) {
  return (
    <Dialog
      trigger={
        milestone ? (
          <button type="button" aria-label={`Edit ${milestone.title}`} title="Edit milestone" className={iconButton}>
            <RiEditLine size={18} aria-hidden />
          </button>
        ) : (
          <Button size="sm">
            <RiAddLine size={16} aria-hidden />
            Add milestone
          </Button>
        )
      }
      title={milestone ? "Edit milestone" : "Add milestone"}
      description="A start date draws it as a bar on the timeline; without one it shows as a single marker."
      submitLabel={milestone ? "Save changes" : "Add milestone"}
      action={saveMilestone}
    >
      <input type="hidden" name="projectId" value={projectId} />
      {milestone ? <input type="hidden" name="id" value={milestone.id} /> : null}

      <Field label="Title">
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={milestone?.title}
          placeholder="e.g. Design sign-off"
          className={fieldClass}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" hint="Optional">
          <input name="startDate" type="date" defaultValue={milestone?.startDate ?? ""} className={fieldClass} />
        </Field>
        <Field label="Due date">
          <input name="dueDate" type="date" required defaultValue={milestone?.dueDate} className={fieldClass} />
        </Field>
      </div>
      <Field label="Status">
        <select name="status" defaultValue={milestone?.status ?? "not_started"} className={fieldClass}>
          {milestoneStatuses.map((status) => (
            <option key={status} value={status}>
              {milestoneStatusLabels[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes">
        <textarea
          name="description"
          rows={2}
          maxLength={500}
          defaultValue={milestone?.description ?? ""}
          className={`${fieldClass} h-auto py-2.5`}
        />
      </Field>
    </Dialog>
  );
}

export function MilestoneDoneToggle({
  milestoneId,
  status,
  title,
}: {
  milestoneId: string;
  status: MilestoneStatus;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={status === "done"}
      disabled={pending}
      aria-label={`Mark “${title}” as ${status === "done" ? "not done" : "done"}`}
      onChange={(event) =>
        startTransition(async () => {
          const result = await setMilestoneStatus(milestoneId, event.target.checked ? "done" : "in_progress");
          if (!result.ok) alert(result.error);
          router.refresh();
        })
      }
      className="accent-brand size-4 cursor-pointer"
    />
  );
}

export function DeleteMilestoneButton({ milestoneId, title }: { milestoneId: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Delete “${title}”`}
      title="Delete milestone"
      onClick={() => {
        if (!confirm(`Delete the milestone “${title}”? Its tasks stay on the project.`)) return;
        startTransition(async () => {
          const result = await deleteMilestone(milestoneId);
          if (!result.ok) alert(result.error);
          router.refresh();
        });
      }}
      className={dangerIconButton}
    >
      <RiDeleteBin6Line size={18} aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------------------ Tasks */

export function NewProjectTaskButton({
  projectId,
  members,
  milestones,
  defaultAssigneeId,
}: {
  projectId: string;
  members: { id: string; name: string }[];
  milestones: { id: string; title: string }[];
  defaultAssigneeId?: string;
}) {
  return (
    <Dialog
      trigger={
        <Button size="sm">
          <RiAddLine size={16} aria-hidden />
          Add task
        </Button>
      }
      title="Add task"
      description="Finished tasks move the project's progress."
      submitLabel="Add task"
      action={createTask}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <Field label="Title">
        <input name="title" required maxLength={160} placeholder="What needs doing?" className={fieldClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Assignee">
          <select name="assigneeId" defaultValue={defaultAssigneeId ?? members[0]?.id} className={fieldClass}>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Milestone">
          <select name="milestoneId" defaultValue="" className={fieldClass}>
            <option value="">None</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Due date">
          <input name="dueAt" type="date" className={fieldClass} />
        </Field>
        <Field label="Priority">
          <select name="priority" defaultValue="normal" className={fieldClass}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </Field>
      </div>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- Updates */

export function PostUpdateForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        startTransition(async () => {
          const result = await postProjectUpdate(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setError(null);
          form.reset();
          router.refresh();
        });
      }}
      className="border-line flex flex-col gap-3 border-b p-5"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <label className="flex flex-col gap-1.5">
        <span className="text-primary text-body font-semibold">Post an update</span>
        <textarea
          name="body"
          required
          rows={3}
          maxLength={1500}
          placeholder="What moved this week, what's blocked, what's next?"
          className={`${fieldClass} h-auto py-2.5`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <select
          name="health"
          defaultValue="on_track"
          aria-label="How is the project going?"
          className={`${fieldClass} h-10 w-auto cursor-pointer py-0 pr-8`}
        >
          {(Object.keys(reportedHealthLabels) as (keyof typeof reportedHealthLabels)[]).map((key) => (
            <option key={key} value={key}>
              {reportedHealthLabels[key]}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={pending}>
          {pending ? "Posting…" : "Post update"}
        </Button>
        {error ? (
          <span role="alert" className="text-error-text text-body">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
