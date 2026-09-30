"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiAddLine,
  RiCloseLine,
  RiImageLine,
  RiPriceTag3Line,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./rich-text";
import { savePost } from "@/app/actions/website";
import { cn } from "@/lib/utils";

export type PostDraft = {
  id?: string;
  title: string;
  body: string;
  categoryId: string | null;
  tags: string[];
  coverImageUrl: string | null;
  coverAlt: string | null;
  status: string;
  publishAt: string | null;
};

const inputClass =
  "border-line-input text-primary placeholder:text-muted h-11 w-full rounded-lg border bg-transparent px-3.5 text-para outline-none";

function TagField({ initial, suggestions }: { initial: string[]; suggestions: string[] }) {
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
      <input type="hidden" name="tags" value={tags.join(",")} />
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
          placeholder={tags.length === 0 ? "Add tags, press Enter" : ""}
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

function CoverField({ initialUrl, initialAlt }: { initialUrl: string; initialAlt: string }) {
  const [url, setUrl] = useState(initialUrl);

  return (
    <div className="flex flex-col gap-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URLs, no loader configured
        <img
          src={url}
          alt=""
          className="border-line aspect-[16/9] w-full rounded-lg border object-cover"
        />
      ) : (
        <div className="border-line text-muted flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed">
          <span className="flex flex-col items-center gap-1 text-caption">
            <RiImageLine size={24} aria-hidden />
            Paste an image URL
          </span>
        </div>
      )}
      <input
        name="coverImageUrl"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://…/cover.jpg"
        aria-label="Cover image URL"
        className={inputClass}
      />
      <input
        name="coverAlt"
        defaultValue={initialAlt}
        placeholder="Describe the image for screen readers"
        aria-label="Cover image alt text"
        className={inputClass}
      />
    </div>
  );
}

export function PostEditor({
  post,
  categories,
  tagSuggestions,
  canPublish,
}: {
  post: PostDraft;
  categories: { id: string; name: string }[];
  tagSuggestions: string[];
  canPublish: boolean;
}) {
  const [stats, setStats] = useState({ words: 0, minutes: 1 });
  const [newCategory, setNewCategory] = useState(false);

  return (
    <form action={savePost} className="bg-app fixed inset-0 z-50 flex flex-col overflow-y-auto">
      {post.id ? <input type="hidden" name="id" value={post.id} /> : null}

      <header className="border-line bg-card sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 lg:px-6">
        <Link
          href="/blog"
          aria-label="Close editor"
          className="text-muted hover:bg-raised hover:text-primary flex size-9 items-center justify-center rounded-lg transition-colors"
        >
          <RiCloseLine size={20} aria-hidden />
        </Link>

        <span className="min-w-0 flex-1">
          <span className="text-primary block text-body font-semibold">
            {post.id ? "Edit post" : "New post"}
          </span>
          <span className="text-muted block text-tiny">
            {stats.words} words · {stats.minutes} min read · saves as{" "}
            {canPublish ? "draft unless published" : "draft"}
          </span>
        </span>

        <Button type="submit" name="intent" value="draft" variant="secondary">
          Save draft
        </Button>
        {canPublish ? (
          <Button type="submit" name="intent" value="publish">
            Publish
          </Button>
        ) : (
          <Button type="submit" name="intent" value="review">
            Send for review
          </Button>
        )}
      </header>

      <div className="mx-auto grid w-full max-w-450 flex-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-6">
        <div className="border-line bg-card overflow-hidden rounded-lg border">
          <input
            name="title"
            defaultValue={post.title}
            required
            placeholder="Post title"
            aria-label="Post title"
            className="text-primary placeholder:text-muted w-full bg-transparent px-4 pt-6 pb-2 text-h4 font-semibold outline-none sm:px-6"
          />
          <RichTextEditor name="body" defaultValue={post.body} onStats={setStats} />
        </div>

        <aside className="flex flex-col gap-4">
          <section className="border-line bg-card rounded-lg border p-4">
            <h2 className="text-primary mb-3 text-body font-semibold">Cover image</h2>
            <CoverField
              initialUrl={post.coverImageUrl ?? ""}
              initialAlt={post.coverAlt ?? ""}
            />
          </section>

          <section className="border-line bg-card rounded-lg border p-4">
            <h2 className="text-primary mb-3 text-body font-semibold">Category</h2>
            {newCategory ? (
              <div className="flex flex-col gap-2">
                <input
                  name="newCategory"
                  autoFocus
                  placeholder="New category name"
                  aria-label="New category name"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setNewCategory(false)}
                  className="text-muted hover:text-primary cursor-pointer self-start text-caption"
                >
                  Choose an existing one instead
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <select
                  name="categoryId"
                  defaultValue={post.categoryId ?? ""}
                  aria-label="Category"
                  className={cn(inputClass, "cursor-pointer")}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setNewCategory(true)}
                  className="text-accent flex cursor-pointer items-center gap-1 self-start text-caption font-semibold"
                >
                  <RiAddLine size={14} aria-hidden />
                  New category
                </button>
              </div>
            )}
          </section>

          <section className="border-line bg-card rounded-lg border p-4">
            <h2 className="text-primary mb-3 flex items-center gap-1.5 text-body font-semibold">
              <RiPriceTag3Line size={16} className="text-muted" aria-hidden />
              Tags
            </h2>
            <TagField initial={post.tags} suggestions={tagSuggestions} />
          </section>

          {canPublish ? (
            <section className="border-line bg-card rounded-lg border p-4">
              <h2 className="text-primary mb-3 text-body font-semibold">Schedule</h2>
              <input
                type="datetime-local"
                name="publishAt"
                defaultValue={post.publishAt ?? ""}
                aria-label="Publish at"
                className={inputClass}
              />
              <p className="text-muted mt-2 text-tiny">
                Leave empty to publish immediately. A future time schedules the post.
              </p>
            </section>
          ) : null}

          <p className="text-muted text-tiny">
            The summary shown on the website is taken from your first lines, so open with the
            point of the piece rather than a warm-up.
          </p>
        </aside>
      </div>
    </form>
  );
}
