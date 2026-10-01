import { mediaSrc } from "@/lib/base-path";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-6 text-tiny",
  md: "size-8 text-tiny",
  lg: "size-10 text-caption",
  xl: "size-24 text-h5",
} as const;

/** A person's photo when they have one, otherwise their initials. */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  /** A stored media path (/api/media/…) or any image URL. */
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      title={name}
      className={cn(
        "bg-accent-soft text-accent flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        sizes[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- served from our own media route
        <img src={mediaSrc(src)} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

/** Overlapping avatars, collapsing the rest into a "+n" chip. */
export function AvatarStack({
  people,
  max = 4,
}: {
  people: { id: string; name: string }[];
  max?: number;
}) {
  if (people.length === 0) return <span className="text-muted">—</span>;

  const shown = people.slice(0, max);
  const extra = people.length - shown.length;

  return (
    <span className="flex items-center -space-x-1.5">
      {shown.map((person) => (
        <Avatar key={person.id} name={person.name} size="sm" className="ring-card ring-2" />
      ))}
      {extra > 0 ? (
        <span
          title={people
            .slice(max)
            .map((person) => person.name)
            .join(", ")}
          className="bg-raised text-secondary ring-card flex size-6 items-center justify-center rounded-full text-tiny font-semibold ring-2"
        >
          +{extra}
        </span>
      ) : null}
    </span>
  );
}
