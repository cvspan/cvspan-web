import { RoleProvider } from "@/components/portal/role-context";
import { Shell } from "@/components/portal/shell";

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RoleProvider>
      <Shell>{children}</Shell>
    </RoleProvider>
  );
}
