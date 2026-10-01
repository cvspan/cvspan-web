import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { updateProfile } from "@/app/actions/profile";
import { requireUser } from "@/lib/session";
import { getNotificationPreferences, getUserById } from "@/db/queries";
import { AvatarField } from "@/components/forms/avatar-field";
import { NotificationPreferences } from "@/components/forms/notification-preferences";
import { roleLabels } from "@/lib/roles";

export default async function SettingsPage() {
  const session = await requireUser();
  const [account, preferences] = await Promise.all([
    getUserById(session.id),
    getNotificationPreferences(session.id),
  ]);

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
          <div className="border-line border-b p-5">
            <AvatarField name={session.name} initialUrl={session.avatarUrl} />
          </div>
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
        <CardHeader title="Notifications" action={<Badge>In the portal</Badge>} />
        <p className="text-muted px-5 pt-4 text-body">
          Choose which updates appear in your notification bell. Email alerts aren&apos;t set up
          yet, so nothing is sent by email.
        </p>
        <NotificationPreferences initial={preferences} />
      </Card>
    </>
  );
}
