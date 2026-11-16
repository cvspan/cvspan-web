/*
 * Builds src/lib/seo/routes.generated.json: every public, static page in src/app, so the sitemap
 * lists a new page the moment it exists. It runs before `dev` and `build` (see package.json), so
 * nobody has to remember to edit a list.
 *
 * A page is left out when it has a dynamic segment (those come from data: blog posts, roles, team
 * members), sits under a private area, or its layout/page marks itself `noindex`. Last-modified
 * comes from git, falling back to the file's modified time.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appDir = join(root, 'src', 'app');
const output = join(root, 'src', 'lib', 'seo', 'routes.generated.json');

/** Areas that are never listed, however they are marked. */
const PRIVATE_PREFIXES = ['/api', '/blog/auth', '/blog/dashboard', '/blog/author'];

const toRoute = (dir) => {
    const segments = relative(appDir, dir)
        .split(sep)
        .filter((segment) => segment && !/^\(.*\)$/.test(segment));
    return { path: `/${segments.join('/')}`, segments };
};

/** Does this folder's layout or page opt out of indexing? Checks every layout above the page too. */
function isNoindex(dir) {
    for (let current = dir; current.startsWith(appDir); current = dirname(current)) {
        for (const name of ['page.tsx', 'layout.tsx']) {
            const file = join(current, name);
            if (existsSync(file) && /noIndex:\s*true|index:\s*false/.test(readFileSync(file, 'utf8'))) return true;
        }
    }
    return false;
}

function lastModified(dir) {
    try {
        const stamp = execFileSync('git', ['log', '-1', '--format=%cI', '--', dir], { cwd: root, encoding: 'utf8' }).trim();
        if (stamp) return stamp;
    } catch {
        /* not a git checkout */
    }
    return statSync(join(dir, 'page.tsx')).mtime.toISOString();
}

const routes = [];

function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const next = join(dir, entry.name);
        if (entry.name.startsWith('_') || entry.name.startsWith('@')) continue;
        walk(next);
    }

    if (!existsSync(join(dir, 'page.tsx')) && !existsSync(join(dir, 'page.ts'))) return;
    const { path, segments } = toRoute(dir);
    if (segments.some((segment) => segment.startsWith('['))) return;
    if (PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return;
    if (isNoindex(dir)) return;
    routes.push({ path, lastModified: lastModified(dir) });
}

walk(appDir);
routes.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(output, `${JSON.stringify(routes, null, 4)}\n`);
console.log(`routes: ${routes.length} public pages written to ${relative(root, output)}`);
