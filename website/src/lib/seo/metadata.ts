import type { Metadata } from 'next';

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, TWITTER_HANDLE, absoluteUrl } from './config';

type BuildMetadataArgs = {
    /** Page title WITHOUT the brand suffix — the root template appends it. */
    title: string;
    description: string;
    /** Site-root-relative path, e.g. `/services/ui-ux-design`. Drives the canonical URL. */
    path: string;
    /** Social share image. Defaults to the generated branded OG image. */
    image?: string;
    keywords?: string[];
    /** Set for pages that must stay out of the index (auth screens, dashboards). */
    noIndex?: boolean;
    /**
     * Set on layouts that have child routes. A layout whose title is a plain
     * string stops the root `%s | CVSpan` template from reaching its children,
     * so intermediate segments must re-declare it.
     */
    hasChildRoutes?: boolean;
    type?: 'website' | 'article';
    publishedTime?: string;
};

/**
 * Builds a complete, consistent metadata object for a page.
 *
 * Centralising this guarantees every route ships a canonical URL and correctly
 * shaped Open Graph / Twitter tags, rather than each page hand-rolling a partial set.
 */
export function buildMetadata({
    title,
    description,
    path,
    image,
    keywords,
    noIndex = false,
    hasChildRoutes = false,
    type = 'website',
    publishedTime,
}: BuildMetadataArgs): Metadata {
    const url = absoluteUrl(path);
    const images = [{ url: image ?? DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }];

    return {
        title: hasChildRoutes ? { default: title, template: `%s | ${SITE_NAME}` } : title,
        description,
        keywords,
        alternates: { canonical: url },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'en_US',
            type,
            ...(publishedTime ? { publishedTime } : {}),
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${SITE_NAME}`,
            description,
            site: TWITTER_HANDLE,
            creator: TWITTER_HANDLE,
            images,
        },
        ...(noIndex
            ? {
                  robots: {
                      index: false,
                      follow: false,
                      googleBot: { index: false, follow: false },
                  },
              }
            : {}),
        metadataBase: new URL(SITE_URL),
    };
}
