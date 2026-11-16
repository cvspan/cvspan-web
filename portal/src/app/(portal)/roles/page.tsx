import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { AddAdminButton, RemoveAdminButton } from "@/components/forms/admin-forms";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getPeople } from "@/db/queries";
import { employmentLabels } from "@/lib/format";
import { INTERNSHIP_MONTHS } from "@/lib/grading";
import { LEAVE_ALLOWANCE } from "@/lib/leave";
import { ENGAGEMENTS, ROLES, atLeast, roleLabels, type Role } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { notFound } from "next/navigation";

/**
 * What each tier can do, as the lowest tier that can. The ladder is cumulative (Super admin >
 * Admin > HR > Management > Staff), so the matrix is read straight off it: "Admin can do everything
 * HR can, plus system settings" is the order of the columns.
 */
const capabilities: { group: string; items: { area: string; min: Role }[] }[] = [
  {
    group: "Everyone",
    items: [
      { area: "See their own tasks, KPIs, attendance and certificates", min: "member" },
      { area: "Be clocked in and out automatically by the open portal", min: "member" },
      { area: "Request leave within their allowance", min: "member" },
      { area: "Set their own objectives and track progress", min: "member" },
      { area: "Change their own password", min: "member" },
      { area: "Message colleagues", min: "member" },
      { area: "Write blog posts and send them for review (they see only their own)", min: "member" },
    ],
  },
  {
    group: "Management: supervising people",
    items: [
      { area: "Assign tasks and lead projects", min: "manager" },
      { area: "See their team's attendance and presence", min: "manager" },
      { area: "Approve their team's leave", min: "manager" },
      { area: "Review the objectives of the people they supervise", min: "manager" },
      { area: "Grade weekly reviews and KPIs", min: "manager" },
      { area: "Put a report forward for a certificate", min: "manager" },
    ],
  },
  {
    group: "HR: people operations",
    items: [
      { area: "See the full directory and org chart", min: "hr" },
      { area: "Invite, edit and offboard people, and set Management", min: "hr" },
      { area: "See everyone's attendance, leave and performance", min: "hr" },
      { area: "Create performance cycles and programmes", min: "hr" },
      { area: "Set a temporary password for someone who has none or forgot it (Admin for HR, Super admin for Admins)", min: "hr" },
      { area: "Manage departments", min: "hr" },
      { area: "Run recruitment: careers listings and applicants", min: "hr" },
      { area: "Approve, issue and revoke certificates", min: "hr" },
      { area: "Extend internships and correct start and end dates", min: "hr" },
    ],
  },
  {
    group: "Admin: the system and the website",
    items: [
      { area: "Manage SEO, analytics and tracking tags for the website (Site settings)", min: "admin" },
      { area: "Review blog posts: publish them or send them back with feedback", min: "admin" },
      { area: "Publish to the website blog and manage its Team page", min: "admin" },
      { area: "Give and take away HR", min: "admin" },
    ],
  },
  {
    group: "Super admin",
    items: [
      { area: "Make and remove Admins", min: "super_admin" },
      { area: "Preview the portal as any role", min: "super_admin" },
    ],
  },
];

const total = capabilities.reduce((sum, group) => sum + group.items.length, 0);

