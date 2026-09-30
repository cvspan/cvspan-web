import {
  RiAddLine,
  RiArrowRightSLine,
  RiAwardLine,
  RiCheckboxCircleLine,
  RiMegaphoneLine,
  RiMore2Fill,
  RiStarSmileLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gauge, Progress, Sparkline } from "@/components/ui/chart";
import { Delta } from "@/components/ui/delta";
import { PageHeader } from "@/components/ui/page-header";
import { SparkStat } from "@/components/ui/stat-card";
import { KpiBars } from "@/components/portal/kpi-bars";
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

export function MemberDashboard() {
  const myTasks = tasks.filter((task) => task.assignee === currentUser.name);

  return (
    <>
      <PageHeader
        pretitle="Overview"
        title="Dashboard"
        actions={
          <>
            <Button variant="secondary">Log attendance</Button>
            <Button>
              <RiAddLine size={18} aria-hidden />
              New task
            </Button>
          </>
        }
      />

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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {miniStats.map((stat) => (
          <SparkStat key={stat.label} {...stat} />
        ))}
      </section>

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
            {myTasks.map((task) => (
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

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="KPI trend" action={<Badge>Last 6 months</Badge>} />
          <KpiBars data={kpiTrend} />
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
    </>
  );
}
