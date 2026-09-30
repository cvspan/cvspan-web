import { RiAddLine, RiFilter3Line, RiMore2Fill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getAllTasks, getTasksFor, getTasksForTeam } from "@/db/queries";
import { formatDay, initials, relativeDays, taskStatusLabels } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { taskTone, type Tone } from "@/lib/tone";

const priorityTone: Record<string, Tone> = { high: "error", normal: "neutral", low: "neutral" };

export default async function TasksPage() {
  const user = await requireUser();

  const tasks = atLeast(user.viewRole, "admin")
    ? await getAllTasks()
    : atLeast(user.viewRole, "manager")
      ? [...(await getTasksFor(user.id)), ...(await getTasksForTeam(user.id))]
      : await getTasksFor(user.id);

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
            <Button variant="secondary">
              <RiFilter3Line size={18} aria-hidden />
              Filter
            </Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New task
            </Button>
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
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td className="w-10 pr-0">
                  <input
                    type="checkbox"
                    defaultChecked={task.status === "done"}
                    aria-label={task.title}
                    className="accent-brand size-4 cursor-pointer"
                  />
                </Td>
                <Td
                  className={
                    task.status === "done" ? "text-muted line-through" : "text-primary font-semibold"
                  }
                >
                  {task.title}
                </Td>
                <Td>{task.project ?? "—"}</Td>
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
                  <button
                    type="button"
                    aria-label={`Actions for ${task.title}`}
                    className="text-muted hover:text-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                  >
                    <RiMore2Fill size={18} aria-hidden />
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
