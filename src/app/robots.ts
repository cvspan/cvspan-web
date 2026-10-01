import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
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
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
