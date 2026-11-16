import type { NextAuthConfig } from "next-auth";
import { BASE_PATH } from "@/lib/base-path";

/**
 * Edge-safe half of the auth setup: no database or bcrypt here, because
 * middleware runs on the edge runtime. Providers live in `src/auth.ts`.
 */
export const authConfig = {
  /** Auth.js builds absolute URLs itself, so it has to be told the portal lives under a prefix. */
  basePath: `${BASE_PATH}/api/auth`,
  pages: { signIn: `${BASE_PATH}/login` },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const signedIn = Boolean(auth?.user);
      const onLogin = request.nextUrl.pathname.startsWith("/login");

      if (onLogin) {
        if (signedIn) return Response.redirect(new URL(`${BASE_PATH}/`, request.nextUrl));
        return true;
      }

      return signedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.employmentType = user.employmentType;
        token.jobTitle = user.jobTitle;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.employmentType = token.employmentType;
        session.user.jobTitle = token.jobTitle;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
