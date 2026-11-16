import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/seo/config';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE_NAME} — ${SITE_TAGLINE}`,
        short_name: SITE_NAME,
        description: SITE_DESCRIPTION,
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#050505',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
