import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  /** The portal is served at cvspan.com/portal, alongside the public website. */
  basePath: BASE_PATH || undefined,

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
