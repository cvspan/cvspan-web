/*
 * Client for the CVSpan Portal's public API (cvspan.com/portal). The portal is where the team writes
 * blog posts and opens roles; this site only reads them, and sends job applications back.
 *
 * NEXT_PUBLIC_PORTAL_API_URL points at the API root. In production the portal is served from the
 * same domain, so the default needs no setup. Locally, set it to http://localhost:3000/portal/api/public/v1.
 */
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
    salary: { display: string } | null;
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
}: { page?: number; pageSize?: number; category?: string } = {}) {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category) query.set('category', category);
    const data = await get<{
        posts: PortalPost[];
        categories: { name: string; slug: string }[];
        pagination: { page: number; pageSize: number; total: number; pages: number };
    }>(`/blog?${query}`);
    return data ?? { posts: [], categories: [], pagination: { page, pageSize, total: 0, pages: 1 } };
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
