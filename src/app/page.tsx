import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiMore2Fill,
  RiTimeLine,
} from "@remixicon/react";
import { Sidebar } from "@/components/portal/sidebar";
import { Topbar } from "@/components/portal/topbar";
import { KpiChart } from "@/components/portal/kpi-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  activity,
  currentUser,
  deadlines,
  stats,
  tasks,
  type TaskStatus,
  type Tone,
} from "@/lib/mock-data";

const statusTone: Record<TaskStatus, Tone> = {
  "To do": "neutral",
  "In progress": "accent",
  Overdue: "error",
  Done: "success",
};

export default function MemberDashboard() {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex flex-col gap-5 p-4 lg:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-muted text-tiny font-semibold tracking-wider">OVERVIEW</p>
              <h1 className="text-primary text-h5 font-semibold">
                Good morning, {currentUser.name.split(" ")[0]}
              </h1>
            </div>
            <Button variant="secondary">
              <RiCalendarLine size={18} aria-hidden />
              This week
            </Button>
            <Button>
              <RiTimeLine size={18} aria-hidden />
              Clock in
            </Button>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-5">
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                  {stat.label}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="text-primary text-h5 font-semibold">{stat.value}</span>
                  <Badge tone={stat.tone}>{stat.delta}</Badge>
                </p>
                <p className="text-muted mt-1 text-caption">{stat.caption}</p>
              </Card>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title="My KPI trend"
                action={<Badge>Last 6 months</Badge>}
              />
              <KpiChart />
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

          <section className="grid gap-5 xl:grid-cols-3">
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
                    className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
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
                      className="text-muted hover:text-primary hover:bg-raised flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                    >
                      <RiMore2Fill size={18} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
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
