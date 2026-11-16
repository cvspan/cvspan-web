"use client";

import { useState } from "react";
import { RiCloseLine } from "@remixicon/react";

/** Chip input used for post tags and job skills. */
export function TagField({
  name,
  initial,
  suggestions,
  placeholder = "Add tags, press Enter",
}: {
  name: string;
  initial: string[];
  suggestions: string[];
  placeholder?: string;
}) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  const add = (value: string) => {
    const tag = value.trim().replace(/,$/, "");
    if (!tag || tags.includes(tag) || tags.length >= 8) return;
    setTags([...tags, tag]);
    setDraft("");
  };

  return (
    <div>
      <input type="hidden" name={name} value={tags.join(",")} />
      <div className="border-line-input flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-accent-soft text-accent flex items-center gap-1 rounded-md px-2 py-1 text-caption font-semibold"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => setTags(tags.filter((value) => value !== tag))}
              className="cursor-pointer"
            >
              <RiCloseLine size={14} aria-hidden />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => {
            if (event.target.value.endsWith(",")) add(event.target.value);
            else setDraft(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            }
            if (event.key === "Backspace" && !draft && tags.length > 0) {
              setTags(tags.slice(0, -1));
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          aria-label="Add a tag"
          className="text-primary placeholder:text-muted min-w-32 flex-1 bg-transparent py-1 text-body outline-none"
        />
      </div>
      {suggestions.length > 0 ? (
        <p className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-muted text-tiny">Used before:</span>
          {suggestions
            .filter((tag) => !tags.includes(tag))
            .slice(0, 6)
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => add(tag)}
                className="border-line text-secondary hover:bg-raised cursor-pointer rounded-md border px-2 py-0.5 text-tiny"
              >
                {tag}
              </button>
            ))}
        </p>
      ) : null}
    </div>
  );
}

