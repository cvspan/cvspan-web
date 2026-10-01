import Link from "next/link";
import { RiDownloadLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { DeleteTaskButton, NewTaskButton, TaskCheckbox } from "@/components/forms/task-forms";
import { TaskFilter } from "@/components/forms/task-filter";
import { getAllTasks, getDirectReports, getPeople, getTasksFor, getTasksForTeam } from "@/db/queries";
import { getProjectOptions } from "@/db/queries-projects";
import { formatDay, initials, relativeDays, taskStatusLabels } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { taskTone, type Tone } from "@/lib/tone";

const priorityTone: Record<string, Tone> = { high: "error", normal: "neutral", low: "neutral" };

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status: statusFilter } = await searchParams;

  const tasks = atLeast(user.viewRole, "admin")
    ? await getAllTasks()
    : atLeast(user.viewRole, "manager")
      ? [...(await getTasksFor(user.id)), ...(await getTasksForTeam(user.id))]
      : await getTasksFor(user.id);

  const assignable = atLeast(user.viewRole, "admin")
    ? (await getPeople()).map((person) => ({ id: person.id, name: person.name }))
    : atLeast(user.viewRole, "manager")
      ? [{ id: user.id, name: `${user.name} (me)` }, ...(await getDirectReports(user.id))]
      : [{ id: user.id, name: user.name }];

  const projectOptions = await getProjectOptions(
    atLeast(user.viewRole, "admin") ? undefined : user.id,
  );

  const visible =
    statusFilter && statusFilter !== "all"
      ? tasks.filter((task) =>
          statusFilter === "overdue"
            ? task.status !== "done" && task.dueAt && new Date(task.dueAt) < new Date()
            : task.status === statusFilter,
        )
      : tasks;

  const overdue = tasks.filter(
    (task) => task.status !== "done" && task.dueAt && new Date(task.dueAt) < new Date(),
  );

  const summary: { label: string; count: number; tone: Tone }[] = [
    { label: "Overdue", count: overdue.length, tone: "error" },
    {
      label: "In progress",
      count: tasks.filter((task) => task.status === "in_progress").length,
      tone: "accent",
    },
    { label: "To do", count: tasks.filter((task) => task.status === "todo").length, tone: "neutral" },
    { label: "Done", count: tasks.filter((task) => task.status === "done").length, tone: "success" },
  ];

  const scope = atLeast(user.viewRole, "admin")
    ? "Everyone"
    : atLeast(user.viewRole, "manager")
      ? "My team and me"
      : "Assigned to me";

  return (
    <>
      <PageHeader
        pretitle="Work"
        title="Tasks"
        actions={
          <>
            <TaskFilter value={statusFilter ?? "all"} />
            {atLeast(user.viewRole, "manager") ? (
              <a href="/api/export/tasks" download>
                <Button variant="secondary" type="button">
                  <RiDownloadLine size={18} aria-hidden />
                  Export
                </Button>
              </a>
            ) : null}
            <NewTaskButton people={assignable} projects={projectOptions} defaultAssigneeId={user.id} />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {item.label}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <span className="text-primary text-h5 font-semibold">{item.count}</span>
              <Badge tone={item.tone}>{item.label}</Badge>
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <header className="border-line flex items-center justify-between gap-4 border-b px-5 py-4">
          <h2 className="text-primary text-para font-semibold">All tasks</h2>
          <Badge>{scope}</Badge>
        </header>
        <Table>
          <Thead columns={["", "Task", "Project", "Assignee", "Due", "Priority", "Status", ""]} />
          <tbody>
            {visible.map((task) => (
              <Tr key={task.id}>
                <Td className="w-10 pr-0">
                  <TaskCheckbox
                    taskId={task.id}
                    done={task.status === "done"}
                    label={task.title}
                  />
                </Td>
                <Td
                  className={
                    task.status === "done" ? "text-muted line-through" : "text-primary font-semibold"
                  }
                >
                  {task.title}
                </Td>
                <Td className="whitespace-nowrap">
                  {task.projectId ? (
                    <Link href={`/projects/${task.projectId}`} className="hover:text-accent">
                      {task.projectName}
                    </Link>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <span className="flex items-center gap-2">
                    <span className="bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {initials(task.assigneeName ?? "—")}
                    </span>
                    <span className="whitespace-nowrap">{task.assigneeName ?? "Unassigned"}</span>
                  </span>
                </Td>
                <Td className="whitespace-nowrap">
                  {formatDay(task.dueAt)}
                  <span className="text-muted block text-tiny">{relativeDays(task.dueAt)}</span>
                </Td>
                <Td>
                  <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
                </Td>
                <Td>
                  <Badge tone={taskTone(task.status, task.dueAt)}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                </Td>
                <Td className="w-12">
                  {atLeast(user.viewRole, "manager") ? (
                    <DeleteTaskButton taskId={task.id} label={task.title} />
                  ) : null}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
