import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gauge, Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { KpiBars } from "@/components/portal/kpi-bars";
import { kpiTrend } from "@/lib/mock-data";

const definitions = [
  { name: "Delivery — work shipped on time", weight: 30, score: 4.4 },
  { name: "Quality — rework and review notes", weight: 25, score: 4.0 },
  { name: "Collaboration — reviews and support", weight: 20, score: 4.5 },
  { name: "Initiative — improvements proposed", weight: 15, score: 3.8 },
  { name: "Attendance and timeliness", weight: 10, score: 4.6 },
];

const history = [
  { period: "September 2026", score: 82, grade: "4.2 / 5", by: "Ada Obi", note: "Strong handover work." },
  { period: "August 2026", score: 79, grade: "4.0 / 5", by: "Ada Obi", note: "Watch the review turnaround." },
  { period: "July 2026", score: 75, grade: "3.8 / 5", by: "Ada Obi", note: "Good progress on tokens." },
  { period: "June 2026", score: 68, grade: "3.4 / 5", by: "Ada Obi", note: "Onboarding period." },
];

export default function KpisPage() {
  return (
    <>
      <PageHeader
        pretitle="Performance"
        title="My KPIs"
        actions={
          <>
            <Button variant="secondary">Download report</Button>
            <Button>Start self-assessment</Button>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <p className="text-muted self-start text-tiny font-semibold tracking-wide uppercase">
              Current score
            </p>
            <Gauge value={82} caption="September" size={148} />
            <p className="text-muted text-caption">Graded 26 Sep by Ada Obi</p>
            <Badge tone="warning">Self-assessment due tomorrow</Badge>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Score trend" action={<Badge>Last 6 months</Badge>} />
          <KpiBars data={kpiTrend} />
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="What you are measured on" action={<Badge>5 measures</Badge>} />
          <ul className="p-5 pt-4">
            {definitions.map((definition) => (
              <li key={definition.name} className="py-2.5">
                <p className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-secondary text-body">{definition.name}</span>
                  <span className="text-primary shrink-0 text-caption font-semibold">
                    {definition.score} / 5 · {definition.weight}%
                  </span>
                </p>
                <Progress
                  value={(definition.score / 5) * 100}
                  tone={definition.score >= 4 ? "success" : "brand"}
                  label={`${definition.name}: ${definition.score} out of 5`}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Grading history" />
          <Table>
            <Thead columns={["Period", "Score", "Grade", "Graded by"]} />
            <tbody>
              {history.map((row) => (
                <Tr key={row.period}>
                  <Td className="text-primary font-semibold whitespace-nowrap">{row.period}</Td>
                  <Td>{row.score}%</Td>
                  <Td>
                    <Badge tone={row.score >= 80 ? "success" : "neutral"}>{row.grade}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{row.by}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
