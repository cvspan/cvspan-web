import { after } from "next/server";
import { redirect } from "next/navigation";
import { RoleProvider } from "@/components/portal/role-context";
import { PresenceTracker } from "@/components/portal/presence-tracker";
import { Shell } from "@/components/portal/shell";
import { getNotificationsFor } from "@/db/queries";
import { relativeDays } from "@/lib/format";
import { recordPortalActivity } from "@/lib/activity";
import { requireUser } from "@/lib/session";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  /** A temporary password has to be replaced before anything else. */
  if (user.mustChangePassword) redirect("/change-password");
  /** After the response is sent, so tracking never slows a page down. */
  after(() => recordPortalActivity(user.id));
  const notifications = await getNotificationsFor(user.id, 8);

  return (
    <RoleProvider user={{ ...user, role: user.viewRole, realRole: user.role }}>
      <PresenceTracker />
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
