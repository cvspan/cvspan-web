import type { MetadataRoute } from 'next';

import routes from '@/lib/seo/routes.generated.json';
import { TEAMS } from '@/components/ui/data';
import { SITE_URL } from '@/lib/seo/config';
import { fetchAllPosts, fetchJobs } from '@/lib/portal';

/**
 * Sitemap, built from three live sources so nothing has to be listed by hand:
 *
 *  1. every public page in src/app (scripts/generate-routes.mjs runs before dev and build),
 *  2. team profiles from the site's own data,
 *  3. blog posts and open roles from the CVSpan Portal, plus the portal's public sign-in page.
 *
 * The portal publishes through /api/revalidate, which also refreshes this file, so a new post or
 * role appears within seconds; with no ping it is rebuilt at most a minute later.
 */
export const revalidate = 60;

type Freq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
type Rule = { match: (path: string) => boolean; priority: number; changeFrequency: Freq };

/** First match wins. Priorities encode the commercial hierarchy: services and industries win the search traffic. */
const RULES: Rule[] = [
    { match: (p) => p === '/', priority: 1.0, changeFrequency: 'weekly' },
    { match: (p) => p.startsWith('/services/'), priority: 0.9, changeFrequency: 'monthly' },
    { match: (p) => p === '/contact' || p === '/our-works', priority: 0.9, changeFrequency: 'monthly' },
    { match: (p) => p.startsWith('/industries/'), priority: 0.8, changeFrequency: 'monthly' },
    { match: (p) => p === '/about', priority: 0.8, changeFrequency: 'monthly' },
    { match: (p) => p.startsWith('/our-works/'), priority: 0.7, changeFrequency: 'monthly' },
    { match: (p) => p === '/careers' || p === '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { match: (p) => p === '/careers/open-position', priority: 0.6, changeFrequency: 'daily' },
    { match: (p) => p.startsWith('/about/'), priority: 0.6, changeFrequency: 'monthly' },
    { match: (p) => p.startsWith('/legal/'), priority: 0.3, changeFrequency: 'yearly' },
    { match: () => true, priority: 0.5, changeFrequency: 'monthly' },
];

const rule = (path: string) => RULES.find((candidate) => candidate.match(path))!;

type Item = { path: string; lastModified?: Date; priority?: number; changeFrequency?: Freq };

/** The portal can be unreachable; the site's own pages must still be listed. */
async function fromPortal(): Promise<Item[]> {
    try {
        const [{ jobs }, posts] = await Promise.all([fetchJobs(), fetchAllPosts()]);
        return [
            ...jobs.map((job) => ({
                path: `/careers/${job.slug}`,
                priority: 0.6,
                changeFrequency: 'daily' as const,
                lastModified: new Date(job.postedAt ?? Date.now()),
            })),
            ...posts.map((post) => ({
                path: `/blog/${post.slug}`,
                priority: 0.7,
                changeFrequency: 'monthly' as const,
                lastModified: new Date(post.updatedAt),
            })),
        ];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const items: Item[] = [
        ...routes.map((route) => ({ path: route.path, lastModified: new Date(route.lastModified) })),
        ...TEAMS.map((team) => ({ path: `/about/teams/${encodeURIComponent(team.id)}` })),
        // The staff portal's public front door: the only part of it meant to be found in search.
        { path: '/portal/login', priority: 0.4, changeFrequency: 'yearly' as const },
        ...(await fromPortal()),
    ];

    const seen = new Set<string>();
    return items
        .filter((item) => !seen.has(item.path) && !!seen.add(item.path))
        .map((item) => ({
            url: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
            lastModified: item.lastModified ?? new Date(),
            changeFrequency: item.changeFrequency ?? rule(item.path).changeFrequency,
            priority: item.priority ?? rule(item.path).priority,
        }));
}
