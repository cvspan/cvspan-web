"use client";

import { useState } from "react";
import Link from "next/link";
import { RiAddLine, RiCloseLine, RiPriceTag3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./rich-text";
import { CoverField } from "./cover-field";
import { TagField } from "./tag-field";
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

      <header className="border-line bg-card sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:px-6">
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
        <div className="border-line bg-card flex flex-col overflow-hidden rounded-lg border">
          <input
            name="title"
            defaultValue={post.title}
            required
            placeholder="Post title"
            aria-label="Post title"
            className="text-primary placeholder:text-muted w-full shrink-0 bg-transparent px-4 pt-6 pb-2 text-h4 font-semibold outline-none sm:px-6"
          />
          <RichTextEditor name="body" defaultValue={post.body} onStats={setStats} />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
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
            <TagField name="tags" initial={post.tags} suggestions={tagSuggestions} />
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
