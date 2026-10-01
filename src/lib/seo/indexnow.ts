import { SITE_URL } from './config';

/**
 * IndexNow tells Bing, Yandex and other participating engines that a URL changed, so new posts and
 * roles are crawled in minutes rather than days. It is optional: set INDEXNOW_KEY (any 8-128
 * character letters, numbers and dashes) and the key is served at /api/indexnow-key. Failures are
 * swallowed; a missed ping only means the engine finds the page on its next crawl.
 */
export async function submitToIndexNow(paths: string[]) {
    const key = process.env.INDEXNOW_KEY;
    if (!key || paths.length === 0) return false;

    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: new URL(SITE_URL).host,
                key,
                keyLocation: `${SITE_URL}/api/indexnow-key`,
                urlList: paths.map((path) => `${SITE_URL}${path}`),
            }),
            signal: AbortSignal.timeout(5000),
        });
        return response.ok;
    } catch {
        return false;
    }
}
