import { RiAddLine, RiArrowRightSLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { SparkStat } from "@/components/ui/stat-card";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import {
  activity,
  blogPosts,
  departments,
  headcountByType,
  hiringPipeline,
  orgStats,
  programmes,
} from "@/lib/mock-data";

export function AdminDashboard() {
  const totalHeadcount = headcountByType.reduce((sum, row) => sum + row.count, 0);
  const pipelineMax = Math.max(...hiringPipeline.map((stage) => stage.count));

  return (
    <>
      <PageHeader
        pretitle="Organisation"
        title="Admin dashboard"
        actions={
          <>
            <Button variant="secondary">Export report</Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              Invite member
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orgStats.map((stat) => (
          <SparkStat key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Headcount by type" action={<Badge>{totalHeadcount} people</Badge>} />
          <ul className="p-5 pt-4">
            {headcountByType.map((row) => (
              <li key={row.type} className="py-2">
                <p className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-secondary text-body">{row.type}</span>
                  <span className="text-primary text-caption font-semibold">{row.count}</span>
                </p>
                <Progress
                  value={(row.count / totalHeadcount) * 100}
                  label={`${row.type}: ${row.count} of ${totalHeadcount}`}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Departments"
            action={
              <Button variant="ghost" size="sm">
                Manage
                <RiArrowRightSLine size={16} aria-hidden />
              </Button>
            }
          />
          <Table>
            <Thead columns={["Department", "Head", "Headcount", "Open roles"]} />
            <tbody>
              {departments.map((department) => (
                <Tr key={department.name}>
                  <Td className="text-primary font-semibold">{department.name}</Td>
                  <Td>{department.head}</Td>
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
            {hiringPipeline.map((stage) => (
              <li key={stage.stage} className="flex items-center gap-3 py-1.5">
                <span className="text-secondary w-22 shrink-0 text-body">{stage.stage}</span>
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
                  {programme.members} members · ends {programme.ends}
                </p>
                <Progress value={programme.progress} label={`${programme.name} progress`} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Blog queue" action={<Badge tone="warning">1 in review</Badge>} />
          <ul>
            {blogPosts.slice(0, 4).map((post) => (
              <li
                key={post.id}
                className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">
                    {post.title}
                  </span>
                  <span className="text-muted block text-tiny">
                    {post.author} · {post.updated}
                  </span>
                </span>
                <Badge
                  tone={
                    post.status === "Published"
                      ? "success"
                      : post.status === "In review"
                        ? "warning"
                        : post.status === "Scheduled"
                          ? "accent"
                          : "neutral"
                  }
                >
                  {post.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card>
        <CardHeader title="Organisation activity" />
        <ul className="py-2">
          {activity.map((item, index) => (
            <li key={index} className="flex items-start gap-3 px-5 py-2.5">
              <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                {item.initials}
              </span>
              <span className="min-w-0">
                <span className="text-primary block text-caption">{item.message}</span>
                <span className="text-muted block text-tiny">{item.when}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
