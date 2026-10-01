import { mediaSrc } from "@/lib/base-path";
import Link from "next/link";
import { RiAddLine, RiExternalLinkLine, RiImageLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { PostActions } from "@/components/forms/website-forms";
import { getBlogPosts } from "@/db/queries";
import { formatDay, initials, postStatusLabels, relativeDays } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";
import { websitePostUrl, websiteUrl } from "@/lib/website";

/** Published, or scheduled for a time that has passed: what the public site is showing. */
const isLive = (post: { status: string; publishAt: Date | null }) =>
  post.status === "published" || (post.status === "scheduled" && post.publishAt !== null && post.publishAt <= new Date());

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
            <a href={websiteUrl("/blog")} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" type="button">
                <RiExternalLinkLine size={18} aria-hidden />
                View blog on website
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
          <Table>
            <Thead
              columns={["", "Post", "Category", "Author", "Read", "Updated", "Status", ""]}
            />
            <tbody>
              {posts.map((post) => (
                <Tr key={post.id}>
                  <Td className="w-16 pr-0">
                    <Link href={`/blog/${post.id}`} aria-label={`Edit ${post.title}`}>
                      {post.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- served from our own media route
                        <img
                          src={mediaSrc(post.coverImageUrl)}
                          alt=""
                          className="border-line h-10 w-14 rounded-md border object-cover"
                        />
                      ) : (
                        <span className="border-line text-muted flex h-10 w-14 items-center justify-center rounded-md border border-dashed">
                          <RiImageLine size={14} aria-hidden />
                        </span>
                      )}
                    </Link>
                  </Td>

                  <Td className="max-w-72">
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary hover:text-accent block truncate font-semibold"
                    >
                      {post.title}
                    </Link>
                    <span className="text-muted block truncate text-tiny">
                      {post.tags.length > 0 ? post.tags.join(" · ") : (post.excerpt ?? "No content yet")}
                    </span>
                  </Td>

                  <Td className="whitespace-nowrap">{post.category ?? "—"}</Td>

                  <Td>
                    <span className="flex items-center gap-2">
                      <span className="bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                        {initials(post.author ?? "??")}
                      </span>
                      <span className="hidden whitespace-nowrap 2xl:inline">
                        {post.author ?? "Unknown"}
                      </span>
                    </span>
                  </Td>

                  <Td className="whitespace-nowrap">{post.readingMinutes} min</Td>

                  <Td className="whitespace-nowrap">
                    {post.status === "scheduled" && post.publishAt
                      ? `Scheduled ${formatDay(post.publishAt)}`
                      : relativeDays(post.updatedAt)}
                  </Td>

                  <Td>
                    <Badge tone={statusTone(post.status)}>{postStatusLabels[post.status]}</Badge>
                  </Td>

                  {/* The title and thumbnail already open the editor, so this
                      column carries only the action that changes state. */}
                  <Td className="whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      {isLive(post) ? (
                        <a
                          href={websitePostUrl(post.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${post.title} on the website`}
                          title="View on the website"
                          className="text-muted hover:bg-raised hover:text-primary flex size-8 items-center justify-center rounded-lg transition-colors"
                        >
                          <RiExternalLinkLine size={18} aria-hidden />
                        </a>
                      ) : null}
                      <PostActions postId={post.id} status={post.status} canPublish={canPublish} />
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
