import { RiCalendarLine, RiTimeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getAttendanceFor, getAttendanceRate, getLeaveFor } from "@/db/queries";
import {
  attendanceLabels,
  formatDay,
  formatTime,
  formatWeekday,
  hoursBetween,
} from "@/lib/format";
import { requireUser } from "@/lib/session";
import { attendanceTone, statusTone } from "@/lib/tone";

export default async function AttendancePage() {
  const user = await requireUser();
  const [days, rate, leave] = await Promise.all([
    getAttendanceFor(user.id, 14),
    getAttendanceRate(user.id),
    getLeaveFor(user.id),
  ]);

  const today = days[0];
  const openNow = today && today.clockIn && !today.clockOut;
  const leaveTaken = leave
    .filter((request) => request.status === "approved")
    .reduce((sum, request) => sum + request.days, 0);
  const pendingLeave = leave.filter((request) => request.status === "pending").length;

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
              {openNow ? "Clock out" : "Clock in"}
            </Button>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="bg-accent-soft border-transparent xl:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                {openNow ? "Clocked in today" : "Last clock-in"}
              </p>
              <p className="text-primary mt-1 text-h4 font-semibold">
                {formatTime(today?.clockIn ?? null)}
              </p>
              <p className="text-secondary mt-1 text-body">
                {today ? attendanceLabels[today.kind] : "No record"} ·{" "}
                {openNow ? "in progress" : hoursBetween(today?.clockIn, today?.clockOut)}
              </p>
            </div>
            <Progress value={openNow ? 78 : 100} label="Hours worked today" />
          </div>
        </Card>

        <Card>
          <div className="flex h-full flex-col gap-3 p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              Attendance rate
            </p>
            <p className="text-primary text-h4 font-semibold">{rate}%</p>
            <p className="text-muted text-caption">Across recorded working days</p>
            <div className="mt-auto">
              <Progress value={rate} tone={rate >= 90 ? "success" : "brand"} label="Attendance rate" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex h-full flex-col gap-3 p-5">
            <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
              Leave taken
            </p>
            <p className="text-primary text-h4 font-semibold">{leaveTaken} days</p>
            <p className="text-muted text-caption">
              {pendingLeave} pending approval
            </p>
            <div className="mt-auto">
              <Progress value={(leaveTaken / 20) * 100} tone="success" label="Leave used" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent days" action={<Badge>{days.length} records</Badge>} />
          <Table>
            <Thead columns={["Day", "Type", "Clock in", "Clock out", "Hours"]} />
            <tbody>
              {days.map((entry) => (
                <Tr key={entry.id}>
                  <Td className="text-primary font-semibold whitespace-nowrap">
                    {formatWeekday(entry.day)} {formatDay(entry.day)}
                  </Td>
                  <Td>
                    <Badge tone={attendanceTone(entry.kind)}>{attendanceLabels[entry.kind]}</Badge>
                  </Td>
                  <Td>{formatTime(entry.clockIn)}</Td>
                  <Td>{formatTime(entry.clockOut)}</Td>
                  <Td>{hoursBetween(entry.clockIn, entry.clockOut)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="My leave requests" />
          {leave.length === 0 ? (
            <p className="text-muted px-5 py-6 text-body">No requests yet.</p>
          ) : (
            <ul>
              {leave.map((request) => (
                <li
                  key={request.id}
                  className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block truncate text-body font-semibold">
                      {request.type}
                    </span>
                    <span className="text-muted block text-tiny">
                      {request.startDate}
                      {request.endDate !== request.startDate ? ` – ${request.endDate}` : ""} ·{" "}
                      {request.days} day{request.days > 1 ? "s" : ""}
                    </span>
                  </span>
                  <Badge tone={statusTone(request.status)} className="capitalize">
                    {request.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
