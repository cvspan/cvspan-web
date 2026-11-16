import { AdminDashboard } from "@/components/dashboards/admin";
import { ManagerDashboard } from "@/components/dashboards/manager";
import { MemberDashboard } from "@/components/dashboards/member";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();

  if (atLeast(user.viewRole, "hr")) return <AdminDashboard viewerRole={user.viewRole} />;
  if (atLeast(user.viewRole, "manager")) return <ManagerDashboard user={user} />;
  return <MemberDashboard user={user} />;
}
