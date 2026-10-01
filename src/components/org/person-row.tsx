import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { levelBadge, levelOf, type Level, type OrgPerson } from "@/lib/org";
import { pluralise } from "@/lib/format";
import { cn } from "@/lib/utils";

const tone = { ceo: "accent", executive: "accent", head: "success", manager: "neutral", member: "neutral" } as const;

export function LevelBadge({ person }: { person: Pick<OrgPerson, "orgLevel" | "headOf"> }) {
  const level: Level = levelOf(person);
  return <Badge tone={tone[level]}>{levelBadge(person)}</Badge>;
}

/** One person in the chart: who they are, where they sit, and optionally an action. */
export function PersonRow({
  person,
  you = false,
  teamSize,
  href,
  action,
  emphasis = false,
}: {
  person: OrgPerson & { status?: string };
  you?: boolean;
  /** Everyone beneath them, at any depth. */
  teamSize?: number;
  /** Where the name links to, when the viewer may open that profile. */
  href?: string;
  action?: React.ReactNode;
  emphasis?: boolean;
}) {
  const name = href ? (
    <Link href={href} className="text-primary hover:text-accent font-semibold">
      {person.name}
    </Link>
  ) : (
    <span className="text-primary font-semibold">{person.name}</span>
  );

  return (
    <div
      className={cn(
        "border-line bg-card flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-4 py-3",
        (you || emphasis) && "border-brand bg-accent-soft",
      )}
    >
      <Avatar name={person.name} size="lg" className={you || emphasis ? "bg-card" : undefined} />
      <div className="min-w-0 flex-1 basis-48">
        <p className="flex flex-wrap items-center gap-x-2 text-body">
          {name}
          {you ? <Badge tone="accent">You</Badge> : null}
          {person.status === "invited" ? <Badge tone="warning">Invited</Badge> : null}
        </p>
        <p className="text-muted truncate text-tiny">
          {[person.jobTitle, person.departmentName].filter(Boolean).join(" · ") || "No title yet"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LevelBadge person={person} />
        {teamSize ? <span className="text-muted text-tiny">{pluralise(teamSize, "person", "people")} in team</span> : null}
        {action}
      </div>
    </div>
  );
}
