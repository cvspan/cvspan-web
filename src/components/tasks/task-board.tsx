"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  RiAddLine,
  RiAlignLeft,
  RiCalendarLine,
  RiCloseLine,
  RiFlagFill,
  RiSearchLine,
} from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { createTask, moveTask } from "@/app/actions/tasks";
import {
  BOARD_STATUSES,
  applyFilters,
  dueState,
  groupByStatus,
  hasFilters,
  isArchivedDone,
  moveInList,
  noFilters,
  positionBetween,
  type BoardFilters,
  type BoardStatus,
  type BoardTask,
  type DueState,
} from "@/lib/board";
import { taskStatusLabels } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TaskDialog, bottomOf, type BoardPerson, type BoardProject } from "./task-dialog";

const columnDot: Record<BoardStatus, string> = {
  todo: "bg-muted",
  in_progress: "bg-brand",
  blocked: "bg-warning-text",
  done: "bg-success-text",
};

const emptyHint: Record<BoardStatus, string> = {
  todo: "Nothing waiting. Drop a task here to put it back in the queue.",
  in_progress: "Drop a task here when you start on it.",
  blocked: "Tasks that are stuck on something go here.",
  done: "Finished tasks land here.",
};

const dueClass: Record<DueState, string> = {
  overdue: "bg-error-surface text-error-text border-error-border",
  today: "bg-warning-surface text-warning-text border-warning-border",
  soon: "bg-warning-surface text-warning-text border-warning-border",
  later: "bg-raised text-secondary border-line",
};

const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function dueLabel(task: BoardTask, state: DueState | null) {
  if (!task.dueAt) return null;
  if (state === "today") return "Today";
  return shortDate.format(new Date(task.dueAt));
}

type Items = Record<BoardStatus, string[]>;

const toItems = (tasks: BoardTask[]): Items => {
  const grouped = groupByStatus(tasks);
  return Object.fromEntries(BOARD_STATUSES.map((status) => [status, grouped[status].map((task) => task.id)])) as Items;
};

const containerOf = (items: Items, id: string): BoardStatus | undefined =>
  (BOARD_STATUSES as readonly string[]).includes(id)
    ? (id as BoardStatus)
    : BOARD_STATUSES.find((status) => items[status].includes(id));

