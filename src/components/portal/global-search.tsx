"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RiSearchLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; detail?: string; href: string };
type Group = { label: string; items: Item[] };

/**
 * The search box in the top bar. Type two or more letters to see people, tasks, projects and
 * (for admins) departments and posts you can open; arrow keys and Enter choose one, and ⌘K or
 * Ctrl+K jumps to the box from anywhere.
 */
export function GlobalSearch() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const trimmed = query.trim();
  const ready = trimmed.length >= 2;
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  /** Look up results shortly after typing stops, dropping any answer that is already out of date. */
  useEffect(() => {
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { groups: Group[] };
        setGroups(data.groups);
        setSearchedFor(trimmed);
        setActive(0);
      } catch {
        /* aborted by a newer keystroke, or offline: keep what is shown */
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  /** ⌘K / Ctrl+K focuses the box, and a click elsewhere closes the results. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, []);

  const go = (item: Item) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(item.href);
  };

  const showPanel = open && ready;
  /** Results only count once they are for what is typed now. */
  const current = searchedFor === trimmed;
  let index = -1;

  return (
    <div ref={boxRef} className="relative w-full max-w-90">
      <label className="border-line focus-within:border-line-input flex h-10 w-full items-center gap-2 rounded-lg border px-3">
        <RiSearchLine size={18} className="text-muted shrink-0" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && flat[active] ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            } else if (event.key === "ArrowDown" && flat.length > 0) {
              event.preventDefault();
              setActive((value) => (value + 1) % flat.length);
            } else if (event.key === "ArrowUp" && flat.length > 0) {
              event.preventDefault();
              setActive((value) => (value - 1 + flat.length) % flat.length);
            } else if (event.key === "Enter" && showPanel && flat[active]) {
              event.preventDefault();
              go(flat[active]);
            }
          }}
          placeholder="Search people, tasks, projects…"
          aria-label="Search"
          className="text-primary placeholder:text-muted w-full bg-transparent text-body outline-none"
        />
        <kbd className="border-line text-muted hidden rounded-md border px-1.5 py-0.5 text-tiny sm:block">⌘K</kbd>
      </label>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="bg-card border-line absolute top-12 left-0 z-40 max-h-96 w-full min-w-72 overflow-y-auto rounded-lg border py-1 shadow-lg"
        >
          {!current ? (
            <p className="text-muted px-4 py-3 text-body">Searching…</p>
          ) : flat.length === 0 ? (
            <p className="text-muted px-4 py-3 text-body">No results for “{trimmed}”.</p>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <p className="text-muted px-4 pt-2 pb-1 text-tiny font-semibold tracking-wide uppercase">{group.label}</p>
                {group.items.map((item) => {
                  index += 1;
                  const mine = index;
                  return (
                    <button
                      key={`${group.label}-${item.id}`}
                      id={`${listId}-${mine}`}
                      type="button"
                      role="option"
                      aria-selected={mine === active}
                      onMouseEnter={() => setActive(mine)}
                      onClick={() => go(item)}
                      className={cn(
                        "flex w-full cursor-pointer flex-col px-4 py-2 text-left transition-colors",
                        mine === active ? "bg-raised" : "",
                      )}
                    >
                      <span className="text-primary truncate text-body font-semibold">{item.title}</span>
                      {item.detail ? <span className="text-muted truncate text-tiny">{item.detail}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
