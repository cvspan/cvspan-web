import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/config';
import { fetchJobs, fetchPosts } from '@/lib/portal';

/**
 * Sitemap.
 *
 * Priorities encode the commercial hierarchy: home > service/industry landing
 * pages (the pages that win search traffic) > portfolio > company > legal.
 * Private surfaces (blog auth + dashboard) are deliberately excluded and are
 * also disallowed in robots.ts.
 */

type Entry = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    lastModified?: Date;
};

const SERVICES = [
    'ui-ux-design',
    'website-design',
    'mobile-design',
    'brand-identity',
    'graphic-design',
    'landing-page',
    'web-development',
    'webflow-development',
    'mobile-development',
    'devops',
];

const INDUSTRIES = ['ai-ml', 'fintech', 'healthcare-wellness', 'web3-blockchain', 'saas'];

const CASE_STUDIES = ['courtz', 'neverbare', 'coastal-loans', 'phozio', 'leedeon', 'littlenemo'];

const CAREER_ROLES = [
    'front-end',
    'graphic-designer',
    'human-resource',
    'marketing-manager',
    'seo-manager',
    'social-media-manager',
    'volunteers',
];

const ENTRIES: Entry[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about/teams', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/our-works', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/careers/open-position', priority: 0.6, changeFrequency: 'weekly' },

    ...SERVICES.map((slug) => ({
        path: `/services/${slug}`,
        priority: 0.9,
        changeFrequency: 'monthly' as const,
    })),
    ...INDUSTRIES.map((slug) => ({
        path: `/industries/${slug}`,
        priority: 0.8,
        changeFrequency: 'monthly' as const,
    })),
    ...CASE_STUDIES.map((slug) => ({
        path: `/our-works/${slug}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
    })),
    ...CAREER_ROLES.map((slug) => ({
        path: `/careers/${slug}`,
        priority: 0.5,
        changeFrequency: 'weekly' as const,
    })),

    { path: '/legal/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/legal/terms-of-use', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/legal/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
];

/** Roles and articles published from the CVSpan Portal. If it can't be reached the static pages still list. */
async function portalEntries(): Promise<Entry[]> {
    try {
        const [{ jobs }, { posts }] = await Promise.all([fetchJobs(), fetchPosts({ pageSize: 24 })]);
        const known = new Set(CAREER_ROLES);
        return [
            ...jobs
                .filter((job) => !known.has(job.slug))
                .map((job) => ({ path: `/careers/${job.slug}`, priority: 0.5, changeFrequency: 'weekly' as const })),
            { path: '/blog', priority: 0.6, changeFrequency: 'weekly' as const },
            ...posts.map((post) => ({
                path: `/blog/${post.slug}`,
                priority: 0.6,
                changeFrequency: 'monthly' as const,
                lastModified: new Date(post.updatedAt),
            })),
        ];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();
    const entries = [...ENTRIES, ...(await portalEntries())];

    return entries.map((entry) => ({
        url: `${SITE_URL}${entry.path === '/' ? '' : entry.path}`,
        lastModified: entry.lastModified ?? lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
    }));
}