export function TaskBoard({
  tasks: serverTasks,
  people,
  projects,
  userId,
  canCreate,
  canEdit,
  canMoveAll,
}: {
  tasks: BoardTask[];
  /** Who a manager can assign to; empty for members, who can't assign. */
  people: BoardPerson[];
  projects: BoardProject[];
  userId: string;
  /** Managers and above add tasks. */
  canCreate: boolean;
  /** Managers and above edit details and delete. */
  canEdit: boolean;
  /** Managers and above may move anyone's task; others only their own. */
  canMoveAll: boolean;
}) {
  const router = useRouter();

  /** The board updates on drop and the server catches up; if it refuses, the move is undone. */
  const [tasks, setTasks] = useState(serverTasks);
  const [seen, setSeen] = useState(serverTasks);
  if (serverTasks !== seen) {
    setSeen(serverTasks);
    setTasks(serverTasks);
  }

  const [filters, setFilters] = useState<BoardFilters>(noFilters);
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drag, setDrag] = useState<Items | null>(null);
  const [adding, setAdding] = useState<BoardStatus | null>(null);

  const byId = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const archived = useMemo(() => tasks.filter((task) => isArchivedDone(task)), [tasks]);

  const filtered = useMemo(
    () => applyFilters(showArchived ? tasks : tasks.filter((task) => !isArchivedDone(task)), filters),
    [tasks, filters, showArchived],
  );
  const base = useMemo(() => toItems(filtered), [filtered]);
  const columns = drag ?? base;

  const canMove = (task: BoardTask) => canMoveAll || task.assigneeId === userId;

  /** Come back to a tab and see what teammates changed while you were away. */
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [router]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** Sends a move to the server; on a refusal, restores the board as it was and says why. */
  async function commitMove(taskId: string, status: BoardStatus, position: number): Promise<string | null> {
    const before = tasks;
    setTasks((current) => moveInList(current, taskId, status, position));
    setError(null);

    const result = await moveTask(taskId, status, position);
    if (!result.ok) {
      setTasks(before);
      setError(result.error);
      return result.error;
    }
    router.refresh();
    return null;
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    setDrag(base);
    setError(null);
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over || !drag) return;
    const from = containerOf(drag, String(active.id));
    const to = containerOf(drag, String(over.id));
    if (!from || !to || from === to) return;

    setDrag((current) => {
      if (!current) return current;
      const target = current[to];
      const overIndex = target.indexOf(String(over.id));
      const below =
        over.rect && active.rect.current.translated
          ? active.rect.current.translated.top > over.rect.top + over.rect.height / 2
          : false;
      const index = overIndex >= 0 ? overIndex + (below ? 1 : 0) : target.length;

      return {
        ...current,
        [from]: current[from].filter((id) => id !== String(active.id)),
        [to]: [...target.slice(0, index), String(active.id), ...target.slice(index)],
      };
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const id = String(active.id);
    let final = drag;
    setActiveId(null);

    if (final && over) {
      const from = containerOf(final, id);
      const to = containerOf(final, String(over.id));
      if (from && to && from === to) {
        const oldIndex = final[from].indexOf(id);
        const newIndex = final[to].indexOf(String(over.id));
        if (newIndex >= 0 && oldIndex !== newIndex) {
          final = { ...final, [from]: arrayMove(final[from], oldIndex, newIndex) };
        }
      }
    }
    setDrag(null);
    if (!final) return;

    const status = containerOf(final, id);
    const task = byId.get(id);
    if (!status || !task) return;

    const list = final[status];
    const index = list.indexOf(id);
    const before = index > 0 ? (byId.get(list[index - 1])?.position ?? null) : null;
    const after = index < list.length - 1 ? (byId.get(list[index + 1])?.position ?? null) : null;

    /** Dropped where it already was: nothing to save. */
    if (status === task.status && ((before === null || before < task.position) && (after === null || after > task.position))) return;

    void commitMove(id, status, positionBetween(before, after));
  }

  const activeTask = activeId ? byId.get(activeId) : undefined;
  const openTask = openId ? (byId.get(openId) ?? null) : null;

  const overdueCount = tasks.filter((task) => dueState(task.dueAt, task.status) === "overdue").length;
  const total = filtered.length;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        filters={filters}
        onChange={setFilters}
        people={people}
        projects={projects}
        overdueCount={overdueCount}
        total={total}
      />

      {serverTasks.length === 0 && !canCreate ? (
        <p className="border-line bg-card text-secondary rounded-lg border px-4 py-3 text-body">
          Nothing is assigned to you yet. When your manager gives you a task it will appear in To do.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="bg-error-surface text-error-text border-error-border flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-body">
          {error}
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss" className="cursor-pointer">
            <RiCloseLine size={16} aria-hidden />
          </button>
        </p>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setActiveId(null);
          setDrag(null);
        }}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) => `Picked up ${byId.get(String(active.id))?.title ?? "task"}.`,
            onDragOver: ({ over }) => (over ? `Over ${taskStatusLabels[containerOf(columns, String(over.id)) ?? "todo"]}.` : ""),
            onDragEnd: ({ over }) => (over ? `Dropped in ${taskStatusLabels[containerOf(columns, String(over.id)) ?? "todo"]}.` : "Dropped."),
            onDragCancel: () => "Move cancelled.",
          },
        }}
      >
        <div
          role="group"
          aria-label="Task board"
          className="grid snap-x snap-mandatory auto-cols-[minmax(17rem,85vw)] grid-flow-col gap-4 overflow-x-auto pb-2 sm:auto-cols-[minmax(17rem,1fr)]"
        >
          {BOARD_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              ids={columns[status]}
              byId={byId}
              canCreate={canCreate}
              adding={adding === status}
              onToggleAdd={() => setAdding((current) => (current === status ? null : status))}
              onAdded={() => {
                setAdding(null);
                router.refresh();
              }}
              userId={userId}
              canMove={canMove}
              onOpen={setOpenId}
              footer={
                status === "done" && archived.length > 0 && !hasFilters(filters) ? (
                  <button
                    type="button"
                    onClick={() => setShowArchived((value) => !value)}
                    className="text-accent hover:bg-raised w-full cursor-pointer rounded-lg px-2 py-1.5 text-caption font-semibold transition-colors"
                  >
                    {showArchived ? "Hide older tasks" : `Show ${archived.length} older done`}
                  </button>
                ) : null
              }
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 160 }}>
          {activeTask ? <CardBody task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        task={openTask}
        people={people}
        projects={projects}
        canEdit={canEdit}
        canMove={openTask ? canMove(openTask) : false}
        onClose={() => setOpenId(null)}
        onStatusChange={(id, status) => commitMove(id, status, bottomOf(tasks, status))}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ Toolbar */

function Toolbar({
  filters,
  onChange,
  people,
  projects,
  overdueCount,
  total,
}: {
  filters: BoardFilters;
  onChange: (next: BoardFilters) => void;
  people: BoardPerson[];
  projects: BoardProject[];
  overdueCount: number;
  total: number;
}) {
  const set = (patch: Partial<BoardFilters>) => onChange({ ...filters, ...patch });
  const select =
    "border-line bg-card text-secondary hover:bg-raised h-9 cursor-pointer rounded-lg border px-2.5 text-body outline-none";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="border-line bg-card focus-within:border-line-strong flex h-9 min-w-48 flex-1 items-center gap-2 rounded-lg border px-2.5 sm:max-w-72">
        <RiSearchLine size={16} className="text-muted" aria-hidden />
        <span className="sr-only">Search tasks</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => set({ search: event.target.value })}
          placeholder="Search tasks"
          className="text-primary placeholder:text-muted min-w-0 flex-1 bg-transparent text-body outline-none"
        />
      </label>

      {people.length > 1 ? (
        <select aria-label="Filter by assignee" value={filters.assigneeId} onChange={(e) => set({ assigneeId: e.target.value })} className={select}>
          <option value="">Everyone</option>
          <option value="none">Unassigned</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      ) : null}

      {projects.length > 0 ? (
        <select aria-label="Filter by project" value={filters.projectId} onChange={(e) => set({ projectId: e.target.value })} className={select}>
          <option value="">All projects</option>
          <option value="none">No project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      ) : null}

      <select aria-label="Filter by priority" value={filters.priority} onChange={(e) => set({ priority: e.target.value })} className={select}>
        <option value="">Any priority</option>
        <option value="high">High</option>
        <option value="normal">Normal</option>
        <option value="low">Low</option>
      </select>

      <button
        type="button"
        aria-pressed={filters.overdueOnly}
        onClick={() => set({ overdueOnly: !filters.overdueOnly })}
        className={cn(
          "h-9 cursor-pointer rounded-lg border px-2.5 text-body font-semibold transition-colors",
          filters.overdueOnly
            ? "bg-error-surface text-error-text border-error-border"
            : "border-line bg-card text-secondary hover:bg-raised",
        )}
      >
        Overdue{overdueCount > 0 ? ` (${overdueCount})` : ""}
      </button>

      {hasFilters(filters) ? (
        <button
          type="button"
          onClick={() => onChange(noFilters)}
          className="text-accent h-9 cursor-pointer px-1 text-body font-semibold hover:underline"
        >
          Clear
        </button>
      ) : null}

      <span className="text-muted ml-auto text-caption" aria-live="polite">
        {total} {total === 1 ? "task" : "tasks"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------- Column */

function Column({
  status,
  ids,
  byId,
  canCreate,
  adding,
  onToggleAdd,
  onAdded,
  userId,
  canMove,
  onOpen,
  footer,
}: {
  status: BoardStatus;
  ids: string[];
  byId: Map<string, BoardTask>;
  canCreate: boolean;
  adding: boolean;
  onToggleAdd: () => void;
  onAdded: () => void;
  userId: string;
  canMove: (task: BoardTask) => boolean;
  onOpen: (id: string) => void;
  footer: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      aria-label={`${taskStatusLabels[status]}, ${ids.length} tasks`}
      className="bg-raised/60 border-line flex max-h-[calc(100dvh-14rem)] min-h-64 snap-start flex-col rounded-lg border"
    >
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span aria-hidden className={cn("size-2 rounded-full", columnDot[status])} />
        <h2 className="text-primary text-body font-semibold">{taskStatusLabels[status]}</h2>
        <span className="bg-card border-line text-secondary rounded-full border px-1.5 text-tiny font-semibold">
          {ids.length}
        </span>
        {canCreate ? (
          <button
            type="button"
            onClick={onToggleAdd}
            aria-label={`Add a task to ${taskStatusLabels[status]}`}
            aria-expanded={adding}
            className="text-muted hover:bg-card hover:text-primary ml-auto flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors"
          >
            <RiAddLine size={18} aria-hidden />
          </button>
        ) : null}
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 transition-colors",
          isOver && "bg-accent-soft/50 rounded-b-lg",
        )}
      >
        {adding ? <QuickAdd status={status} userId={userId} onDone={onAdded} /> : null}

        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {ids.map((id) => {
            const task = byId.get(id);
            return task ? <SortableCard key={id} task={task} movable={canMove(task)} onOpen={onOpen} /> : null;
          })}
        </SortableContext>

        {ids.length === 0 && !adding ? (
          <p className="border-line text-muted rounded-lg border border-dashed px-3 py-6 text-center text-caption">
            {emptyHint[status]}
          </p>
        ) : null}

        {footer}
      </div>
    </section>
  );
}

