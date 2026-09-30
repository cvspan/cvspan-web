"use client";

import { AdminDashboard } from "@/components/dashboards/admin";
import { ManagerDashboard } from "@/components/dashboards/manager";
import { MemberDashboard } from "@/components/dashboards/member";
import { useRole } from "@/components/portal/role-context";
import { atLeast } from "@/lib/roles";

export default function DashboardPage() {
  const { role } = useRole();

  if (atLeast(role, "admin")) return <AdminDashboard />;
  if (atLeast(role, "manager")) return <ManagerDashboard />;
  return <MemberDashboard />;
}
