import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getPeople } from "@/db/queries";
import { ROLES, roleLabels, type Role } from "@/lib/roles";

const capabilities: { area: string; allowed: Role[] }[] = [
  { area: "View own tasks, KPIs and attendance", allowed: ["super_admin", "admin", "manager", "member"] },
  { area: "Message colleagues", allowed: ["super_admin", "admin", "manager", "member"] },
  { area: "Assign tasks to others", allowed: ["super_admin", "admin", "manager"] },
  { area: "Grade KPIs and assignments", allowed: ["super_admin", "admin", "manager"] },
  { area: "Approve leave and timesheets", allowed: ["super_admin", "admin", "manager"] },
  { area: "View the full directory and org chart", allowed: ["super_admin", "admin"] },
  { area: "Invite and offboard members", allowed: ["super_admin", "admin"] },
  { area: "Publish to the website blog and careers", allowed: ["super_admin", "admin"] },
  { area: "Issue and revoke certificates", allowed: ["super_admin", "admin"] },
  { area: "Change roles and permissions", allowed: ["super_admin"] },
  { area: "Manage integrations and view the audit log", allowed: ["super_admin"] },
];

export default async function RolesPage() {
  const people = await getPeople();

  /** Who holds each role today, straight from the directory. */
  const holders = Object.fromEntries(
    ROLES.map((role) => [role, people.filter((person) => person.role === role).map((p) => p.name)]),
  ) as Record<Role, string[]>;

  return (
    <>
      <PageHeader pretitle="Organisation" title="Roles & access" />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        A role sets what someone can do. It is separate from employment type, so an intern can
        lead a team and a full-time member can hold no management rights. The four roles are fixed;
        to change what someone can do, a super admin changes their role from their profile.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role) => (
          <Card key={role} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {roleLabels[role]}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{holders[role].length}</p>
            <p className="text-muted mt-1 truncate text-caption">
              {holders[role].slice(0, 2).join(", ")}
              {holders[role].length > 2 ? ` +${holders[role].length - 2}` : ""}
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Permissions matrix" action={<Badge>{capabilities.length} capabilities</Badge>} />
        <Table>
          <Thead columns={["Capability", ...ROLES.map((role) => roleLabels[role])]} />
          <tbody>
            {capabilities.map((capability) => (
              <Tr key={capability.area}>
                <Td className="text-primary font-semibold">{capability.area}</Td>
                {ROLES.map((role) => (
                  <Td key={role}>
                    {capability.allowed.includes(role) ? (
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
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
