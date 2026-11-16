import type { DefaultSession } from "next-auth";
import type { AccessLevel } from "@/lib/roles";
import type { EmploymentType } from "@/lib/format";

declare module "next-auth" {
  interface User {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
  }

  interface Session {
    user: {
      id: string;
      role: AccessLevel;
      employmentType: EmploymentType;
      jobTitle?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
  }
}

/** Auth.js v5 re-exports its JWT type from @auth/core, so augment that too. */
declare module "@auth/core/jwt" {
  interface JWT {
    role: AccessLevel;
    employmentType: EmploymentType;
    jobTitle?: string;
  }
}
