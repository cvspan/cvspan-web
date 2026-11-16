"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/lib/roles";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  /** The role currently being rendered (a preview for super admins). */
  role: Role;
  /** The role actually held by the signed-in user. */
  realRole: Role;
  jobTitle: string;
  /** A stored media path, or null to show initials. */
  avatarUrl: string | null;
  employmentType: string;
};

type RoleContextValue = {
  user: SessionUser;
  /** The role the portal is being rendered as; equals the real role unless previewing. */
  role: Role;
  canSwitch: boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

/**
 * Seeds the viewing role from the signed-in user. Super admins can preview the
 * portal as a lower role, which only affects what this browser renders.
 */
export function RoleProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <RoleContext value={{ user, role: user.role, canSwitch: user.realRole === "super_admin" }}>
      {children}
    </RoleContext>
  );
}

export function useRole() {
  const value = useContext(RoleContext);
  if (!value) throw new Error("useRole must be used inside RoleProvider");
  return value;
}
