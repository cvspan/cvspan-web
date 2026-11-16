import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { PostEditor } from "@/components/editor/post-editor";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories, getPostById, getTags } from "@/db/queries";
import { canEditPost, canSeePost, postState, postStateLabels } from "@/lib/blog";
import { atLeast } from "@/lib/roles";
import { sanitizeRichText } from "@/lib/sanitize";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const post = await getPostById(id);
  /** What this person can do as the role they are viewing as (a super admin may be previewing Staff). */
  const viewer = { id: user.id, role: user.viewRole };

  if (!post) notFound();

  /** Employees see only their own posts; admins see and review everyone's. */
  if (!canSeePost(viewer, post)) notFound();

  const isAdmin = atLeast(user.viewRole, "admin");

  /** Once a post is with an admin or live, its author can read it but not change it. */
  if (!canEditPost(viewer, post)) {
    const state = postState(post);
    return (
      <>
        <Link href="/blog" className="text-muted hover:text-primary flex items-center gap-1 text-caption">
          <RiArrowLeftLine size={14} aria-hidden />
          Blog
        </Link>
        <PageHeader pretitle="Blog" title={post.title} actions={<Badge tone={statusTone(post.status)}>{postStateLabels[state]}</Badge>} />
        <Card className="p-5">
          <p className="text-secondary text-body">
            {post.status === "in_review"
              ? "This post is with an admin for review. You can't change it while they read it; you will be told if it is published or sent back."
              : "This post has been approved, so it can no longer be edited here."}
          </p>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.body ?? "") }} />
        </Card>
      </>
    );
  }

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          body: post.body ?? "",
          categoryId: post.categoryId,
          tags: post.tags,
          coverImageUrl: post.coverImageUrl,
          coverAlt: post.coverAlt,
          status: post.status,
          /** datetime-local wants `YYYY-MM-DDTHH:mm`. */
          publishAt: post.publishAt ? new Date(post.publishAt).toISOString().slice(0, 16) : null,
          reviewNote: post.status === "draft" ? post.reviewNote : null,
        }}
        categories={categories}
        tagSuggestions={tags}
        canPublish={isAdmin}
      />
    </>
  );
}
