import { notFound } from "next/navigation";
import { PostEditor } from "@/components/editor/post-editor";
import { getCategories, getPostById, getTags } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const post = await getPostById(id);

  if (!post) notFound();

  /** Authors edit their own drafts; admins edit anything. */
  if (post.authorId !== user.id && !atLeast(user.role, "admin")) notFound();

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
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
      }}
      categories={categories}
      tagSuggestions={tags}
      canPublish={atLeast(user.role, "admin")}
    />
  );
}
