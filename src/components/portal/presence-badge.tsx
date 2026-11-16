import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/format";

/** Where someone stands today. Clocking is automatic, so this only reports it. */
export function PresenceBadge({ working, clockIn }: { working: boolean; clockIn: Date | null }) {
  if (!clockIn) return <Badge>Not clocked in today</Badge>;
  return working ? (
    <Badge tone="success">Clocked in · since {formatTime(clockIn)}</Badge>
  ) : (
    <Badge>Clocked out</Badge>
  );
}