/** A title box at the top of a column: Enter adds the task, Escape cancels. */
function QuickAdd({ status, userId, onDone }: { status: BoardStatus; userId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const value = title.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);

    const data = new FormData();
    data.set("title", value);
    data.set("status", status);
    data.set("assigneeId", userId);
    const result = await createTask(data);
    setBusy(false);

    if (!result.ok) return setError(result.error);
    setTitle("");
    onDone();
  }

  return (
    <div className="bg-card border-line rounded-lg border p-2 shadow-sm">
      <input
        autoFocus
        value={title}
        disabled={busy}
        maxLength={160}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void submit();
          }
          if (event.key === "Escape") onDone();
        }}
        placeholder="What needs doing? Press Enter"
        aria-label={`New ${taskStatusLabels[status]} task title`}
        className="text-primary placeholder:text-muted w-full bg-transparent px-1 py-1 text-body outline-none"
      />
      {error ? (
        <p role="alert" className="text-error-text px-1 pt-1 text-caption">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------------- Card */

function SortableCard({ task, movable, onOpen }: { task: BoardTask; movable: boolean; onOpen: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !movable,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("touch-manipulation", isDragging && "opacity-40")}
      {...attributes}
      {...listeners}
    >
      <CardBody task={task} movable={movable} onOpen={() => onOpen(task.id)} />
    </div>
  );
}

function CardBody({
  task,
  onOpen,
  overlay = false,
  movable = true,
}: {
  task: BoardTask;
  onOpen?: () => void;
  overlay?: boolean;
  movable?: boolean;
}) {
  const state = dueState(task.dueAt, task.status);
  const due = dueLabel(task, state);

  return (
    <article
      className={cn(
        "bg-card border-line group rounded-lg border p-3 shadow-xs transition-shadow",
        movable ? "cursor-grab active:cursor-grabbing" : "cursor-default",
        overlay ? "rotate-1 shadow-lg" : "hover:shadow-sm",
      )}
    >
      {task.projectCode || task.priority !== "normal" ? (
        <div className="mb-1.5 flex items-center gap-2 text-tiny font-semibold">
          {task.projectCode ? (
            <span className="bg-raised text-secondary rounded px-1.5 py-0.5 tracking-wide uppercase">{task.projectCode}</span>
          ) : null}
          {task.priority === "high" ? (
            <span className="text-error-text flex items-center gap-1">
              <RiFlagFill size={12} aria-hidden /> High
            </span>
          ) : task.priority === "low" ? (
            <span className="text-muted">Low</span>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "w-full cursor-pointer text-left text-body font-semibold break-words outline-offset-2",
          task.status === "done" ? "text-muted line-through" : "text-primary",
        )}
      >
        {task.title}
      </button>

      <div className="mt-2.5 flex items-center gap-2">
        {due ? (
          <span className={cn("flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-tiny font-semibold", dueClass[state ?? "later"])}>
            <RiCalendarLine size={12} aria-hidden />
            {state === "overdue" ? `Overdue · ${due}` : due}
          </span>
        ) : null}
        {task.description ? <RiAlignLeft size={14} className="text-muted" aria-label="Has a description" /> : null}
        <span className="ml-auto">
          {task.assigneeName ? <Avatar name={task.assigneeName} src={task.assigneeAvatar} size="sm" /> : null}
        </span>
      </div>
    </article>
  );
}
