import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

/**
 * Hosts the public website is served from (the host part of each WEBSITE_ORIGINS entry). The website
 * passes /portal through to the portal, so a sign-in form posted from www.cvspan.com reaches the portal
 * under the portal's own address. Next.js refuses a form action whose Origin differs from the host it
 * sees ("Invalid Server Actions request") unless that origin is listed here.
 */
const websiteHosts = (process.env.WEBSITE_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .flatMap((origin) => {
    try {
      return [new URL(origin).host];
    } catch {
      return [];
    }
  });

const nextConfig: NextConfig = {
  /** The portal is served at cvspan.com/portal, alongside the public website. */
  basePath: BASE_PATH || undefined,

  experimental: {
    serverActions: { allowedOrigins: websiteHosts },
  },

  /**
   * The portal is private. Everything except the public sign-in page tells search engines not to
   * index it, even if a link to it leaks, as a second layer behind the sign-in requirement.
   */
  async headers() {
    return [
      {
        source: "/:path((?!login$).*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },

  async redirects() {
    return [
      /** KPIs became Performance; old links and notifications still land on the scores. */
      { source: "/kpis", destination: "/performance/scores", permanent: false },
      ...(BASE_PATH
        ? [
            /** Convenience: opening the bare host (local dev) lands on the portal. */
            { source: "/", destination: BASE_PATH, permanent: false, basePath: false as const },
          ]
        : []),
    ];
  },
};

export default nextConfig;
