/** Proves to IndexNow that this site owns the key. Returns 404 until INDEXNOW_KEY is set. */
export function GET() {
    const key = process.env.INDEXNOW_KEY;
    if (!key) return new Response('Not found', { status: 404 });
    return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
