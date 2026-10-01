import {
  RiAwardLine,
  RiBriefcaseLine,
  RiBuilding2Line,
  RiCheckboxCircleLine,
  RiChat3Line,
  RiDashboardLine,
  RiFileTextLine,
  RiFolderChartLine,
  RiGroupLine,
  RiLineChartLine,
  RiNodeTree,
  RiStarSmileLine,
  RiOrganizationChart,
  RiSettings3Line,
  RiShieldUserLine,
  RiTaskLine,
  RiTimeLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import type { Role } from "./roles";
import { atLeast } from "./roles";

export type NavLink = {
  href: string;
  label: string;
  icon: RemixiconComponentType;
  /** Lowest role that sees this link. */
  minRole: Role;
};

export type NavSection = { title: string; links: NavLink[] };

const sections: NavSection[] = [
  {
    title: "Overview",
    links: [
      { href: "/", label: "Dashboard", icon: RiDashboardLine, minRole: "member" },
      { href: "/tasks", label: "Tasks", icon: RiTaskLine, minRole: "member" },
      { href: "/kpis", label: "KPIs", icon: RiLineChartLine, minRole: "member" },
      { href: "/reviews", label: "Weekly reviews", icon: RiStarSmileLine, minRole: "member" },
    ],
  },
  {
    title: "Workplace",
    links: [
      { href: "/attendance", label: "Attendance", icon: RiTimeLine, minRole: "member" },
      { href: "/messages", label: "Messages", icon: RiChat3Line, minRole: "member" },
      { href: "/org", label: "Org chart", icon: RiNodeTree, minRole: "member" },
      { href: "/projects", label: "Projects", icon: RiFolderChartLine, minRole: "member" },
      { href: "/programmes", label: "Programmes", icon: RiAwardLine, minRole: "member" },
    ],
  },
  {
    title: "Manage",
    links: [
      { href: "/team", label: "My team", icon: RiGroupLine, minRole: "manager" },
      { href: "/approvals", label: "Approvals", icon: RiCheckboxCircleLine, minRole: "manager" },
      { href: "/people", label: "People", icon: RiOrganizationChart, minRole: "admin" },
      { href: "/departments", label: "Departments", icon: RiBuilding2Line, minRole: "admin" },
      { href: "/roles", label: "Roles & access", icon: RiShieldUserLine, minRole: "super_admin" },
    ],
  },
  {
    title: "Website",
    links: [
      { href: "/blog", label: "Blog", icon: RiFileTextLine, minRole: "admin" },
      { href: "/careers", label: "Careers", icon: RiBriefcaseLine, minRole: "admin" },
    ],
  },
];

export const settingsLink: NavLink = {
  href: "/settings",
  label: "Settings",
  icon: RiSettings3Line,
  minRole: "member",
};

export function navFor(role: Role): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => atLeast(role, link.minRole)),
    }))
    .filter((section) => section.links.length > 0);
}
