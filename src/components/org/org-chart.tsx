"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiArrowDownSLine, RiArrowUpSLine, RiZoomInLine, RiZoomOutLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { EditPositionButton } from "@/components/org/edit-position";
import { pluralise } from "@/lib/format";
import type { ChartNode } from "@/lib/org-chart";
import type { Level } from "@/lib/org";
import { cn } from "@/lib/utils";
import "./org-chart.css";

type Member = ChartNode["person"] & { status?: string };
type Node = ChartNode<Member>;

type Settings = { canEdit: boolean; linkProfiles: boolean; youId?: string };
const SettingsContext = createContext<Settings>({ canEdit: false, linkProfiles: false });

/** Expand all / Collapse all: each branch listens for a new command number and follows it. */
type Command = { open: boolean; id: number };
const CommandContext = createContext<Command>({ open: true, id: 0 });

const levelText: Record<Level, string> = {
  ceo: "text-accent",
  head: "text-success-text",
  manager: "text-secondary",
  member: "text-muted",
};

const count = (nodes: Node[]): number => nodes.reduce((total, node) => total + 1 + count(node.children), 0);

export function OrgChart({
  nodes,
  canEdit = false,
  linkProfiles = false,
  youId,
  showLegend = false,
}: {
  nodes: Node[];
  canEdit?: boolean;
  linkProfiles?: boolean;
  youId?: string;
  /** Explains the highlights; shown when the chart is centred on the viewer. */
  showLegend?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);

  const inner = useRef<HTMLDivElement>(null);

  /**
   * A chart wider than the page opens centred on the top of the organisation, not at its left edge.
   * It re-centres as the chart settles (styles and fonts load, branches open) until the person
   * scrolls it themselves.
   */
  useEffect(() => {
    const el = scroller.current;
    const content = inner.current;
    if (!el || !content) return;

    let touched = false;
    const centre = () => {
      if (!touched) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    };
    const stop = () => {
      touched = true;
    };
    el.addEventListener("pointerdown", stop, { once: true });
    el.addEventListener("wheel", stop, { once: true });

    const observer = new ResizeObserver(centre);
    observer.observe(content);
    centre();
    return () => {
      observer.disconnect();
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
    };
  }, [nodes]);

  const [command, setCommand] = useState<Command>({ open: true, id: 0 });
  /** A big organisation opens to its managers, and people open from there; a small one opens fully. */
  const openDepth = count(nodes) > 30 ? 2 : Infinity;

  return (
    <SettingsContext.Provider value={{ canEdit, linkProfiles, youId }}>
      <CommandContext.Provider value={command}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          {showLegend ? (
            <ul className="text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-caption" aria-label="Key">
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="border-brand bg-accent-soft size-3 rounded-sm border" />
                You
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="border-brand size-3 rounded-sm border" />
                Your reporting line
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="bg-raised border-line size-3 rounded-sm border" />
                Your department
              </li>
            </ul>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1" role="toolbar" aria-label="Chart controls">
            <ToolbarButton onClick={() => setCommand((c) => ({ open: true, id: c.id + 1 }))} label="Expand all">
              <RiArrowDownSLine size={16} aria-hidden />
              <span className="hidden sm:inline">Expand all</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => setCommand((c) => ({ open: false, id: c.id + 1 }))} label="Collapse all">
              <RiArrowUpSLine size={16} aria-hidden />
              <span className="hidden sm:inline">Collapse all</span>
            </ToolbarButton>
            <span aria-hidden className="bg-line mx-1 h-5 w-px" />
            <ToolbarButton onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)))} label="Zoom out" disabled={zoom <= 0.6}>
              <RiZoomOutLine size={16} aria-hidden />
            </ToolbarButton>
            <span className="text-muted w-10 text-center text-caption tabular-nums" aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
            <ToolbarButton onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(1)))} label="Zoom in" disabled={zoom >= 1.2}>
              <RiZoomInLine size={16} aria-hidden />
            </ToolbarButton>
          </div>
        </div>

        <div
          ref={scroller}
          role="region"
          aria-label="Organisation chart"
          tabIndex={0}
          className="border-line bg-raised/40 overflow-x-auto rounded-lg border p-6 focus-visible:outline-2"
        >
          <div ref={inner} className="org-chart" style={{ zoom }}>
            <ul className="flex items-start justify-center gap-8 p-0">
              {nodes.map((node) => (
                <Item key={node.person.id} node={node} depth={0} openDepth={openDepth} />
              ))}
            </ul>
          </div>
        </div>
      </CommandContext.Provider>
    </SettingsContext.Provider>
  );
}

