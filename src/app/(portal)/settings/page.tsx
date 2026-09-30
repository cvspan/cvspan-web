import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { updateProfile } from "@/app/actions/profile";
import { requireUser } from "@/lib/session";
import { getUserById } from "@/db/queries";
import { roleLabels } from "@/lib/roles";

const notificationRows = [
  { label: "Task assigned to me", email: true, inApp: true },
  { label: "Deadline approaching", email: true, inApp: true },
  { label: "KPI graded", email: true, inApp: true },
  { label: "Leave approved or declined", email: true, inApp: true },
  { label: "Certificate issued", email: true, inApp: false },
  { label: "Weekly digest", email: false, inApp: false },
];

export default async function SettingsPage() {
  const session = await requireUser();
  const account = await getUserById(session.id);

  return (
    <>
      <PageHeader
        pretitle="Account"
        title="Settings"
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <form action={updateProfile}>
          <CardHeader title="Profile" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Full name</span>
              <input
                name="name"
                defaultValue={session.name}
                className="border-line-input text-primary h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Job title</span>
              <input
                name="jobTitle"
                defaultValue={session.jobTitle}
                className="border-line-input text-primary h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Work email</span>
              <input
                readOnly
                defaultValue={session.email}
                className="border-line-input text-primary h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Role</span>
              <input
                readOnly
                defaultValue={roleLabels[session.role]}
                className="border-line-input text-muted h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>
          </div>
          <footer className="border-line flex justify-end border-t px-5 py-4">
            <Button type="submit">Save changes</Button>
          </footer>
          </form>
        </Card>

        <Card>
          <CardHeader title="Employment" />
          <ul className="p-5">
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Type</span>
              <Badge>{session.employmentType}</Badge>
            </li>
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Job title</span>
              <span className="text-primary text-body font-semibold">{session.jobTitle || "—"}</span>
            </li>
            <li className="border-line flex items-center justify-between gap-3 border-b py-2.5">
              <span className="text-secondary text-body">Started</span>
              <span className="text-primary text-body font-semibold">{account?.startDate ?? "—"}</span>
            </li>
            <li className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-secondary text-body">Status</span>
              <Badge tone="success" className="capitalize">{account?.status ?? "active"}</Badge>
            </li>
          </ul>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="Notifications"
          action={<Badge tone="accent">Email alerts on</Badge>}
        />
        <ul className="p-5">
          {notificationRows.map((row) => (
            <li
              key={row.label}
              className="border-line flex items-center justify-between gap-4 border-b py-3 last:border-b-0"
            >
              <span className="text-secondary text-body">{row.label}</span>
              <span className="flex items-center gap-6">
                <label className="text-muted flex cursor-pointer items-center gap-2 text-caption">
                  <input
                    type="checkbox"
                    defaultChecked={row.email}
                    className="accent-brand size-4 cursor-pointer"
                    aria-label={`Email me when: ${row.label}`}
                  />
                  Email
                </label>
                <label className="text-muted flex cursor-pointer items-center gap-2 text-caption">
                  <input
                    type="checkbox"
                    defaultChecked={row.inApp}
                    className="accent-brand size-4 cursor-pointer"
                    aria-label={`Notify me in the portal when: ${row.label}`}
                  />
                  In portal
                </label>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
