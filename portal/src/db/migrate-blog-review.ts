/**
 * Lets an admin send a blog post back with feedback: one nullable column on blog_posts.
 * Additive and safe to re-run.
 *
 *   npm run db:migrate-blog-review
 */
import { sql } from "./sql";

async function main() {
  await sql`alter table blog_posts add column if not exists review_note text`;
  const [{ n }] = await sql`select count(*)::int as n from blog_posts`;
  console.log(`blog_posts ready (${n} posts)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
