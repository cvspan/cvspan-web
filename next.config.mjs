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
    // browser keeps seeing a single site. Without it, /portal is not proxied (local development).
    async rewrites() {
        const portal = process.env.PORTAL_ORIGIN?.replace(/\/+$/, '');
        if (!portal) return [];
        return [{ source: '/portal/:path*', destination: `${portal}/portal/:path*` }];
    },
};

export default nextConfig;
