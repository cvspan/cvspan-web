
import { Badge } from "@/components/ui/badge";
import { RequestLeaveButton } from "@/components/forms/attendance-forms";
import { Avatar } from "@/components/ui/avatar";
import { PresenceBadge } from "@/components/portal/presence-badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/chart";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { getAttendanceFor, getAttendanceRate, getLeaveFor } from "@/db/queries";
import { getTeamPresence } from "@/db/queries-attendance";
import { workedLabel } from "@/modules/attendance/domain/presence";
import { companyDay, mondayOf } from "@/lib/dates";
import { leaveBalance } from "@/lib/leave";
import { getUserById } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import {
  attendanceLabels,
  formatDay,
  formatTime,
  formatWeekday,
} from "@/lib/format";
import { requireUser } from "@/lib/session";
import { attendanceTone, statusTone } from "@/lib/tone";

export default async function AttendancePage() {
  const user = await requireUser();
  const [days, rate, leave, team, account] = await Promise.all([
    getAttendanceFor(user.id, 14),
    getAttendanceRate(user.id),
    getLeaveFor(user.id),
    atLeast(user.viewRole, "manager") ? getTeamPresence({ id: user.id, role: user.viewRole }) : Promise.resolve([]),
    getUserById(user.id),
  ]);

  const todayKey = companyDay();
  const latest = days[0];
  const today = latest?.day === todayKey ? latest : undefined;
  const openNow = Boolean(today?.working);
  const eightHours = 8 * 3_600_000;
  const inNow = team.filter((person) => person.status === "online").length;
  const teamAverage = team.length > 0 ? team.reduce((sum, person) => sum + person.weekMs, 0) / team.length : 0;
  const isAdmin = atLeast(user.viewRole, "hr");
  const balance = leaveBalance(
    { employmentType: account?.employmentType ?? user.employmentType, startDate: account?.startDate ?? null, endDate: account?.endDate ?? null },
    leave,
    todayKey,
  );

  return (
    <>
      <PageHeader
        pretitle="Workplace"
        title="Attendance"
        actions={
          <>
            <PresenceBadge working={openNow} clockIn={today?.clockIn ?? null} />
            <RequestLeaveButton allowance={balance.allowance} remaining={balance.remaining} />
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="bg-accent-soft border-transparent xl:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6 p-6">
            <div>
              <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
                {openNow ? "Clocked in today" : today ? "Clocked out today" : "Last clock-in"}
              </p>
              <p className="text-primary mt-1 text-h4 font-semibold">
                {formatTime((today ?? latest)?.clockIn ?? null)}
              </p>
              <p className="text-secondary mt-1 text-body">
                {(today ?? latest) ? attendanceLabels[(today ?? latest)!.kind] : "No record"} ·{" "}
                {today
                  ? openNow
                    ? `in for ${workedLabel(today.workedMs)} so far`
                    : `worked ${workedLabel(today.workedMs)}, out at ${formatTime(today.clockOut)}`
                  : workedLabel(latest?.workedMs ?? null)}
              </p>
              <p className="text-muted mt-3 text-caption">
                You are clocked in automatically when you open the portal, and out when you sign out or close it.
              </p>
            </div>
            <Progress
              value={Math.min(100, ((today?.workedMs ?? 0) / eightHours) * 100)}
              label="Hours worked today"
            />
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
              Leave balance
            </p>
            {balance.allowance === null ? (
              <>
                <p className="text-primary text-h4 font-semibold">{balance.taken} days</p>
                <p className="text-muted text-caption">taken · no allowance is set for your role</p>
              </>
            ) : (
              <>
                <p className="text-primary text-h4 font-semibold">
                  {balance.remaining} <span className="text-muted text-body font-normal">of {balance.allowance} days left</span>
                </p>
                <p className="text-muted text-caption">
                  {balance.taken} taken · {balance.pending} pending approval ·{" "}
                  {balance.period.kind === "internship"
                    ? `for your internship, to ${formatDay(balance.period.end)}`
                    : `working days, ${balance.period.start.slice(0, 4)}`}
                </p>
                <div className="mt-auto">
                  <Progress
                    value={((balance.taken + balance.pending) / balance.allowance) * 100}
                    tone={balance.remaining === 0 ? "warning" : "success"}
                    label="Leave used"
                  />
                </div>
              </>
            )}
          </div>
        </Card>
      </section>

      {atLeast(user.viewRole, "manager") ? (
        <Card>
          <CardHeader
            title={isAdmin ? "Who is in" : "My team's presence"}
            action={
              <Badge>
                Week of {formatDay(mondayOf(todayKey))}
              </Badge>
            }
          />
          <div className="border-line grid gap-px border-b sm:grid-cols-3">
            {[
              ["In now", `${inNow} of ${team.length}`],
              ["Not in today", String(team.filter((person) => person.status === "none").length)],
              ["Average this week", workedLabel(teamAverage)],
            ].map(([label, value]) => (
              <div key={label} className="px-5 py-4">
                <p className="text-muted text-tiny font-semibold tracking-wide uppercase">{label}</p>
                <p className="text-primary mt-0.5 text-title font-semibold">{value}</p>
              </div>
            ))}
          </div>
          {team.length === 0 ? (
            <p className="text-muted px-5 py-8 text-center text-body">No one to show yet.</p>
          ) : (
            <Table>
              <Thead columns={["Person", "Status", "Clocked in", "Clocked out", "Last active", "This week"]} />
              <tbody>
                {[...team]
                  .sort((a, b) => Number(b.status === "online") - Number(a.status === "online") || a.name.localeCompare(b.name))
                  .map((person) => (
                    <Tr key={person.id}>
                      <Td>
                        <span className="flex items-center gap-2.5">
                          <Avatar name={person.name} />
                          <span>
                            <span className="text-primary block font-semibold">{person.name}</span>
                            <span className="text-muted block text-tiny">{person.jobTitle ?? "—"}</span>
                          </span>
                        </span>
                      </Td>
                      <Td>
                        {person.status === "online" ? (
                          <Badge tone="success">Active now</Badge>
                        ) : person.status === "out" ? (
                          <Badge>Signed out</Badge>
                        ) : (
                          <Badge tone="warning">Not in today</Badge>
                        )}
                      </Td>
                      <Td className="whitespace-nowrap">{formatTime(person.clockIn)}</Td>
                      <Td className="whitespace-nowrap">
                        {person.status === "online" ? "In progress" : formatTime(person.clockOut)}
                      </Td>
                      <Td className="whitespace-nowrap">
                        {person.status === "online"
                          ? "Now"
                          : person.lastActive
                            ? `${formatDay(person.lastActive)} · ${formatTime(person.lastActive)}`
                            : "Never"}
                      </Td>
                      <Td className="whitespace-nowrap">
                        <span className="text-primary font-semibold">{workedLabel(person.weekMs)}</span>
                        <span className="text-muted ml-1.5 text-tiny">
                          {person.weekDays} day{person.weekDays === 1 ? "" : "s"}
                        </span>
                      </Td>
                    </Tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card>
      ) : null}

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
                  <Td>{workedLabel(entry.workedMs)}</Td>
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
