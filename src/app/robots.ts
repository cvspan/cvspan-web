import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Authenticated/private surfaces: no search value, and indexing them
                // would leak dashboard routes into results. /portal/ is the staff portal.
                disallow: ['/blog/auth/', '/blog/dashboard/', '/api/', '/portal/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
