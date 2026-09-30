import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const [account] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!account?.passwordHash) return null;

        /** Suspended and alumni accounts keep their record but lose access. */
        if (account.status !== "active" && account.status !== "invited") return null;

        const valid = await bcrypt.compare(password, account.passwordHash);
        if (!valid) return null;

        return {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          employmentType: account.employmentType,
          jobTitle: account.jobTitle ?? undefined,
        };
      },
    }),
  ],
});
