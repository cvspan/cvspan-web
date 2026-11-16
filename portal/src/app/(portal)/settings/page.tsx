import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/session";
import { getNotificationPreferences, getUserById } from "@/db/queries";
import { ChangePasswordForm } from "@/components/forms/password-forms";
import { AvatarField } from "@/components/forms/avatar-field";
import { NotificationPreferences } from "@/components/forms/notification-preferences";
import { accessSummary } from "@/lib/roles";

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
          <CardHeader title="Profile" />
          <div className="border-line border-b p-5">
            <AvatarField name={session.name} initialUrl={session.avatarUrl} />
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {[
              ["Full name", session.name],
              ["Job title", session.jobTitle ?? ""],
              ["Work email", session.email],
              ["Access", accessSummary({ role: session.access, isHr: session.isHr, isManagement: session.isManagement })],
            ].map(([label, value]) => (
              <label key={label} className="flex flex-col gap-1.5">
                <span className="text-primary text-body font-semibold">{label}</span>
                <input
                  readOnly
                  value={value}
                  placeholder="—"
                  className="border-line-input text-muted bg-raised h-11 cursor-not-allowed rounded-lg border px-3.5 text-para outline-none"
                />
              </label>
            ))}
          </div>
          <p className="text-muted border-line border-t px-5 py-4 text-caption">
            Your name, email, job title and access are set by an admin. If any of them is wrong, ask HR to
            correct it. You can change your photo here.
          </p>
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
        <CardHeader title="Password" />
        <div className="max-w-md p-5">
          <ChangePasswordForm />
        </div>
      </Card>

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
