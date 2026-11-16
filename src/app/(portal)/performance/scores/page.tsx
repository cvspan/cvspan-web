import { withBasePath } from "@/lib/base-path";
import { RiDownloadLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gauge, Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { KpiBars } from "@/components/portal/kpi-bars";
import { getKpiHistory, getKpiTrend, getSelfAssessments } from "@/db/queries";
import { SelfAssessmentButton } from "@/components/forms/self-assessment";
import { companyDay } from "@/lib/dates";
import { formatMonth } from "@/lib/format";
import { PerformanceTabs } from "@/components/portal/performance-tabs";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

/** Weightings are defined per team; shown here so people know what is measured. */
const measures = [
  { name: "Delivery — work shipped on time", weight: 30 },
  { name: "Quality — rework and review notes", weight: 25 },
  { name: "Collaboration — reviews and support", weight: 20 },
  { name: "Initiative — improvements proposed", weight: 15 },
  { name: "Attendance and timeliness", weight: 10 },
];

export default async function KpisPage() {
  const user = await requireUser();
  const [trend, history, assessments] = await Promise.all([
    getKpiTrend(user.id),
    getKpiHistory(user.id),
    getSelfAssessments(user.id, 1),
  ]);

  /** This month's self-assessment, if there is one. */
  const thisMonth = `${companyDay().slice(0, 7)}-01`;
  const mine = assessments[0]?.periodStart === thisMonth ? assessments[0] : null;

  const latest = trend.at(-1);
  const previous = trend.at(-2);
  const change = latest && previous ? latest.score - previous.score : 0;

  return (
    <>
      <PageHeader
        pretitle="Performance"
        title="Performance"
        actions={
          <>
            <a href={withBasePath("/api/export/kpis")} download>
              <Button variant="secondary" type="button">
                <RiDownloadLine size={18} aria-hidden />
                Download report
              </Button>
            </a>
            <SelfAssessmentButton
              monthLabel={formatMonth(thisMonth)}
              current={
                mine
                  ? { score: mine.score, comment: mine.comment, updatedAt: mine.updatedAt.toISOString() }
                  : null
              }
            />
          </>
        }
      />

      <PerformanceTabs active="scores" canReview={atLeast(user.viewRole, "manager")} />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <p className="text-muted self-start text-tiny font-semibold tracking-wide uppercase">
              Current score
            </p>
            {latest ? (
              <>
                <Gauge value={latest.score} caption={formatMonth(latest.periodStart)} size={148} />
                <p className="text-muted text-caption">
                  {change >= 0 ? "Up" : "Down"} {Math.abs(change)} points on last cycle
                </p>
              </>
            ) : (
              <p className="text-muted py-10 text-body">No scores recorded yet.</p>
            )}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Score trend" action={<Badge>Last {trend.length} cycles</Badge>} />
          {trend.length > 0 ? (
            <KpiBars
              data={trend.map((point) => ({
                month: formatMonth(point.periodStart),
                score: point.score,
              }))}
            />
          ) : (
            <p className="text-muted px-5 py-10 text-body">Nothing to chart yet.</p>
          )}
        </Card>
      </section>

      <Card>
        <CardHeader
          title="My self-assessment"
          action={<Badge tone={mine ? "success" : "neutral"}>{mine ? `${mine.score}%` : "Not done yet"}</Badge>}
        />
        <p className="text-secondary px-5 py-4 text-body">
          {mine
            ? mine.comment || "No notes added."
            : `You haven't assessed ${formatMonth(thisMonth)} yet. Use “Start self-assessment” above to tell your manager how it went.`}
        </p>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="What you are measured on" action={<Badge>{measures.length} measures</Badge>} />
          <ul className="p-5 pt-4">
            {measures.map((measure) => (
              <li key={measure.name} className="py-2.5">
                <p className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-secondary text-body">{measure.name}</span>
                  <span className="text-primary shrink-0 text-caption font-semibold">
                    {measure.weight}%
                  </span>
                </p>
                <Progress value={measure.weight * 3} label={`${measure.name} weighting`} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Grading history" />
          {history.length === 0 ? (
            <p className="text-muted px-5 py-6 text-body">No grades yet.</p>
          ) : (
            <Table>
              <Thead columns={["Period", "Score", "Graded by", "Comment"]} />
              <tbody>
                {history.map((row) => (
                  <Tr key={row.id}>
                    <Td className="text-primary font-semibold whitespace-nowrap">
                      {formatMonth(row.periodStart)} {new Date(row.periodStart).getFullYear()}
                    </Td>
                    <Td>
                      <Badge tone={row.score >= 80 ? "success" : "neutral"}>{row.score}%</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">{row.gradedBy ?? "—"}</Td>
                    <Td>{row.comment ?? "—"}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </section>
    </>
  );
}
