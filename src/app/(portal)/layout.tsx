import { RoleProvider } from "@/components/portal/role-context";
import { Shell } from "@/components/portal/shell";
import { getNotificationsFor } from "@/db/queries";
import { relativeDays } from "@/lib/format";
import { requireUser } from "@/lib/session";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const notifications = await getNotificationsFor(user.id, 8);

  return (
    <RoleProvider user={{ ...user, role: user.viewRole, realRole: user.role }}>
      <Shell
        notifications={notifications.map((item) => ({
          id: item.id,
          title: item.title,
          href: item.href,
          unread: item.readAt === null,
          when: relativeDays(item.createdAt),
        }))}
      >
        {children}
      </Shell>
    </RoleProvider>
  );
}
