import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { authLimiter } from "@/lib/auth-limiter";
import { authConfig } from "./auth.config";

/** Too many wrong passwords for this email in a short time: the sign-in page says so instead of "not recognised". */
class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

/**
 * Compared against when the email is unknown, so an unknown email and a wrong password take the same
 * time and the sign-in page cannot be used to find out which emails have accounts.
 */
let decoyHash: string | undefined;
const decoy = () => (decoyHash ??= bcrypt.hashSync("not-a-real-password", 12));

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

        /** Counted by email whether or not an account exists, so this reveals nothing about who has one. */
        if (authLimiter.isLocked(email)) throw new TooManyAttempts();

        const [account] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const valid = await bcrypt.compare(password, account?.passwordHash ?? decoy());

        /** Suspended and alumni accounts keep their record but lose access. */
        if (!account?.passwordHash || !valid || (account.status !== "active" && account.status !== "invited")) {
          authLimiter.fail(email);
          return null;
        }

        authLimiter.clear(email);
        return {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          employmentType: account.employmentType,
          jobTitle: account.jobTitle ?? undefined,
          pwdAt: account.passwordChangedAt?.getTime() ?? 0,
        };
      },
    }),
  ],
});
