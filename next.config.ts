import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  /** The portal is served at cvspan.com/portal, alongside the public website. */
  basePath: BASE_PATH || undefined,

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
    return BASE_PATH
      ? [
          /** Convenience: opening the bare host (local dev) lands on the portal. */
          { source: "/", destination: BASE_PATH, permanent: false, basePath: false },
        ]
      : [];
  },
};

export default nextConfig;
