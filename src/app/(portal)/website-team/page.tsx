import { notFound } from "next/navigation";
import { RiExternalLinkLine, RiImageLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  AddTeamMemberButton,
  DeleteTeamMemberButton,
  EditTeamMemberButton,
  TeamMemberControls,
} from "@/components/forms/team-member-forms";
import { getWebsiteTeam } from "@/db/queries-team";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { websiteUrl } from "@/lib/website";
import { bioParagraphs, teamPhotoSrc } from "@/lib/website-team";

export const metadata = { title: "Team page" };

export default async function WebsiteTeamPage() {
  const user = await requireUser();
  if (!atLeast(user.viewRole, "admin")) notFound();

  const members = await getWebsiteTeam();
  const live = members.filter((member) => member.published).length;

  return (
    <>
      <PageHeader
        pretitle="Website"
        title="Team page"
        actions={
          <>
            <a href={websiteUrl("/about/teams")} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" type="button">
                <RiExternalLinkLine size={18} aria-hidden />
                View on website
              </Button>
            </a>
            <AddTeamMemberButton count={members.length} />
          </>
        }
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        The people shown on the website&apos;s Team page, in this order. The About page shows the first
        four. Add a bio to give someone their own profile page.
      </p>

      <Card>
        <CardHeader
          title="Team members"
          action={<Badge>{live === members.length ? `${live} on the website` : `${live} of ${members.length} on the website`}</Badge>}
        />

        {members.length === 0 ? (
          <p className="text-muted px-5 py-10 text-center text-body">
            No one yet. Add the first team member and they appear on the website.
          </p>
        ) : (
          <ul className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {members.map((member, index) => {
              const photo = teamPhotoSrc(member.photoUrl);
              return (
                <li key={member.id} className="border-line bg-card flex flex-col overflow-hidden rounded-lg border">
                  <div className="bg-raised relative aspect-square">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- served from our own media route or the website
                      <img
                        src={photo}
                        alt={`${member.name}`}
                        className={`size-full object-cover ${member.published ? "" : "opacity-40 grayscale"}`}
                      />
                    ) : (
                      <span className="text-muted flex size-full items-center justify-center">
                        <RiImageLine size={28} aria-hidden />
                      </span>
                    )}
                    <span className="absolute top-2 left-2 flex gap-1.5">
                      <Badge tone="neutral">{index + 1}</Badge>
                      {member.published ? null : <Badge tone="warning">Hidden</Badge>}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <p className="text-primary truncate text-para font-semibold">{member.name}</p>
                    <p className="text-secondary truncate text-body">{member.role}</p>
                    <p className="text-muted text-caption">
                      {bioParagraphs(member.bio).length > 0 ? "Has a profile page" : "No bio"}
                    </p>
                  </div>

                  <div className="border-line flex items-center justify-between gap-2 border-t px-3 py-2.5">
                    <EditTeamMemberButton
                      member={{
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        bio: member.bio,
                        photoUrl: member.photoUrl,
                        photoSrc: photo,
                        updatedAt: member.updatedAt.toISOString(),
                      }}
                    />
                    <span className="flex items-center">
                      <TeamMemberControls
                        id={member.id}
                        name={member.name}
                        published={member.published}
                        first={index === 0}
                        last={index === members.length - 1}
                      />
                      <DeleteTeamMemberButton id={member.id} name={member.name} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
