import { Badge } from "@/components/ui/badge";
import { healthLabels, healthTone, type Health } from "@/lib/project";

export function HealthBadge({ health }: { health: Health }) {
  return <Badge tone={healthTone[health]}>{healthLabels[health]}</Badge>;
}
