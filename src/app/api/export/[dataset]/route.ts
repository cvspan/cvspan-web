import { auth } from "@/auth";
import { getAllTasks, getPeople } from "@/db/queries";
import { employmentLabels, taskStatusLabels } from "@/lib/format";
import { atLeast, roleLabels } from "@/lib/roles";

/** Minimal CSV escaping: quote everything, double internal quotes. */
function toCsv(rows: string[][]) {
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dataset: string }> },
) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorised", { status: 401 });

  const { dataset } = await params;

  if (dataset === "people") {
    if (!atLeast(session.user.role, "admin")) return new Response("Forbidden", { status: 403 });

    const people = await getPeople();
    const csv = toCsv([
      ["Name", "Email", "Job title", "Department", "Employment type", "Access", "Status", "Started"],
      ...people.map((person) => [
        person.name,
        person.email,
        person.jobTitle ?? "",
        person.department ?? "",
        employmentLabels[person.employmentType],
        roleLabels[person.role],
        person.status,
        person.startDate ?? "",
      ]),
    ]);

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="cvspan-people-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (dataset === "tasks") {
    if (!atLeast(session.user.role, "manager")) return new Response("Forbidden", { status: 403 });

    const tasks = await getAllTasks();
    const csv = toCsv([
      ["Task", "Project", "Assignee", "Status", "Priority", "Due"],
      ...tasks.map((task) => [
        task.title,
        task.project ?? "",
        task.assigneeName ?? "",
        taskStatusLabels[task.status],
        task.priority,
        task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : "",
      ]),
    ]);

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="cvspan-tasks-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return new Response("Unknown dataset", { status: 404 });
}
