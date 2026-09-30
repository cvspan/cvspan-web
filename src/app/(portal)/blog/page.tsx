import Link from "next/link";
import { RiAddLine, RiExternalLinkLine, RiTimeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PostActions } from "@/components/forms/website-forms";
import { getBlogPosts } from "@/db/queries";
import { formatDay, initials, postStatusLabels, relativeDays } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function BlogPage() {
  const user = await requireUser();
  const posts = await getBlogPosts();
  const canPublish = atLeast(user.role, "admin");

  const counts = (["published", "scheduled", "in_review", "draft"] as const).map((status) => ({
    status,
    count: posts.filter((post) => post.status === status).length,
  }));

  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Blog"
        actions={
          <>
            <a href="https://cvspan.com/blog" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" type="button">
                <RiExternalLinkLine size={18} aria-hidden />
                View site
              </Button>
            </a>
            <Link href="/blog/new">
              <Button type="button">
                <RiAddLine size={18} aria-hidden />
                New post
              </Button>
            </Link>
          </>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Posts written here publish to the blog section of the CVSpan website. Anything in review
        needs an admin approval before it goes live.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.status} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {postStatusLabels[item.status]}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{item.count}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="All posts" action={<Badge>{posts.length} posts</Badge>} />

        {posts.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            No posts yet. Start the first one.
          </p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li
                key={post.id}
                className="border-line hover:bg-raised flex flex-col gap-4 border-b p-5 transition-colors last:border-b-0 sm:flex-row"
              >
                <Link href={`/blog/${post.id}`} className="shrink-0" aria-label={`Edit ${post.title}`}>
                  {post.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URLs, no image loader configured
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="border-line h-24 w-full rounded-lg border object-cover sm:w-40"
                    />
                  ) : (
                    <span className="border-line text-muted flex h-24 w-full items-center justify-center rounded-lg border border-dashed text-tiny sm:w-40">
                      No cover
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary hover:text-accent text-para font-semibold"
                    >
                      {post.title}
                    </Link>
                    <Badge tone={statusTone(post.status)}>{postStatusLabels[post.status]}</Badge>
                  </p>

                  {post.excerpt ? (
                    <p className="text-secondary mt-1 line-clamp-2 text-body">{post.excerpt}</p>
                  ) : (
                    <p className="text-muted mt-1 text-body italic">No content yet</p>
                  )}

                  <p className="text-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-tiny">
                    <span className="flex items-center gap-1.5">
                      <span className="bg-accent-soft text-accent flex size-5 items-center justify-center rounded-full text-[9px] font-semibold">
                        {initials(post.author ?? "??")}
                      </span>
                      {post.author ?? "Unknown"}
                    </span>
                    {post.category ? <span>{post.category}</span> : null}
                    <span className="flex items-center gap-1">
                      <RiTimeLine size={12} aria-hidden />
                      {post.readingMinutes} min read
                    </span>
                    <span>
                      {post.status === "scheduled" && post.publishAt
                        ? `Scheduled for ${formatDay(post.publishAt)}`
                        : `Updated ${relativeDays(post.updatedAt)}`}
                    </span>
                  </p>

                  {post.tags.length > 0 ? (
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border-line text-secondary rounded-md border px-2 py-0.5 text-tiny"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-start gap-2">
                  <Link href={`/blog/${post.id}`}>
                    <Button size="sm" variant="secondary" type="button">
                      Edit
                    </Button>
                  </Link>
                  <PostActions postId={post.id} status={post.status} canPublish={canPublish} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
