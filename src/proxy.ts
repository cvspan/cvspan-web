import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Next 16 renamed `middleware` to `proxy`. The `authorized` callback in
 * auth.config.ts decides who may see each route.
 */
const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  /** Everything except static assets and the auth endpoints themselves. */
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
