import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Next 16 renamed `middleware` to `proxy`. The `authorized` callback in
 * auth.config.ts decides who may see each route.
 */
const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  /**
   * Everything except static assets, the auth endpoints, and uploaded media —
   * cover images have to load on the public website, where there is no session.
   */
  matcher: ["/((?!api/auth|api/media|_next/static|_next/image|favicon.ico).*)"],
};
