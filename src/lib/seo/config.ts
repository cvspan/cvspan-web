/**
 * Central SEO configuration.
 *
 * Every canonical URL, sitemap entry, and structured-data block derives from
 * `SITE_URL`, so the production origin is defined exactly once. Override it per
 * environment with NEXT_PUBLIC_SITE_URL (e.g. a staging origin) — never hardcode
 * an origin anywhere else.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cvspan.com').replace(/\/$/, '');

export const SITE_NAME = 'CVSpan';

export const SITE_TAGLINE = 'Digital Product Design & Development Agency';

export const SITE_DESCRIPTION =
    'CVSpan is a digital product design and development agency. We craft UI/UX, websites, mobile apps and brand identities for startups and enterprises across fintech, healthcare, AI and Web3.';

export const TWITTER_HANDLE = '@Cvspanofficial';

export const CONTACT_EMAIL = 'business@cvspan.com';

/** Absolute URL helper — structured data and canonicals require absolute URLs. */
export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Default share image, served by `app/opengraph-image.tsx` as a 1200x630 PNG.
 * Referenced explicitly rather than relying on file-convention inheritance,
 * which does not cascade reliably through this project's route groups.
 */
export const DEFAULT_OG_IMAGE = '/opengraph-image';

/**
 * Canonical social profile URLs — the single source of truth.
 *
 * Keyed so UI components can pick the handful they display, while
 * `SOCIAL_PROFILES` below feeds the Organization `sameAs` structured data.
 * Previously the contact page kept its own copy, where three links pointed at
 * '/' and two were protocol-less paths that resolved against cvspan.com.
 */
export const SOCIAL_LINKS = {
    facebook: 'https://www.facebook.com/CVSpanOfficial',
    twitter: 'https://x.com/Cvspanofficial',
    instagram: 'https://www.instagram.com/cvspanofficial',
    linkedin: 'https://www.linkedin.com/company/cvspanofficial',
    tiktok: 'https://www.tiktok.com/@cvspanofficial',
    youtube: 'https://www.youtube.com/@cvspantv',
} as const;

export const SOCIAL_PROFILES = Object.values(SOCIAL_LINKS);

export const OFFICES = [
    {
        name: 'CVSpan — London',
        streetAddress: '86-90 Paul Street',
        addressLocality: 'London',
        addressRegion: 'England',
        postalCode: 'EC2A 4NE',
        addressCountry: 'GB',
    },
    {
        name: 'CVSpan — Abuja',
        streetAddress: 'No 6 Udysens Crescent, Mabushi',
        addressLocality: 'Abuja',
        addressRegion: 'FCT',
        postalCode: '900108',
        addressCountry: 'NG',
    },
];