function ToolbarButton({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="text-secondary hover:bg-raised hover:text-primary flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-caption font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/** One person and, when open, the people who report to them. */
function Item({ node, depth, openDepth }: { node: Node; depth: number; openDepth: number }) {
  const command = useContext(CommandContext);
  const [state, setState] = useState({
    seen: command.id,
    open: command.id > 0 ? command.open : depth < openDepth,
  });
  /** A new Expand all / Collapse all overrides this branch (adjusting state while rendering, not in an effect). */
  if (state.seen !== command.id) setState({ seen: command.id, open: command.open });
  const open = state.open;

  const hasKids = node.children.length > 0;
  /** A team with no sub-teams hangs down as a list instead of spreading sideways. */
  const stack = hasKids && node.children.every((child) => child.children.length === 0);
  const showKids = hasKids && open;

  return (
    <li className={cn("org-node", showKids && stack && "has-stack", (node.path || node.you) && "is-path")}>
      <Card node={node} open={open} onToggle={hasKids ? () => setState((current) => ({ ...current, open: !current.open })) : undefined} />

      {showKids ? (
        <ul className={cn(stack ? "org-stack" : "org-row", node.children.some((c) => c.path || c.you) && "is-path")}>
          {node.children.map((child) => (
            <Item key={child.person.id} node={child} depth={depth + 1} openDepth={openDepth} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Card({ node, open, onToggle }: { node: Node; open: boolean; onToggle?: () => void }) {
  const { canEdit, linkProfiles } = useContext(SettingsContext);
  const { person } = node;
  const href = linkProfiles || node.you ? `/people/${person.id}` : undefined;
  /** "CEO" under a name that already says CEO is noise, so a title that repeats the level is dropped. */
  const title = person.jobTitle && person.jobTitle.toLowerCase() !== node.label.toLowerCase() ? person.jobTitle : null;
  const subtitle = [title, person.departmentName].filter(Boolean).join(" · ") || "No title yet";

  const name = href ? (
    <Link href={href} className="hover:text-accent truncate">
      {person.name}
    </Link>
  ) : (
    <span className="truncate">{person.name}</span>
  );

  return (
    <div
      className={cn(
        "org-card",
        node.you && "border-brand bg-accent-soft shadow-sm",
        node.path && !node.you && "border-brand",
        !node.you && !node.path && node.inDepartment && "bg-raised",
      )}
    >
      <Avatar name={person.name} src={person.avatarUrl} size="lg" className={node.you || node.inDepartment ? "bg-card" : undefined} />
      <div className="min-w-0 flex-1">
        <p className="text-primary flex items-center gap-1.5 text-body font-semibold">
          {name}
          {node.you ? <span className="bg-brand text-on-accent rounded px-1 text-tiny leading-4">You</span> : null}
        </p>
        <p className="text-muted truncate text-caption" title={subtitle}>
          {subtitle}
        </p>
        <p className={cn("truncate text-tiny font-semibold tracking-wide uppercase", levelText[node.level])}>
          {node.label}
          {person.status === "invited" ? " · Invited" : ""}
        </p>
      </div>

      {canEdit ? (
        <span className="absolute top-1.5 right-1.5">
          <EditPositionButton person={person} compact />
        </span>
      ) : null}

      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} ${pluralise(node.teamSize, "person", "people")} under ${person.name}`}
          className="border-line bg-card text-secondary hover:border-brand hover:text-accent absolute -bottom-3 left-1/2 z-10 flex h-6 -translate-x-1/2 cursor-pointer items-center gap-0.5 rounded-full border pr-1.5 pl-2 text-tiny font-semibold transition-colors"
        >
          {node.teamSize}
          {open ? <RiArrowUpSLine size={14} aria-hidden /> : <RiArrowDownSLine size={14} aria-hidden />}
        </button>
      ) : node.teamSize > 0 ? (
        <span
          className="border-line bg-card text-muted absolute -bottom-3 left-1/2 z-10 flex h-6 -translate-x-1/2 items-center rounded-full border px-2 text-tiny font-semibold whitespace-nowrap"
          title={`${pluralise(node.teamSize, "person", "people")} in their team`}
        >
          {node.teamSize} in team
        </span>
      ) : null}
    </div>
  );
}
