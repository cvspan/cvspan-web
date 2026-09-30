import { RiAddLine, RiFilter3Line, RiMore2Fill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { tasks, type TaskStatus, type Tone } from "@/lib/mock-data";

const statusTone: Record<TaskStatus, Tone> = {
  "To do": "neutral",
  "In progress": "accent",
  Overdue: "error",
  Done: "success",
};

const priorityTone: Record<string, Tone> = {
  High: "error",
  Normal: "neutral",
  Low: "neutral",
};

const summary: { label: string; count: number; tone: Tone }[] = [
  { label: "Overdue", count: tasks.filter((t) => t.status === "Overdue").length, tone: "error" },
  { label: "In progress", count: tasks.filter((t) => t.status === "In progress").length, tone: "accent" },
  { label: "To do", count: tasks.filter((t) => t.status === "To do").length, tone: "neutral" },
  { label: "Done", count: tasks.filter((t) => t.status === "Done").length, tone: "success" },
];

export default function TasksPage() {
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
        <Table>
          <Thead columns={["", "Task", "Project", "Assignee", "Due", "Priority", "Status", ""]} />
          <tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td className="w-10 pr-0">
                  <input
                    type="checkbox"
                    defaultChecked={task.done}
                    aria-label={task.title}
                    className="accent-brand size-4 cursor-pointer"
                  />
                </Td>
                <Td
                  className={
                    task.done ? "text-muted line-through" : "text-primary font-semibold"
                  }
                >
                  {task.title}
                </Td>
                <Td>{task.project}</Td>
                <Td>
                  <span className="flex items-center gap-2">
                    <span className="bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                      {task.assigneeInitials}
                    </span>
                    <span className="whitespace-nowrap">{task.assignee}</span>
                  </span>
                </Td>
                <Td className="whitespace-nowrap">{task.due}</Td>
                <Td>
                  <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
                </Td>
                <Td>
                  <Badge tone={statusTone[task.status]}>{task.status}</Badge>
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
