import { RiCalendarLine, RiTimeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress, Sparkline } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import {
  attendanceMonth,
  leaveRequests,
  sparkAttendance,
  type AttendanceKind,
  type Tone,
} from "@/lib/mock-data";

const kindTone: Record<AttendanceKind, Tone> = {
  "On site": "success",
  Remote: "accent",
  Leave: "warning",
  Absent: "error",
};

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        pretitle="Workplace"
        title="Attendance"
        actions={
          <>
            <Button variant="secondary">
              <RiCalendarLine size={18} aria-hidden />
              Request leave
            </Button>
            <Button>
              <RiTimeLine size={18} aria-hidden />
              Clock out
            </Button>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="bg-accent-soft border-transparent xl:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                Clocked in today
              </p>
              <p className="text-primary mt-1 text-h4 font-semibold">08:52</p>
              <p className="text-secondary mt-1 text-body">
                On site · 6h 14m so far · target 8h
              </p>
            </div>
            <Progress value={78} label="Hours worked today" />
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              This month
            </p>
            <p className="text-primary mt-2 text-h4 font-semibold">96%</p>
            <p className="text-muted mt-1 text-caption">21 of 22 working days</p>
          </div>
          <Sparkline points={sparkAttendance} label="Attendance over 12 weeks" />
        </Card>

        <Card>
          <div className="flex h-full flex-col gap-3 p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              Leave balance
            </p>
            <p className="text-primary text-h4 font-semibold">14 days</p>
            <p className="text-muted text-caption">6 taken · 1 pending approval</p>
            <div className="mt-auto">
              <Progress value={30} tone="success" label="Leave used" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent days" action={<Badge>September</Badge>} />
          <Table>
            <Thead columns={["Day", "Type", "Clock in", "Clock out", "Hours"]} />
            <tbody>
              {attendanceMonth.map((entry) => (
                <Tr key={entry.day}>
                  <Td className="text-primary font-semibold whitespace-nowrap">
                    {entry.weekday} {entry.day}
                  </Td>
                  <Td>
                    <Badge tone={kindTone[entry.kind]}>{entry.kind}</Badge>
                  </Td>
                  <Td>{entry.clockIn}</Td>
                  <Td>{entry.clockOut}</Td>
                  <Td>{entry.hours}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Leave requests" />
          <ul>
            {leaveRequests.map((request) => (
              <li
                key={request.id}
                className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                  {request.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-primary block truncate text-body font-semibold">
                    {request.type}
                  </span>
                  <span className="text-muted block text-tiny">
                    {request.dates} · {request.days} day{request.days > 1 ? "s" : ""}
                  </span>
                </span>
                <Badge tone={request.status === "Approved" ? "success" : "warning"}>
                  {request.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
