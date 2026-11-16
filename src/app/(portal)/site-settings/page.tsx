import { notFound } from "next/navigation";
import { RiExternalLinkLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SiteSettingsForm } from "@/components/forms/site-settings-form";
import { getSiteSettings } from "@/db/queries-site";
import { formatDay, formatTime } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { websiteUrl } from "@/lib/website";

export const metadata = { title: "Site settings" };

export default async function SiteSettingsPage() {
  const user = await requireUser();
  if (!atLeast(user.viewRole, "admin")) notFound();

  const { updatedAt, ...settings } = await getSiteSettings();
  const origin = websiteUrl();

  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Site settings"
        actions={
          <a href={origin} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" type="button">
              <RiExternalLinkLine size={18} aria-hidden />
              View the website
            </Button>
          </a>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        How the website presents itself to search engines, social networks and analytics, in one place. Changes reach the
        website within a minute. Leave a field empty to keep the website&apos;s built-in value.
      </p>

      <SiteSettingsForm
        initial={settings}
        websiteUrl={origin}
        saved={updatedAt ? `${formatDay(updatedAt)} at ${formatTime(updatedAt)}` : null}
      />
    </>
  );
}
