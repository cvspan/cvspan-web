import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiAwardLine,
  RiCheckboxCircleLine,
  RiMegaphoneLine,
  RiMore2Fill,
  RiStarSmileLine,
} from "@remixicon/react";
import { Sidebar } from "@/components/portal/sidebar";
import { Topbar } from "@/components/portal/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { BarSpark, Gauge, Progress, Sparkline } from "@/components/ui/chart";
import {
  activity,
  currentUser,
  deadlines,
  kpiTrend,
  miniStats,
  sparkTaskCompletion,
  tasks,
  tiles,
  type TaskStatus,
  type Tone,
} from "@/lib/mock-data";

const statusTone: Record<TaskStatus, Tone> = {
  "To do": "neutral",
  "In progress": "accent",
  Overdue: "error",
  Done: "success",
};

const tileIcons = [RiCheckboxCircleLine, RiStarSmileLine, RiAwardLine, RiMegaphoneLine];

function Delta({ value, tone }: { value: string; tone: Tone }) {
  const colour =
    tone === "success"
      ? "text-success-text"
      : tone === "error"
        ? "text-error-text"
        : "text-muted";
  const Icon = tone === "success" ? RiArrowUpLine : tone === "error" ? RiArrowDownLine : null;

  return (
    <span className={`inline-flex items-center gap-0.5 text-caption font-semibold ${colour}`}>
      {value}
      {Icon ? <Icon size={14} aria-hidden /> : null}
    </span>
  );
}

export default function MemberDashboard() {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex flex-col gap-4 p-4 lg:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-muted text-tiny font-semibold tracking-widest uppercase">
                Overview
              </p>
              <h1 className="text-primary text-h5 font-semibold">Dashboard</h1>
            </div>
            <Button variant="secondary">Log attendance</Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New task
            </Button>
          </div>

          {/* Welcome + headline metrics */}
          <section className="grid gap-4 xl:grid-cols-4">
            <Card className="bg-accent-soft border-transparent xl:col-span-2">
              <div className="flex h-full flex-col justify-between gap-6 p-6">
                <div>
                  <h2 className="text-primary text-title font-semibold">
                    Welcome back, {currentUser.name.split(" ")[0]}
                  </h2>
                  <p className="text-secondary mt-1 text-body">
                    You have 3 new messages and 2 tasks due today.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                      This week&apos;s tasks
                    </p>
                    <p className="mt-1 mb-2 flex items-center gap-2">
                      <span className="text-primary text-title font-semibold">6</span>
                      <Delta value="+2" tone="success" />
                    </p>
                    <Progress value={72} tone="success" label="Weekly task progress" />
                  </div>
                  <div>
                    <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                      Programme progress
                    </p>
                    <p className="mt-1 mb-2 flex items-center gap-2">
                      <span className="text-primary text-title font-semibold">64%</span>
                      <Delta value="+8%" tone="success" />
                    </p>
                    <Progress value={64} label="Programme progress" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                  Tasks completed
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="text-primary text-h4 font-semibold">18</span>
                  <Delta value="+9%" tone="success" />
                </p>
                <p className="text-muted mt-1 text-caption">
                  6 more than the same week last month
                </p>
              </div>
              <Sparkline points={sparkTaskCompletion} label="Tasks completed over 12 weeks" />
            </Card>

            <Card>
              <div className="flex h-full flex-col items-center justify-center gap-2 p-5">
                <p className="text-muted self-start text-tiny font-semibold tracking-wide uppercase">
                  KPI score
                </p>
                <Gauge value={kpiTrend[kpiTrend.length - 1].score} caption="September" />
                <p className="text-muted text-caption">Graded 26 Sep by Ada Obi</p>
              </div>
            </Card>
          </section>

          {/* Mini stat row */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {miniStats.map((stat) => (
              <Card key={stat.label}>
                <div className="flex items-start justify-between gap-2 p-5 pb-3">
                  <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <span className="text-muted text-tiny">Last 12 weeks</span>
                </div>
                <p className="flex items-center gap-2 px-5 pb-3">
                  <span className="text-primary text-h5 font-semibold">{stat.value}</span>
                  <Delta value={stat.delta} tone={stat.tone} />
                </p>
                {stat.kind === "line" ? (
                  <Sparkline points={stat.spark} label={`${stat.label} trend`} />
                ) : (
                  <div className="px-5 pb-5">
                    <BarSpark points={stat.spark} label={`${stat.label} trend`} />
                  </div>
                )}
              </Card>
            ))}
          </section>

          {/* Icon tiles */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {tiles.map((tile, index) => {
              const Icon = tileIcons[index];
              return (
                <Card key={tile.label}>
                  <div className="flex items-center gap-3 p-4">
                    <span className="bg-accent-soft text-accent flex size-11 shrink-0 items-center justify-center rounded-lg">
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="text-primary block text-body font-semibold">
                        {tile.value} {tile.label}
                      </span>
                      <span className="text-muted block text-caption">{tile.caption}</span>
                    </span>
                  </div>
                </Card>
              );
            })}
          </section>

          {/* Tasks + deadlines */}
          <section className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title="My tasks"
                action={
                  <Button variant="ghost" size="sm">
                    View all
                    <RiArrowRightSLine size={16} aria-hidden />
                  </Button>
                }
              />
              <ul>
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="border-line hover:bg-raised flex items-center gap-3 border-b px-5 py-3 transition-colors last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={task.done}
                      aria-label={task.title}
                      className="accent-brand size-4 cursor-pointer"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          task.done
                            ? "text-muted block truncate text-body font-semibold line-through"
                            : "text-primary block truncate text-body font-semibold"
                        }
                      >
                        {task.title}
                      </span>
                      <span className="text-muted block text-tiny">{task.meta}</span>
                    </span>
                    <Badge tone={statusTone[task.status]}>{task.status}</Badge>
                    <button
                      type="button"
                      aria-label={`Actions for ${task.title}`}
                      className="text-muted hover:text-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                    >
                      <RiMore2Fill size={18} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader title="Upcoming deadlines" />
              <ul>
                {deadlines.map((deadline) => (
                  <li
                    key={deadline.title}
                    className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="text-primary block truncate text-body font-semibold">
                        {deadline.title}
                      </span>
                      <span className="text-muted block text-tiny">{deadline.when}</span>
                    </span>
                    <Badge tone={deadline.tone}>{deadline.left}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* KPI trend + activity */}
          <section className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title="KPI trend" action={<Badge>Last 6 months</Badge>} />
              <div className="px-5 pt-5 pb-4">
                <div
                  className="flex h-40 items-end gap-3 sm:gap-5"
                  role="img"
                  aria-label={`KPI score by month. ${kpiTrend
                    .map((p) => `${p.month} ${p.score} percent`)
                    .join(", ")}.`}
                >
                  {kpiTrend.map((point, index) => (
                    <div
                      key={point.month}
                      className="flex h-full flex-1 flex-col justify-end gap-2"
                    >
                      <span className="text-muted text-center text-tiny">{point.score}</span>
                      <div
                        className={
                          index === kpiTrend.length - 1
                            ? "bg-brand mx-auto w-full max-w-12 rounded-md"
                            : "bg-brand/35 mx-auto w-full max-w-12 rounded-md"
                        }
                        style={{ height: `${point.score}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-3 sm:gap-5">
                  {kpiTrend.map((point) => (
                    <span key={point.month} className="text-muted flex-1 text-center text-tiny">
                      {point.month}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Recent activity" />
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
          </section>
        </main>
      </div>
    </div>
  );
}
