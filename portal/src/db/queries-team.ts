import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "./index";
import { websiteTeamMembers } from "./schema";

const inOrder = [asc(websiteTeamMembers.sortOrder), asc(websiteTeamMembers.createdAt)] as const;

/** Everyone on the Team page's list, hidden people included, in the order the website shows them. */
export function getWebsiteTeam() {
  return db.select().from(websiteTeamMembers).orderBy(...inOrder);
}

/** Only the people the public website should show. */
export function getPublicTeam() {
  return db.select().from(websiteTeamMembers).where(eq(websiteTeamMembers.published, true)).orderBy(...inOrder);
}

export type WebsiteTeamMember = Awaited<ReturnType<typeof getWebsiteTeam>>[number];
