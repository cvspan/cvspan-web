import { revalidatePath } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';
import { submitToIndexNow } from '@/lib/seo/indexnow';

/**
 * The CVSpan Portal calls this when a post or role is published, edited or closed, so the site shows
 * the change straight away instead of waiting out its one-minute cache.
 *
 * Set REVALIDATE_SECRET here and WEBSITE_REVALIDATE_SECRET in the portal to the same value, and the
 * portal's WEBSITE_REVALIDATE_URL to https://cvspan.com/api/revalidate. Body: { "paths": ["/blog/my-post"] }.
 *
 * It also refreshes the sitemap and the blog feed, and tells IndexNow (when configured) so search
 * engines hear about the change straight away.
 */
export async function POST(request: Request) {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret) return Response.json({ error: 'Revalidation is not configured.' }, { status: 503 });

    const given = Buffer.from((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''));
    const expected = Buffer.from(secret);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
        return Response.json({ error: 'Unauthorised.' }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { paths?: unknown } | null;
    const paths = Array.isArray(body?.paths)
        ? body.paths.filter((path): path is string => typeof path === 'string' && path.startsWith('/')).slice(0, 20)
        : [];

    for (const path of paths) revalidatePath(path);
    revalidatePath('/sitemap.xml');
    revalidatePath('/blog/rss.xml');

    const indexed = await submitToIndexNow(paths);
    return Response.json({ revalidated: paths, sitemap: true, indexNow: indexed });
}
