import "server-only";
import { and, gte, inArray, sql } from "drizzle-orm";
import { db } from "./index";
import { attendance } from "./schema";
import { getDirectReports, getPeople } from "./queries";
import { presenceView } from "@/modules/attendance/domain/presence";
import { companyDay, mondayOf } from "@/lib/dates";
import { atLeast, type Role } from "@/lib/roles";

export type PersonPresence = {
  id: string;
  name: string;
  jobTitle: string | null;
  /** online: the portal is open now · out: was in today and has left · none: not in today. */
  status: "online" | "out" | "none";
  clockIn: Date | null;
  /** Today's clock-out, or null while they are still in. */
  clockOut: Date | null;
  /** The last time the portal heard from them, ever. */
  lastActive: Date | null;
  /** Time in the portal since Monday, away time taken off. */
  weekMs: number;
  /** Days since Monday they were in at all. */
  weekDays: number;
};

/**
 * Who is in, when they came and went, and how long they were in this week, for everyone the viewer
 * looks after: everyone for admins, direct reports for managers.
 */
export async function getTeamPresence(viewer: { id: string; role: Role }): Promise<PersonPresence[]> {
  const now = new Date();
  const today = companyDay(now);
  const monday = mondayOf(today);

  const people = atLeast(viewer.role, "hr")
    ? (await getPeople()).filter((person) => person.status === "active")
    : (await getDirectReports(viewer.id)).filter((person) => person.status === "active");
  if (people.length === 0) return [];

  const ids = people.map((person) => person.id);
  const [week, latest] = await Promise.all([
    db
      .select()
      .from(attendance)
      .where(and(inArray(attendance.userId, ids), gte(attendance.day, monday))),
    db
      .select({
        userId: attendance.userId,
        lastActive: sql<Date | null>`max(coalesce(${attendance.lastSeenAt}, ${attendance.clockOut}, ${attendance.clockIn}))`.mapWith(
          (value) => (value ? new Date(value) : null),
        ),
      })
      .from(attendance)
      .where(inArray(attendance.userId, ids))
      .groupBy(attendance.userId),
  ]);
  const lastActive = new Map(latest.map((row) => [row.userId, row.lastActive]));

  return people.map((person) => {
    const mine = week.filter((row) => row.userId === person.id);
    const views = mine.map((row) => ({ row, view: presenceView(row, now) }));
    const todays = views.find(({ row }) => row.day === today);

    return {
      id: person.id,
      name: person.name,
      jobTitle: person.jobTitle,
      status: !todays?.row.clockIn ? "none" : todays.view.working ? "online" : "out",
      clockIn: todays?.row.clockIn ?? null,
      clockOut: todays?.view.clockOut ?? null,
      lastActive: lastActive.get(person.id) ?? null,
      weekMs: views.reduce((sum, { view }) => sum + (view.workedMs ?? 0), 0),
      weekDays: views.filter(({ row }) => row.clockIn).length,
    };
  });
}
