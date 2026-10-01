/** @type {import('next').NextConfig} */
const nextConfig = {
    // Type and lint errors used to be ignored here, which let 20 type errors and
    // a completely broken ESLint setup ship unnoticed. Both gates are on: the
    // build should fail when the code does.

    async redirects() {
        return [
            // The old placeholder article. Real articles now live at /blog/<slug>, published from the CVSpan Portal.
            { source: '/blog/blog-post', destination: '/blog', permanent: true },
        ];
    },

    // In production the CVSpan Portal is its own deployment served at cvspan.com/portal.
    // Set PORTAL_ORIGIN to its address (for example https://cvspan-portal.vercel.app) and the
    // browser keeps seeing a single site. In local development it defaults to the portal on port 3000.
    async rewrites() {
        const fallback = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined;
        const portal = (process.env.PORTAL_ORIGIN ?? fallback)?.replace(/\/+$/, '');
        if (!portal) return [];
        return [
            // The portal is a newer Next.js than this site, and it checks the "_rsc" value on every
            // client-side navigation. This site strips that value before proxying, so the portal
            // would redirect forever ("1 Issue" in dev, a full page reload in production). Put it back.
            {
                source: '/portal/:path*',
                has: [{ type: 'query', key: '_rsc', value: '(?<rsc>.*)' }],
                destination: `${portal}/portal/:path*?_rsc=:rsc`,
            },
            { source: '/portal/:path*', destination: `${portal}/portal/:path*` },
        ];
    },
};

export default nextConfig;
