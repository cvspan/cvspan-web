import React from 'react';
import BlogPage from '@/components/pages/blog';
import JsonLd from '@/components/seo/JsonLd';
import { fetchPosts } from '@/lib/portal';
import { absoluteUrl } from '@/lib/seo/config';
import { WEBSITE_ID, breadcrumbSchema, buildGraph } from '@/lib/seo/structured-data';

/** Articles are published in the CVSpan Portal; the list is rendered on the server and refreshed every minute. */
export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
    const query = (searchParams.q ?? '').trim().slice(0, 80);

    let initial = null;
    try {
        initial = await fetchPosts({ pageSize: 9, query });
    } catch {
        /* the client will try again; an unreachable portal must not take the blog page down */
    }

    // Describe the page and the articles on it, so search engines can show the blog as a collection.
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
        ]),
        {
            '@type': 'CollectionPage',
            '@id': `${absoluteUrl('/blog')}#collection`,
            url: absoluteUrl('/blog'),
            name: 'CVSpan Blog',
            isPartOf: { '@id': WEBSITE_ID },
        },
        ...(initial && !query
            ? [
                  {
                      '@type': 'ItemList',
                      itemListElement: initial.posts.map((post, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          url: absoluteUrl(`/blog/${post.slug}`),
                          name: post.title,
                      })),
                  },
              ]
            : []),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            <BlogPage query={query} initial={initial} />
        </>
    );
}
