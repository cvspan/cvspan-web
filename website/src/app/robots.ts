import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/config';
import { parseRobotsExtra } from '@/lib/seo/robots-rules';
import { getSiteConfig } from '@/lib/seo/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const { allowIndexing, settings } = await getSiteConfig();

    // Indexing switched off in Site settings: ask every crawler to stay away from everything.
    if (!allowIndexing) {
        return { rules: [{ userAgent: '*', disallow: '/' }] };
    }

    const extra = parseRobotsExtra(settings?.robotsExtra);

    return {
        rules: [
            {
                userAgent: '*',
                // The longest matching rule wins, so the portal's public sign-in page stays
                // crawlable (people search "CVSpan portal") while the rest of /portal/ is closed.
                allow: ['/', '/portal/login'],
                // Authenticated/private surfaces: no search value, and indexing them
                // would leak dashboard routes into results. /portal/ is the staff portal.
                disallow: ['/blog/auth/', '/blog/dashboard/', '/blog/author/', '/api/', '/portal/'],
            },
            ...extra.rules.map((rule) => ({
                userAgent: rule.userAgent,
                allow: rule.allow.length ? rule.allow : undefined,
                disallow: rule.disallow.length ? rule.disallow : undefined,
                crawlDelay: rule.crawlDelay,
            })),
        ],
        sitemap: [`${SITE_URL}/sitemap.xml`, ...extra.sitemaps],
        host: SITE_URL,
    };
}
