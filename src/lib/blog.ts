import { atLeast, type Role } from "./roles";

export type PostStatus = "draft" | "in_review" | "scheduled" | "published";

type Post = { status: PostStatus; authorId: string | null };

/**
 * Anyone can write a post, but only their own, and only while it is a draft. Once it is sent for
 * review, scheduled or published it is locked to its author, so nothing changes under an admin's
 * eyes or goes live without being read. Admins can edit any post.
 */
export function canEditPost(user: { id: string; role: Role }, post: Post) {
  if (atLeast(user.role, "admin")) return true;
  return post.authorId === user.id && post.status === "draft";
}

/** Who may see a post in the list and open it: its author, and admins (who review everything). */
export function canSeePost(user: { id: string; role: Role }, post: Post) {
  return atLeast(user.role, "admin") || post.authorId === user.id;
}

/** A draft that came back with feedback reads as "Changes requested" rather than a plain draft. */
export function postState(post: { status: PostStatus; reviewNote: string | null }) {
  if (post.status === "draft" && post.reviewNote) return "changes_requested" as const;
  return post.status;
}

export const postStateLabels = {
  draft: "Draft",
  changes_requested: "Changes requested",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
} as const;
