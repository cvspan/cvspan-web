/**
 * Fetches every public page and checks what search engines and social networks read: title and
 * description length, canonical, robots, one h1, Open Graph and Twitter tags, structured data and
 * images without alt text. Run it against a running site:
 *
 *   node scripts/seo-audit.mjs                       # http://localhost:2000
 *   node scripts/seo-audit.mjs https://www.cvspan.com
 *
 * Exits with 1 when any page has a problem, so it can run in CI after a build.
 */
import { readFileSync } from 'node:fs';

const base = (process.argv[2] ?? 'http://localhost:2000').replace(/\/$/, '');
const routes = JSON.parse(readFileSync(new URL('../src/lib/seo/routes.generated.json', import.meta.url), 'utf8')).map((r) => r.path);

const first = (html, regex) => regex.exec(html)?.[1]?.trim();
const meta = (html, attr, name) =>
    first(html, new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i')) ??
    first(html, new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`, 'i'));

async function audit(path) {
    const problems = [];
    let html = '';
    let status = 0;
    try {
        const res = await fetch(base + path, { signal: AbortSignal.timeout(120_000), redirect: 'follow' });
        status = res.status;
        html = await res.text();
    } catch (error) {
        return { path, problems: [`could not fetch: ${error.message}`] };
    }
    if (status !== 200) problems.push(`status ${status}`);

    const title = first(html, /<title[^>]*>([^<]*)<\/title>/i);
    const description = meta(html, 'name', 'description');
    const canonical = first(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    const robots = meta(html, 'name', 'robots') ?? '';
    const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
    const noAlt = (html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) ?? []).length;

    if (!title) problems.push('no <title>');
    else if (title.length < 20 || title.length > 70) problems.push(`title is ${title.length} characters (aim for 20–70)`);
    if (!description) problems.push('no meta description');
    else if (description.length < 70 || description.length > 175) problems.push(`description is ${description.length} characters (aim for 70–175)`);
    if (!canonical) problems.push('no canonical link');
    else if (!canonical.startsWith('http')) problems.push('canonical is not absolute');
    if (/noindex/i.test(robots)) problems.push(`robots says ${robots}`);
    if (h1s !== 1) problems.push(`${h1s} <h1> elements (want exactly 1)`);
    if (!meta(html, 'property', 'og:title')) problems.push('no og:title');
    if (!meta(html, 'property', 'og:image')) problems.push('no og:image');
    if (!meta(html, 'name', 'twitter:card')) problems.push('no twitter:card');
    if (!/application\/ld\+json/.test(html)) problems.push('no structured data');
    if (!/<html[^>]+lang=/i.test(html)) problems.push('no lang on <html>');
    if (noAlt > 0) problems.push(`${noAlt} image(s) without an alt attribute`);

    return { path, title, problems };
}

const results = [];
const queue = [...routes];
await Promise.all(
    Array.from({ length: 3 }, async () => {
        while (queue.length) results.push(await audit(queue.shift()));
    }),
);

results.sort((a, b) => a.path.localeCompare(b.path));
let bad = 0;
for (const result of results) {
    if (result.problems.length === 0) continue;
    bad += 1;
    console.log(`\n${result.path}`);
    for (const problem of result.problems) console.log(`  - ${problem}`);
}
console.log(`\n${results.length - bad} of ${results.length} pages clean, ${bad} with problems.`);
process.exit(bad ? 1 : 0);