export default async function RolesPage() {
  const user = await requireUser();
  if (!atLeast(user.viewRole, "admin")) notFound();

  const people = (await getPeople()).filter((person) => person.status !== "alumni");
  const employees = people.filter((person) => person.access === "employee");
  const admins = people.filter((person) => person.access === "admin");
  /** Only a super admin makes or removes Admins. */
  const canManageAdmins = user.role === "super_admin";
  const candidates = employees
    .filter((person) => person.status === "active" || person.status === "invited")
    .map((person) => ({ id: person.id, name: person.name, hint: person.jobTitle ?? employmentLabels[person.employmentType] }));

  const types = [
    {
      label: "Super admin",
      count: people.filter((person) => person.access === "super_admin").length,
      names: people.filter((person) => person.access === "super_admin").map((person) => person.name),
      detail: "Owns the system. Makes Admins.",
    },
    {
      label: "Admin",
      count: people.filter((person) => person.access === "admin").length,
      names: people.filter((person) => person.access === "admin").map((person) => person.name),
      detail: "Everything HR can do, plus the website and system settings.",
    },
    {
      label: "Employee",
      count: employees.length,
      names: [],
      detail: `Management ${employees.filter((person) => person.isManagement).length} · HR ${employees.filter((person) => person.isHr).length} · Staff ${employees.filter((person) => !person.isManagement && !person.isHr).length}`,
    },
  ];

  return (
    <>
      <PageHeader pretitle="Organisation" title="Roles & access" />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Three kinds of people use the portal. Super admins and Admins run the system. Everyone else is an
        Employee, who can be in Management (supervising people), in HR (people operations), both, or neither,
        which makes them Staff. How someone is engaged (full-time, part-time, internship or volunteer) is
        separate: it sets the rules that apply to them, not what they can open. Change someone&apos;s access
        and functions from their profile.
      </p>

      <section className="grid gap-4 sm:grid-cols-3">
        {types.map((type) => (
          <Card key={type.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">{type.label}</p>
            <p className="text-primary mt-1 text-h5 font-semibold">{type.count}</p>
            <p className="text-muted mt-1 text-caption">
              {type.names.length > 0 ? `${type.names.slice(0, 2).join(", ")}${type.names.length > 2 ? ` +${type.names.length - 2}` : ""} · ` : ""}
              {type.detail}
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader
          title="Admins"
          action={canManageAdmins ? <AddAdminButton candidates={candidates} /> : <Badge>{admins.length}</Badge>}
        />
        {admins.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">
            No admins yet.{canManageAdmins ? " Add someone and they can run the website, Site settings and give out HR." : ""}
          </p>
        ) : (
          <ul>
            {admins.map((person) => (
              <li key={person.id} className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0">
                <Avatar name={person.name} src={person.avatarUrl} size="lg" />
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">{person.name}</span>
                  <span className="text-muted block truncate text-caption">{person.jobTitle ?? person.email}</span>
                </span>
                {canManageAdmins ? <RemoveAdminButton id={person.id} name={person.name} /> : null}
              </li>
            ))}
          </ul>
        )}
        {canManageAdmins ? null : (
          <p className="text-muted border-line border-t px-5 py-3 text-caption">Only a super admin can add or remove Admins.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Permissions matrix" action={<Badge>{total} capabilities</Badge>} />
        <Table>
          <Thead columns={["Capability", ...ROLES.map((role) => roleLabels[role])]} />
          <tbody>
            {capabilities.map((group) => [
              <Tr key={group.group}>
                <td colSpan={ROLES.length + 1} className="bg-raised text-muted px-4 py-2 text-tiny font-semibold tracking-wide uppercase">
                  {group.group}
                </td>
              </Tr>,
              ...group.items.map((capability) => (
                <Tr key={capability.area}>
                  <Td className="text-primary font-semibold">{capability.area}</Td>
                  {ROLES.map((role) => (
                    <Td key={role}>
                      {atLeast(role, capability.min) ? (
                        <span className="text-success-text" title="Allowed">
                          <RiCheckLine size={18} aria-label="Allowed" />
                        </span>
                      ) : (
                        <span className="text-muted" title="Not allowed">
                          <RiCloseLine size={18} aria-label="Not allowed" />
                        </span>
                      )}
                    </Td>
                  ))}
                </Tr>
              )),
            ])}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="Engagement rules" action={<Badge>Applies to everyone, whatever their access</Badge>} />
        <Table>
          <Thead columns={["Engagement", "People", "Leave allowance", "How it works"]} />
          <tbody>
            {ENGAGEMENTS.map((type) => {
              const allowance = LEAVE_ALLOWANCE[type];
              return (
                <Tr key={type}>
                  <Td className="text-primary font-semibold">{employmentLabels[type]}</Td>
                  <Td>{people.filter((person) => person.employmentType === type).length}</Td>
                  <Td className="whitespace-nowrap">
                    {allowance
                      ? `${allowance} working days ${type === "internship" ? "for the internship" : "a year"}`
                      : "None set"}
                  </Td>
                  <Td className="text-secondary">
                    {type === "internship"
                      ? `Runs ${INTERNSHIP_MONTHS} months from the start date. HR or an admin can extend it. A certificate request reaches HR when it ends.`
                      : type === "full_time"
                        ? "Leave resets each calendar year."
                        : "Attendance and leave are recorded; no allowance limits them."}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
