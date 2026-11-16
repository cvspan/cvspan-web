import type { DefaultSession } from "next-auth";
import type { AccessLevel } from "@/lib/roles";
import type { EmploymentType } from "@/lib/format";

declare module "next-auth" {
  interface User {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
    /** When the password last changed (ms since 1970, 0 if never), so a changed password ends older sessions. */
    pwdAt?: number;
  }

  interface Session {
    user: {
      id: string;
      role: AccessLevel;
      employmentType: EmploymentType;
      jobTitle?: string;
      pwdAt?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
    pwdAt?: number;
  }
}

/** Auth.js v5 re-exports its JWT type from @auth/core, so augment that too. */
declare module "@auth/core/jwt" {
  interface JWT {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
    pwdAt?: number;
  }
}
