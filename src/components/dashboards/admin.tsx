import { withBasePath } from "@/lib/base-path";
import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { InviteMemberButton } from "@/components/forms/people-forms";
import {
  getBlogPosts,
  getPeople,
  getDepartmentSummary,
  getHeadcountByType,
  getHiringPipeline,
  getOpenApprovals,
  getOrgCounts,
  getProgrammes,
  getRecentActivity,
} from "@/db/queries";
import { employmentLabels, initials, postStatusLabels, relativeDays } from "@/lib/format";
import { statusTone } from "@/lib/tone";

export async function AdminDashboard() {
  const [counts, headcount, departments, pipeline, programmes, posts, activity, approvals, people] =
    await Promise.all([
      getOrgCounts(),
      getHeadcountByType(),
      getDepartmentSummary(),
      getHiringPipeline(),
      getProgrammes(),
      getBlogPosts(),
      getRecentActivity(6),
      getOpenApprovals(),
      getPeople(),
    ]);

  const totalHeadcount = headcount.reduce((sum, row) => sum + row.count, 0);
  const pipelineMax = Math.max(...pipeline.map((stage) => stage.count), 1);
  const inReview = posts.filter((post) => post.status === "in_review").length;

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="Admin dashboard"
        actions={
          <>
            <a href={withBasePath("/api/export/people")} download>
              <Button variant="secondary" type="button">
                Export CSV
              </Button>
            </a>
            <InviteMemberButton
              departments={departments.map((department) => department.name)}
              managers={people
                .filter((person) => person.role !== "member")
                .map((person) => ({ id: person.id, name: person.name }))}
            />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total members", value: String(counts.people), caption: "across all types" },
          { label: "Open roles", value: String(counts.openRoles), caption: "live on careers" },
          { label: "Applicants", value: String(counts.applicants), caption: "in the pipeline" },
          {
            label: "Approvals open",
            value: String(approvals.length),
            caption: "across all managers",
          },
        ].map((tile) => (
          <Card key={tile.label} className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              {tile.label}
            </p>
            <p className="text-primary mt-1 text-h5 font-semibold">{tile.value}</p>
            <p className="text-muted mt-1 text-caption">{tile.caption}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Headcount by type" action={<Badge>{totalHeadcount} people</Badge>} />
          <ul className="p-5 pt-4">
            {headcount.map((row) => (
              <li key={row.type} className="py-2">
                <p className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-secondary text-body">{employmentLabels[row.type]}</span>
                  <span className="text-primary text-caption font-semibold">{row.count}</span>
                </p>
                <Progress
                  value={(row.count / totalHeadcount) * 100}
                  label={`${employmentLabels[row.type]}: ${row.count} of ${totalHeadcount}`}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Departments"
            action={
              <Link href="/departments">
                <Button variant="ghost" size="sm">
                  Manage
                  <RiArrowRightSLine size={16} aria-hidden />
                </Button>
              </Link>
            }
          />
          <Table>
            <Thead columns={["Department", "Headcount", "Open roles"]} />
            <tbody>
              {departments.map((department) => (
                <Tr key={department.name}>
                  <Td className="text-primary font-semibold">{department.name}</Td>
                  <Td>{department.headcount}</Td>
                  <Td>
                    {department.openRoles > 0 ? (
                      <Badge tone="accent">{department.openRoles} open</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Hiring pipeline" />
          <ul className="p-5 pt-4">
            {pipeline.map((stage) => (
              <li key={stage.stage} className="flex items-center gap-3 py-1.5">
                <span className="text-secondary w-22 shrink-0 text-body capitalize">
                  {stage.stage}
                </span>
                <span className="bg-raised h-6 flex-1 overflow-hidden rounded-md">
                  <span
                    className="bg-brand block h-full rounded-md"
                    style={{ width: `${(stage.count / pipelineMax) * 100}%` }}
                  />
                </span>
                <span className="text-primary w-6 text-right text-caption font-semibold">
                  {stage.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Programmes running" />
          <ul>
            {programmes.map((programme) => (
              <li key={programme.id} className="border-line border-b px-5 py-3 last:border-b-0">
                <p className="text-primary truncate text-body font-semibold">{programme.name}</p>
                <p className="text-muted mt-0.5 mb-2 text-tiny">
                  {programme.members} member{programme.members === 1 ? "" : "s"} ·{" "}
                  {programme.stage}
                </p>
                <Progress value={programme.progress} label={`${programme.name} progress`} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Blog queue"
            action={
              inReview > 0 ? <Badge tone="warning">{inReview} in review</Badge> : <Badge>Clear</Badge>
            }
          />
          <ul>
            {posts.slice(0, 4).map((post) => (
              <li
                key={post.id}
                className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">
                    {post.title}
                  </span>
                  <span className="text-muted block text-tiny">
                    {post.author} · {relativeDays(post.updatedAt)}
                  </span>
                </span>
                <Badge tone={statusTone(post.status)}>{postStatusLabels[post.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card>
        <CardHeader title="Organisation activity" />
        <ul className="py-2">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-5 py-2.5">
              <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                {initials(item.actor ?? "CV")}
              </span>
              <span className="min-w-0">
                <span className="text-primary block text-caption">
                  {item.actor} {item.action}
                  {item.subject ? ` — ${item.subject}` : ""}
                </span>
                <span className="text-muted block text-tiny">{relativeDays(item.createdAt)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
