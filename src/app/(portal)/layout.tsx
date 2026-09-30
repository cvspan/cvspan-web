import { RoleProvider } from "@/components/portal/role-context";
import { Shell } from "@/components/portal/shell";
import { requireUser } from "@/lib/session";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <RoleProvider user={{ ...user, role: user.viewRole, realRole: user.role }}>
      <Shell>{children}</Shell>
    </RoleProvider>
  );
}
