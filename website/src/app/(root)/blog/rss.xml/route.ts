import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo/config';
import { fetchAllPosts } from '@/lib/portal';

/** The blog as an RSS feed: readers, aggregators and some search tools discover new posts from it. */
export const revalidate = 300;

const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
    let posts: Awaited<ReturnType<typeof fetchAllPosts>> = [];
    try {
        posts = (await fetchAllPosts()).slice(0, 50);
    } catch {
        /* serve an empty feed rather than an error while the portal is unreachable */
    }

    const items = posts
        .map((post) => {
            const url = `${SITE_URL}/blog/${post.slug}`;
            return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${post.author ? `\n      <dc:creator>${escape(post.author)}</dc:creator>` : ''}${
          post.category ? `\n      <category>${escape(post.category.name)}</category>` : ''
      }${post.excerpt ? `\n      <description>${escape(post.excerpt)}</description>` : ''}${
          post.coverImageUrl
              ? `\n      <enclosure url="${escape(post.coverImageUrl)}" type="image/jpeg" length="0" />`
              : ''
      }
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(`${SITE_NAME} Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
    });
}
