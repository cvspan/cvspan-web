"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Role } from "@/lib/roles";

type RoleContextValue = { role: Role; setRole: (role: Role) => void };

const RoleContext = createContext<RoleContextValue>({
  role: "member",
  setRole: () => {},
});

/**
 * Holds the role the portal is being viewed as. Until auth lands this is a
 * preview switch; afterwards the signed-in user's role seeds it and the
 * switcher is limited to super admins.
 */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("member");

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    try {
      localStorage.setItem("cvspan-role", next);
    } catch {
      // Storage can be unavailable; the switch still applies for this visit.
    }
  }, []);

  return <RoleContext value={{ role, setRole }}>{children}</RoleContext>;
}

export function useRole() {
  return useContext(RoleContext);
}
