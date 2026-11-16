import { PostEditor } from "@/components/editor/post-editor";
import { getCategories, getTags } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata = { title: "New post · CVSpan Portal" };

export default async function NewPostPage() {
  const user = await requireUser();
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <PostEditor
      post={{
        title: "",
        body: "",
        categoryId: null,
        tags: [],
        coverImageUrl: null,
        coverAlt: null,
        status: "draft",
        publishAt: null,
      }}
      categories={categories}
      tagSuggestions={tags}
      canPublish={atLeast(user.viewRole, "admin")}
    />
  );
}
