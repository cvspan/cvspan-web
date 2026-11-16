/*
 * Client for the CVSpan Portal's public API (cvspan.com/portal). The portal is where the team writes
 * blog posts and opens roles; this site only reads them, and sends job applications back.
 *
 * NEXT_PUBLIC_PORTAL_API_URL points at the API root. In production the portal is served from the
 * same domain, so the default needs no setup. Locally, set it to http://localhost:3000/portal/api/public/v1.
 */
import type { Team } from '@/components/molecules/OurTeam/types';
import { TEAMS } from '@/components/ui/data';

export const PORTAL_API_URL = (
    process.env.NEXT_PUBLIC_PORTAL_API_URL ?? 'https://cvspan.com/portal/api/public/v1'
).replace(/\/+$/, '');

export type PortalDepartment = { name: string; slug: string; openRoles?: number };

export type PortalJob = {
    slug: string;
    title: string;
    summary: string | null;
    department: PortalDepartment | null;
    employmentType: 'full_time' | 'part_time' | 'internship' | 'volunteer' | 'student';
    employmentLabel: string;
    seniorityLabel: string;
    workModeLabel: string;
    location: string | null;
    experience: string | null;
    language: string | null;
    openings: number;
    skills: string[];
    salary: {
        display: string;
        min: number | null;
        max: number | null;
        currency: string;
        period: 'year' | 'month' | 'day' | 'hour';
    } | null;
    postedAt: string | null;
    closingDate: string | null;
    apply: { method: 'portal' | 'email' | 'url'; target: string | null };
};
export type PortalJobDetail = PortalJob & { descriptionHtml: string };

export type PortalPost = {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    coverAlt: string | null;
    category: { name: string; slug: string } | null;
    tags: string[];
    author: string | null;
    readingMinutes: number;
    publishedAt: string;
    updatedAt: string;
};
export type PortalPostDetail = PortalPost & { bodyHtml: string };

export type PortalTeamMember = {
    /** The address of their profile: /about/teams/<id>. */
    id: string;
    name: string;
    role: string;
    photoUrl: string | null;
    /** Paragraphs; empty when no bio was written, in which case the card has no profile page. */
    bio: string[];
};

export type PortalTag = {
    tag: 'script' | 'meta' | 'link' | 'style' | 'noscript';
    attrs: Record<string, string>;
    content?: string;
};

/** What admins set under Site settings in the portal. Every field can be empty: the site's built-in value then applies. */
export type PortalSiteSettings = {
    siteName: string | null;
    tagline: string | null;
    description: string | null;
    titleTemplate: string | null;
    shareImage: string | null;
    twitterHandle: string | null;
    social: Record<'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube', string | null>;
    verification: Record<'google' | 'bing' | 'yandex' | 'facebook', string | null>;
    analytics: Record<'googleAnalytics' | 'tagManager' | 'metaPixel' | 'linkedinInsight', string | null>;
    allowIndexing: boolean;
    robotsExtra: string | null;
    tags: Record<'head' | 'bodyStart' | 'bodyEnd', PortalTag[]>;
};

type RequestOptions = { revalidate?: number };

/** GET from the portal. Returns null when the portal says "not found" and throws on anything else. */
async function get<T>(path: string, { revalidate = 60 }: RequestOptions = {}): Promise<T | null> {
    const response = await fetch(`${PORTAL_API_URL}${path}`, { next: { revalidate } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Portal responded ${response.status} for ${path}`);
    return response.json() as Promise<T>;
}

export async function fetchJobs() {
    const data = await get<{ jobs: PortalJob[]; departments: PortalDepartment[] }>('/careers');
    return data ?? { jobs: [], departments: [] };
}

export async function fetchJob(slug: string) {
    const data = await get<{ job: PortalJobDetail }>(`/careers/${encodeURIComponent(slug)}`);
    return data?.job ?? null;
}

export async function fetchPosts({
    page = 1,
    pageSize = 9,
    category,
    query,
}: { page?: number; pageSize?: number; category?: string; query?: string } = {}) {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category) params.set('category', category);
    if (query) params.set('q', query);
    const data = await get<{
        posts: PortalPost[];
        categories: { name: string; slug: string }[];
        pagination: { page: number; pageSize: number; total: number; pages: number };
    }>(`/blog?${params}`);
    return data ?? { posts: [], categories: [], pagination: { page, pageSize, total: 0, pages: 1 } };
}

/** Every public post, following the API's pages, for the sitemap and the feed. */
export async function fetchAllPosts() {
    const first = await fetchPosts({ page: 1, pageSize: 24 });
    const posts = [...first.posts];
    for (let page = 2; page <= first.pagination.pages && page <= 50; page++) {
        posts.push(...(await fetchPosts({ page, pageSize: 24 })).posts);
    }
    return posts;
}

export async function fetchPost(slug: string) {
    const data = await get<{ post: PortalPostDetail }>(`/blog/${encodeURIComponent(slug)}`);
    return data?.post ?? null;
}

export const MAX_RESUME_BYTES = 4 * 1024 * 1024;
export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'];

/** Checked in the browser for quick feedback; the portal checks again on its side. */
export function resumeProblem(file: File | null): string | null {
    if (!file || file.size === 0) return 'Attach your resume as a PDF, DOC or DOCX file.';
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!RESUME_EXTENSIONS.includes(extension)) return 'Your resume must be a PDF, DOC or DOCX file.';
    if (file.size > MAX_RESUME_BYTES) return 'Your resume must be 4 MB or smaller.';
    return null;
}

/** Sends an application as a form (the resume travels as a file). Resolves with an error message, or null on success. */
export async function submitApplication(slug: string, form: FormData): Promise<string | null> {
    try {
        const response = await fetch(`${PORTAL_API_URL}/careers/${encodeURIComponent(slug)}/apply`, {
            method: 'POST',
            body: form,
        });
        if (response.ok) return null;
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        return body?.error ?? 'Something went wrong. Please try again.';
    } catch {
        return 'We could not reach the server. Check your connection and try again.';
    }
}

export const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * The people on the Team page, as set in the portal. If the portal can't be reached the page
 * falls back to the list built into the site, so the team never disappears from the website.
 */
export async function fetchTeam(): Promise<Team[]> {
    try {
        const data = await get<{ members: PortalTeamMember[] }>('/team');
        if (data) {
            return data.members.map((member) => ({
                id: member.id,
                name: member.name,
                role: member.role,
                avatar: member.photoUrl ?? '',
                linkedin: '',
                bio: member.bio,
            }));
        }
    } catch (error) {
        console.warn('Could not load the team from the portal; using the built-in list', error);
    }
    return TEAMS;
}

/**
 * The site's search and tracking settings. Returns null when the portal can't be reached, so a portal
 * outage never takes the website's own defaults away.
 */
export async function fetchSiteSettings(): Promise<PortalSiteSettings | null> {
    try {
        return await get<PortalSiteSettings>('/site-settings');
    } catch (error) {
        console.warn('Could not load site settings from the portal; using built-in values', error);
        return null;
    }
}
