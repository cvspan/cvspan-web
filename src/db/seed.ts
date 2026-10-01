/**
 * Seeds a realistic CVSpan organisation.
 * Safe to re-run: it clears the tables it owns first.
 *
 *   npm run db:seed
 */
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { addDays, mondayOf } from "../lib/dates";
import { criterionKeys } from "../lib/grading";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD = "cvspan2026";

/** Days before today, as a date-only string. */
function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function daysAhead(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function monthStart(monthsBack: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsBack);
  return date.toISOString().slice(0, 10);
}

async function main() {
  console.log("Clearing existing data…");
  await db.delete(schema.activityLog);
  await db.delete(schema.notifications);
  await db.delete(schema.approvals);
  await db.delete(schema.applications);
  await db.delete(schema.jobListings);
  await db.delete(schema.blogPosts);
  await db.delete(schema.categories);
  await db.delete(schema.messages);
  await db.delete(schema.threadMembers);
  await db.delete(schema.threads);
  await db.delete(schema.certificates);
  await db.delete(schema.submissions);
  await db.delete(schema.assignments);
  await db.delete(schema.enrolments);
  await db.delete(schema.programmes);
  await db.delete(schema.kpiScores);
  await db.delete(schema.kpiDefinitions);
  await db.delete(schema.leaveRequests);
  await db.delete(schema.attendance);
  await db.delete(schema.reviewRatings);
  await db.delete(schema.weeklyReviews);
  await db.delete(schema.portalActivity);
  await db.delete(schema.tasks);
  await db.delete(schema.projectUpdates);
  await db.delete(schema.milestones);
  await db.delete(schema.projectMembers);
  await db.delete(schema.projects);
  await db.delete(schema.users);
  await db.delete(schema.teams);
  await db.delete(schema.departments);

  console.log("Departments and teams…");
  const departmentRows = await db
    .insert(schema.departments)
    .values([
      /** Same set the website careers page filters by. */
      { name: "Design", slug: "design", description: "Product, brand and visual design across the platform and website." },
      { name: "Development", slug: "development", description: "Engineering for the portal, the website and internal tooling." },
      { name: "Marketing", slug: "marketing", description: "Growth, content and community." },
      { name: "Business Development", slug: "business-development", description: "Partnerships and new programmes." },
      { name: "Project", slug: "project", description: "Delivery of cohorts, programmes and community initiatives." },
      { name: "Management", slug: "management", description: "Operations, people and company leadership." },
    ])
    .returning();

  const dept = Object.fromEntries(departmentRows.map((row) => [row.slug, row.id]));

  const teamRows = await db
    .insert(schema.teams)
    .values([
      { name: "Product Design", departmentId: dept.design },
      { name: "Platform", departmentId: dept.development },
      { name: "Growth", departmentId: dept.marketing },
      { name: "Cohorts", departmentId: dept.project },
      { name: "People Ops", departmentId: dept.management },
    ])
    .returning();

  const team = Object.fromEntries(teamRows.map((row) => [row.name, row.id]));

  console.log("People…");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const seyi = (
    await db
      .insert(schema.users)
      .values({
        email: "seyi@cvspan.com",
        passwordHash,
        name: "Seyi Bankole",
        role: "super_admin",
        orgLevel: "manager",
        employmentType: "full_time",
        status: "active",
        jobTitle: "Chief Operating Officer",
        departmentId: dept.management,
        teamId: team["People Ops"],
        startDate: "2023-01-09",
      })
      .returning()
  )[0];

  const staff = await db
    .insert(schema.users)
    .values([
      { email: "kemi@cvspan.com", passwordHash, name: "Kemi Lawal", role: "admin", orgLevel: "manager", employmentType: "full_time", status: "active", jobTitle: "HR Manager", departmentId: dept.management, teamId: team["People Ops"], managerId: seyi.id, startDate: "2024-06-03" },
      { email: "ada@cvspan.com", passwordHash, name: "Ada Obi", role: "manager", orgLevel: "manager", employmentType: "full_time", status: "active", jobTitle: "Design Lead", departmentId: dept.design, teamId: team["Product Design"], managerId: seyi.id, startDate: "2024-03-11" },
      { email: "tunde@cvspan.com", passwordHash, name: "Tunde Ke", role: "manager", orgLevel: "manager", employmentType: "full_time", status: "active", jobTitle: "Engineering Lead", departmentId: dept.development, teamId: team.Platform, managerId: seyi.id, startDate: "2023-08-21" },
      { email: "ngozi@cvspan.com", passwordHash, name: "Ngozi Uche", role: "manager", orgLevel: "manager", employmentType: "full_time", status: "active", jobTitle: "Marketing Lead", departmentId: dept.marketing, teamId: team.Growth, managerId: seyi.id, startDate: "2024-11-04" },
    ])
    .returning();

  const byEmail = Object.fromEntries(staff.map((row) => [row.email, row]));
  const ada = byEmail["ada@cvspan.com"];
  const tunde = byEmail["tunde@cvspan.com"];
  const ngozi = byEmail["ngozi@cvspan.com"];

  const members = await db
    .insert(schema.users)
    .values([
      { email: "moses@cvspan.com", passwordHash, name: "Moses Arfo", role: "member", employmentType: "full_time", status: "active", jobTitle: "Product Designer", departmentId: dept.design, teamId: team["Product Design"], managerId: ada.id, startDate: "2025-01-13" },
      { email: "chioma@cvspan.com", passwordHash, name: "Chioma Eze", role: "member", employmentType: "internship", status: "active", jobTitle: "Frontend Intern", departmentId: dept.development, teamId: team.Platform, managerId: tunde.id, startDate: "2026-07-06", endDate: "2026-12-12" },
      { email: "bello@cvspan.com", passwordHash, name: "Bello Ibrahim", role: "member", employmentType: "part_time", status: "active", jobTitle: "Content Writer", departmentId: dept.marketing, teamId: team.Growth, managerId: ngozi.id, startDate: "2026-02-02" },
      { email: "femi@cvspan.com", passwordHash, name: "Femi Adeyemi", role: "member", employmentType: "volunteer", status: "active", jobTitle: "Community Volunteer", departmentId: dept.project, teamId: team.Cohorts, managerId: ngozi.id, startDate: "2026-05-18" },
      { email: "grace@cvspan.com", passwordHash, name: "Grace Peters", role: "member", employmentType: "student", status: "active", jobTitle: "Data Student", departmentId: dept.project, teamId: team.Cohorts, managerId: tunde.id, startDate: "2026-09-01" },
      { email: "daniel@cvspan.com", passwordHash, name: "Daniel Okoro", role: "member", employmentType: "internship", status: "invited", jobTitle: "Backend Intern", departmentId: dept.development, teamId: team.Platform, managerId: tunde.id, startDate: "2026-10-05" },
      { email: "amaka@cvspan.com", passwordHash, name: "Amaka Nwosu", role: "member", employmentType: "internship", status: "alumni", jobTitle: "Design Intern", departmentId: dept.design, teamId: team["Product Design"], managerId: ada.id, startDate: "2026-02-10", endDate: "2026-08-28" },
    ])
    .returning();

  const person = Object.fromEntries(
    [seyi, ...staff, ...members].map((row) => [row.email.split("@")[0], row]),
  );

  console.log("Department heads…");
  const headOf: [string, string][] = [
    [dept.design, ada.id],
    [dept.development, tunde.id],
    [dept.marketing, ngozi.id],
    [dept.management, seyi.id],
  ];
  for (const [departmentId, headId] of headOf) {
    await db.update(schema.departments).set({ headId }).where(eq(schema.departments.id, departmentId));
  }

  console.log("Projects…");
  const projectRows = await db
    .insert(schema.projects)
    .values([
      { name: "Portal Platform", code: "PLT", description: "The CVSpan staff portal: people, tasks, KPIs, attendance and the website back office.", status: "development", links: [{ name: "Figma", url: "https://www.figma.com/" }, { name: "Repository", url: "https://github.com/" }], departmentId: dept.development, startDate: daysAgo(60), targetDate: daysAgo(-45), createdById: seyi.id },
      { name: "Website Relaunch", code: "WEB", description: "Rebuild the public site with a managed blog and careers section.", status: "design", links: [{ name: "Figma", url: "https://www.figma.com/" }], departmentId: dept.marketing, startDate: daysAgo(30), targetDate: daysAgo(-30), createdById: seyi.id },
      { name: "Cohort 5 Programme", code: "COH", description: "Curriculum, mentors and kick-off for the next student cohort.", status: "planning", departmentId: dept.project, startDate: daysAgo(20), targetDate: daysAgo(-40), createdById: seyi.id },
      { name: "Staff Onboarding & Performance", code: "OPS", description: "Onboarding checklist, weekly KPI self-assessments and attendance reporting.", status: "development", departmentId: dept.management, startDate: daysAgo(90), targetDate: daysAgo(-15), createdById: seyi.id },
      { name: "Brand Refresh", code: "BRD", description: "Colour, type and logo refresh across product and marketing.", status: "live", departmentId: dept.design, startDate: daysAgo(120), targetDate: daysAgo(30), completedAt: daysAhead(-28), createdById: seyi.id },
      { name: "Mobile App", code: "MOB", description: "Companion mobile app for clock-in, tasks and messages.", status: "not_started", departmentId: dept.development, startDate: daysAgo(-20), targetDate: daysAgo(-120), createdById: seyi.id },
    ])
    .returning();
  const project = Object.fromEntries(projectRows.map((row) => [row.code, row.id]));

  await db.insert(schema.projectMembers).values([
    { projectId: project.PLT, userId: tunde.id, role: "lead" },
    { projectId: project.PLT, userId: person.chioma.id, role: "contributor" },
    { projectId: project.PLT, userId: person.moses.id, role: "contributor" },
    { projectId: project.PLT, userId: ada.id, role: "reviewer" },

    { projectId: project.WEB, userId: ngozi.id, role: "lead" },
    { projectId: project.WEB, userId: person.bello.id, role: "contributor" },
    { projectId: project.WEB, userId: person.moses.id, role: "contributor" },
    { projectId: project.WEB, userId: ada.id, role: "reviewer" },

    { projectId: project.COH, userId: person.kemi.id, role: "lead" },
    { projectId: project.COH, userId: person.femi.id, role: "contributor" },
    { projectId: project.COH, userId: person.grace.id, role: "contributor" },
    { projectId: project.COH, userId: person.chioma.id, role: "contributor" },

    { projectId: project.OPS, userId: seyi.id, role: "lead" },
    { projectId: project.OPS, userId: person.kemi.id, role: "contributor" },
    { projectId: project.OPS, userId: person.moses.id, role: "contributor" },

    { projectId: project.BRD, userId: ada.id, role: "lead" },
    { projectId: project.BRD, userId: person.moses.id, role: "contributor" },

    { projectId: project.MOB, userId: tunde.id, role: "lead" },
  ]);

  const milestoneRows = await db
    .insert(schema.milestones)
    .values([
      { projectId: project.PLT, title: "Discovery and requirements", startDate: daysAgo(60), dueDate: daysAgo(40), status: "done", completedAt: daysAhead(-40) },
      { projectId: project.PLT, title: "Core modules: auth, people, tasks", startDate: daysAgo(40), dueDate: daysAgo(10), status: "done", completedAt: daysAhead(-10) },
      { projectId: project.PLT, title: "Dashboards and KPIs", startDate: daysAgo(12), dueDate: daysAgo(-10), status: "in_progress" },
      { projectId: project.PLT, title: "Staff beta", startDate: daysAgo(-10), dueDate: daysAgo(-30), status: "not_started" },
      { projectId: project.PLT, title: "Launch", dueDate: daysAgo(-45), status: "not_started" },

      { projectId: project.WEB, title: "Content audit", startDate: daysAgo(30), dueDate: daysAgo(18), status: "done", completedAt: daysAhead(-18) },
      { projectId: project.WEB, title: "Copy sign-off", startDate: daysAgo(18), dueDate: daysAgo(3), status: "in_progress" },
      { projectId: project.WEB, title: "Blog and careers sections", startDate: daysAgo(3), dueDate: daysAgo(-18), status: "not_started" },
      { projectId: project.WEB, title: "Go live", dueDate: daysAgo(-30), status: "not_started" },

      { projectId: project.COH, title: "Curriculum draft", startDate: daysAgo(20), dueDate: daysAgo(-14), status: "in_progress" },
      { projectId: project.COH, title: "Recruit mentors", startDate: daysAgo(-5), dueDate: daysAgo(-25), status: "not_started" },
      { projectId: project.COH, title: "Cohort kick-off", dueDate: daysAgo(-40), status: "not_started" },

      { projectId: project.OPS, title: "Onboarding checklist live", startDate: daysAgo(90), dueDate: daysAgo(30), status: "done", completedAt: daysAhead(-30) },
      { projectId: project.OPS, title: "KPI self-assessment rollout", startDate: daysAgo(30), dueDate: daysAgo(5), status: "in_progress" },
      { projectId: project.OPS, title: "Attendance reporting", startDate: daysAgo(5), dueDate: daysAgo(-15), status: "not_started" },

      { projectId: project.BRD, title: "Colour and type", startDate: daysAgo(120), dueDate: daysAgo(70), status: "done", completedAt: daysAhead(-70) },
      { projectId: project.BRD, title: "Logo and rollout", startDate: daysAgo(70), dueDate: daysAgo(30), status: "done", completedAt: daysAhead(-29) },

      { projectId: project.MOB, title: "Scope and budget", startDate: daysAgo(-20), dueDate: daysAgo(-40), status: "not_started" },
    ])
    .returning();
  const milestone = Object.fromEntries(milestoneRows.map((row) => [`${row.projectId}:${row.title}`, row.id]));
  const ms = (code: string, title: string) => milestone[`${project[code]}:${title}`];

  console.log("Tasks…");
  await db.insert(schema.tasks).values([
    /* Portal Platform */
    { title: "Set up authentication and roles", projectId: project.PLT, milestoneId: ms("PLT", "Core modules: auth, people, tasks"), assigneeId: tunde.id, createdById: tunde.id, status: "done", priority: "high", dueAt: daysAhead(-30), completedAt: daysAhead(-31) },
    { title: "Build the people directory", projectId: project.PLT, milestoneId: ms("PLT", "Core modules: auth, people, tasks"), assigneeId: person.chioma.id, createdById: tunde.id, teamId: team.Platform, status: "done", priority: "normal", dueAt: daysAhead(-14), completedAt: daysAhead(-15) },
    { title: "Task assignment and deadlines", projectId: project.PLT, milestoneId: ms("PLT", "Core modules: auth, people, tasks"), assigneeId: tunde.id, createdById: tunde.id, status: "done", priority: "high", dueAt: daysAhead(-12), completedAt: daysAhead(-12) },
    { title: "Design the dashboard layouts", projectId: project.PLT, milestoneId: ms("PLT", "Discovery and requirements"), assigneeId: person.moses.id, createdById: ada.id, teamId: team["Product Design"], status: "done", priority: "normal", dueAt: daysAhead(-38), completedAt: daysAhead(-39) },
    { title: "Review dashboard designs", projectId: project.PLT, milestoneId: ms("PLT", "Dashboards and KPIs"), assigneeId: ada.id, createdById: tunde.id, status: "done", priority: "low", dueAt: daysAhead(-6), completedAt: daysAhead(-7) },
    { title: "Fix mobile nav overlap on dashboard", projectId: project.PLT, milestoneId: ms("PLT", "Dashboards and KPIs"), assigneeId: person.chioma.id, createdById: tunde.id, teamId: team.Platform, status: "in_progress", priority: "high", dueAt: daysAhead(2) },
    { title: "KPI trend charts", projectId: project.PLT, milestoneId: ms("PLT", "Dashboards and KPIs"), assigneeId: tunde.id, createdById: tunde.id, status: "todo", priority: "normal", dueAt: daysAhead(7) },
    { title: "Write staff beta guide", projectId: project.PLT, milestoneId: ms("PLT", "Staff beta"), assigneeId: person.moses.id, createdById: tunde.id, status: "todo", priority: "low", dueAt: daysAhead(18) },

    /* Website Relaunch */
    { title: "Review 3 blog drafts for the website", projectId: project.WEB, milestoneId: ms("WEB", "Copy sign-off"), assigneeId: person.moses.id, createdById: ngozi.id, teamId: team["Product Design"], status: "in_progress", priority: "normal", dueAt: daysAhead(3) },
    { title: "Publish October careers page update", projectId: project.WEB, milestoneId: ms("WEB", "Blog and careers sections"), assigneeId: person.bello.id, createdById: ngozi.id, teamId: team.Growth, status: "todo", priority: "normal", dueAt: daysAhead(9) },
    { title: "Audit existing pages and redirects", projectId: project.WEB, milestoneId: ms("WEB", "Content audit"), assigneeId: person.bello.id, createdById: ngozi.id, status: "done", priority: "normal", dueAt: daysAhead(-20), completedAt: daysAhead(-21) },
    { title: "Rewrite the about page", projectId: project.WEB, milestoneId: ms("WEB", "Copy sign-off"), assigneeId: person.bello.id, createdById: ngozi.id, status: "todo", priority: "high", dueAt: daysAhead(-2) },
    { title: "Design careers listing cards", projectId: project.WEB, milestoneId: ms("WEB", "Blog and careers sections"), assigneeId: person.moses.id, createdById: ngozi.id, status: "todo", priority: "normal", dueAt: daysAhead(12) },

    /* Cohort 5 */
    { title: "Draft cohort 5 curriculum", projectId: project.COH, milestoneId: ms("COH", "Curriculum draft"), assigneeId: person.femi.id, createdById: person.kemi.id, teamId: team.Cohorts, status: "todo", priority: "normal", dueAt: daysAhead(14) },
    { title: "Weekly data lab write-up", projectId: project.COH, milestoneId: ms("COH", "Curriculum draft"), assigneeId: person.grace.id, createdById: tunde.id, teamId: team.Cohorts, status: "in_progress", priority: "normal", dueAt: daysAhead(4) },
    { title: "Prepare intern induction deck", projectId: project.COH, milestoneId: ms("COH", "Cohort kick-off"), assigneeId: person.chioma.id, createdById: tunde.id, teamId: team.Platform, status: "todo", priority: "high", dueAt: daysAhead(8) },

    /* Staff Onboarding & Performance */
    { title: "Submit weekly KPI self-assessment", projectId: project.OPS, milestoneId: ms("OPS", "KPI self-assessment rollout"), assigneeId: person.moses.id, createdById: ada.id, teamId: team["Product Design"], status: "todo", priority: "high", dueAt: daysAhead(-1) },
    { title: "Finish onboarding checklist", projectId: project.OPS, milestoneId: ms("OPS", "Onboarding checklist live"), assigneeId: person.moses.id, createdById: ada.id, teamId: team["Product Design"], status: "in_progress", priority: "normal", dueAt: daysAhead(3) },
    { title: "Upload September attendance notes", projectId: project.OPS, milestoneId: ms("OPS", "Attendance reporting"), assigneeId: person.moses.id, createdById: person.kemi.id, status: "todo", priority: "low", dueAt: daysAhead(6) },
    { title: "Team retro notes", projectId: project.OPS, assigneeId: person.moses.id, createdById: ada.id, status: "done", priority: "low", dueAt: daysAhead(-4), completedAt: daysAhead(-4) },

    /* Brand Refresh (finished) */
    { title: "Final logo files", projectId: project.BRD, milestoneId: ms("BRD", "Logo and rollout"), assigneeId: person.moses.id, createdById: ada.id, status: "done", priority: "normal", dueAt: daysAhead(-32), completedAt: daysAhead(-33) },
    { title: "Brand guidelines document", projectId: project.BRD, milestoneId: ms("BRD", "Colour and type"), assigneeId: ada.id, createdById: ada.id, status: "done", priority: "normal", dueAt: daysAhead(-70), completedAt: daysAhead(-71) },
  ]);

  await db.insert(schema.projectUpdates).values([
    { projectId: project.PLT, authorId: tunde.id, health: "on_track", body: "Core modules shipped. Dashboards and KPI charts are under way; the mobile nav bug is the only open blocker and is being fixed this week." },
    { projectId: project.WEB, authorId: ngozi.id, health: "at_risk", body: "Copy sign-off has slipped three days waiting on the about page rewrite. Careers and blog sections can start in parallel, but go-live is tight." },
    { projectId: project.OPS, authorId: seyi.id, health: "off_track", body: "Only the onboarding checklist is complete. KPI self-assessments are overdue for most of the team, which blocks the attendance reporting phase." },
    { projectId: project.BRD, authorId: ada.id, health: "on_track", body: "Brand refresh delivered and rolled out across product and website." },
  ]);

  console.log("Weekly reviews and logins…");
  const thisMonday = mondayOf(new Date().toISOString().slice(0, 10));

  /** Ratings per week, in criterion order: meetings, availability, tasks, daily login. */
  const reviewPlans = [
    { who: person.chioma, by: tunde, weeks: [[3, 4, 3, 3], [3, 4, 4, 4], [4, 4, 4, 4], [4, 5, 4, 4], [4, 5, 5, 4]], note: "Growing in confidence. Keep tasks updated in the portal." },
    { who: person.grace, by: tunde, weeks: [[4, 4, 4, 5], [4, 5, 4, 5], [5, 5, 4, 5]], note: "Consistent and well prepared." },
    { who: person.moses, by: ada, weeks: [[4, 5, 4, 5], [5, 5, 4, 5], [4, 5, 5, 5], [5, 5, 5, 5]], note: "Reliable, and shipping early." },
    { who: ada, by: seyi, weeks: [[5, 4, 5, 4], [5, 5, 5, 5]], note: "Leads from the front." },
  ];

  for (const plan of reviewPlans) {
    const count = plan.weeks.length;
    const reviews = await db
      .insert(schema.weeklyReviews)
      .values(
        plan.weeks.map((_, index) => ({
          userId: plan.who.id,
          reviewerId: plan.by.id,
          weekStart: addDays(thisMonday, -7 * (count - index)),
          comment: index === count - 1 ? plan.note : null,
        })),
      )
      .returning();

    await db.insert(schema.reviewRatings).values(
      reviews.flatMap((review, index) =>
        criterionKeys.map((criterion, position) => ({
          reviewId: review.id,
          criterion,
          rating: plan.weeks[index][position],
        })),
      ),
    );
  }

  /** Portal logins for the last two working weeks, with a few gaps. */
  const loginRows: { userId: string; day: string }[] = [];
  for (const [index, member] of [person.chioma, person.moses, person.grace, person.bello, tunde, ada].entries()) {
    for (let back = 0; back < 14; back++) {
      const day = addDays(new Date().toISOString().slice(0, 10), -back);
      const weekday = (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
      if (weekday > 4 || (back + index) % 7 === 3) continue;
      loginRows.push({ userId: member.id, day });
    }
  }
  await db.insert(schema.portalActivity).values(loginRows);

  console.log("Attendance and leave…");
  const attendanceRows: (typeof schema.attendance.$inferInsert)[] = [];
  const workers = [person.moses, person.chioma, person.bello, person.grace];
  for (const worker of workers) {
    for (let back = 0; back < 21; back++) {
      const day = new Date();
      day.setDate(day.getDate() - back);
      const weekday = day.getDay();
      if (weekday === 0 || weekday === 6) continue;
      const roll = (back + worker.name.length) % 10;
      const kind = roll === 7 ? "leave" : roll === 9 ? "absent" : roll % 3 === 0 ? "remote" : "on_site";
      const clockIn = new Date(day);
      clockIn.setHours(8, 45 + (roll % 20), 0, 0);
      const clockOut = new Date(day);
      clockOut.setHours(17, 10 + (roll % 30), 0, 0);
      attendanceRows.push({
        userId: worker.id,
        day: day.toISOString().slice(0, 10),
        kind,
        clockIn: kind === "leave" || kind === "absent" ? null : clockIn,
        clockOut: kind === "leave" || kind === "absent" || back === 0 ? null : clockOut,
      });
    }
  }
  await db.insert(schema.attendance).values(attendanceRows);

  const leaveRows = await db
    .insert(schema.leaveRequests)
    .values([
      { userId: person.moses.id, type: "Annual leave", startDate: daysAgo(-10), endDate: daysAgo(-10), days: 1, status: "approved", decidedById: ada.id },
      { userId: person.chioma.id, type: "Study leave", startDate: daysAgo(-13), endDate: daysAgo(-14), days: 2, status: "pending" },
      { userId: person.bello.id, type: "Sick leave", startDate: daysAgo(8), endDate: daysAgo(8), days: 1, status: "approved", decidedById: ngozi.id },
      { userId: person.femi.id, type: "Unpaid leave", startDate: daysAgo(-20), endDate: daysAgo(-24), days: 5, status: "pending" },
    ])
    .returning();

  console.log("KPIs…");
  const definitions = await db
    .insert(schema.kpiDefinitions)
    .values([
      { name: "Delivery — work shipped on time", weight: 30, teamId: team["Product Design"] },
      { name: "Quality — rework and review notes", weight: 25, teamId: team["Product Design"] },
      { name: "Collaboration — reviews and support", weight: 20, teamId: team["Product Design"] },
      { name: "Initiative — improvements proposed", weight: 15, teamId: team["Product Design"] },
      { name: "Attendance and timeliness", weight: 10, teamId: team["Product Design"] },
    ])
    .returning();

  const scoreRows: (typeof schema.kpiScores.$inferInsert)[] = [];
  const trend: Record<string, number[]> = {
    moses: [64, 70, 68, 75, 79, 82],
    chioma: [58, 62, 66, 70, 72, 74],
    bello: [70, 72, 75, 74, 78, 79],
    grace: [55, 60, 63, 65, 66, 68],
  };
  for (const [key, scores] of Object.entries(trend)) {
    scores.forEach((score, index) => {
      scoreRows.push({
        userId: person[key].id,
        definitionId: definitions[0].id,
        gradedById: person[key].managerId ?? ada.id,
        periodStart: monthStart(5 - index),
        score,
        comment: index === scores.length - 1 ? "Strong handover work this cycle." : null,
      });
    });
  }
  await db.insert(schema.kpiScores).values(scoreRows);

  console.log("Programmes…");
  const programmeRows = await db
    .insert(schema.programmes)
    .values([
      { name: "Design Internship — Cohort 4", stage: "Mid-programme", startDate: "2026-07-06", endDate: "2026-12-12" },
      { name: "Engineering Internship — Cohort 4", stage: "Mid-programme", startDate: "2026-07-06", endDate: "2026-12-12" },
      { name: "Data Students — Autumn", stage: "Onboarding", startDate: "2026-09-01", endDate: "2027-02-20" },
    ])
    .returning();

  await db.insert(schema.enrolments).values([
    { programmeId: programmeRows[0].id, userId: person.amaka.id, progress: 100, completedAt: new Date("2026-08-28") },
    { programmeId: programmeRows[1].id, userId: person.chioma.id, progress: 64 },
    { programmeId: programmeRows[2].id, userId: person.grace.id, progress: 18 },
  ]);

  const assignmentRows = await db
    .insert(schema.assignments)
    .values([
      { programmeId: programmeRows[1].id, title: "Week 1 — Design principles", weekNumber: 1, dueAt: daysAhead(-25) },
      { programmeId: programmeRows[1].id, title: "Week 2 — Component audit", weekNumber: 2, dueAt: daysAhead(-18) },
      { programmeId: programmeRows[1].id, title: "Week 3 — Token system", weekNumber: 3, dueAt: daysAhead(-11) },
      { programmeId: programmeRows[1].id, title: "Week 4 — Dashboard concept", weekNumber: 4, dueAt: daysAhead(3) },
      { programmeId: programmeRows[1].id, title: "Mid-programme review", weekNumber: 5, dueAt: daysAhead(15) },
    ])
    .returning();

  await db.insert(schema.submissions).values([
    { assignmentId: assignmentRows[0].id, userId: person.chioma.id, status: "graded", grade: 90, gradedById: tunde.id, submittedAt: daysAhead(-25), feedback: "Clear and well argued." },
    { assignmentId: assignmentRows[1].id, userId: person.chioma.id, status: "graded", grade: 80, gradedById: tunde.id, submittedAt: daysAhead(-18) },
    { assignmentId: assignmentRows[2].id, userId: person.chioma.id, status: "graded", grade: 84, gradedById: tunde.id, submittedAt: daysAhead(-11) },
    { assignmentId: assignmentRows[3].id, userId: person.chioma.id, status: "submitted", submittedAt: daysAhead(-1) },
    { assignmentId: assignmentRows[4].id, userId: person.chioma.id, status: "not_started" },
  ]);

  await db.insert(schema.certificates).values([
    { userId: person.amaka.id, programmeId: programmeRows[0].id, reference: "CVS-2026-0184", issuedAt: new Date("2026-08-28") },
  ]);

  console.log("Messages…");
  const [directThread, groupThread] = await db
    .insert(schema.threads)
    .values([{ name: null }, { name: "Design team" }])
    .returning();

  await db.insert(schema.threadMembers).values([
    { threadId: directThread.id, userId: person.moses.id },
    { threadId: directThread.id, userId: ada.id },
    { threadId: groupThread.id, userId: person.moses.id },
    { threadId: groupThread.id, userId: ada.id },
    { threadId: groupThread.id, userId: tunde.id },
  ]);

  const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

  await db.insert(schema.messages).values([
    { threadId: directThread.id, senderId: ada.id, body: "Morning Moses — can you share the design system handover file before Friday?", createdAt: minutesAgo(180) },
    { threadId: directThread.id, senderId: person.moses.id, body: "Morning! Yes, I'm finishing the token documentation today.", createdAt: minutesAgo(174) },
    { threadId: directThread.id, senderId: ada.id, body: "Perfect. Add the dark mode notes too, the engineering team asked about it.", createdAt: minutesAgo(171) },
    { threadId: groupThread.id, senderId: tunde.id, body: "The new tokens are live in the portal.", createdAt: minutesAgo(90) },
  ]);

  console.log("Website…");
  const categoryRows = await db
    .insert(schema.categories)
    .values([
      { name: "Culture", slug: "culture" },
      { name: "Ways of working", slug: "ways-of-working" },
      { name: "Design", slug: "design" },
      { name: "Programmes", slug: "programmes" },
    ])
    .returning();
  const category = Object.fromEntries(categoryRows.map((row) => [row.slug, row.id]));
  const posts = await db
    .insert(schema.blogPosts)
    .values([
    {
      title: "Inside our internship programme",
      slug: "inside-our-internship-programme",
      categoryId: category.culture,
      tags: ["internships", "hiring"],
      coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
      coverAlt: "Team working together around a table",
      authorId: person.bello.id,
      status: "in_review",
      readingMinutes: 4,
      excerpt: "What six months at CVSpan actually looks like, from first week to final project.",
      body: "<p>Six months is long enough to build something real, and short enough that every week counts.</p><h2>Week one</h2><p>Interns are paired with a lead on day one and given a task that ships.</p>",
    },
    {
      title: "How we run weekly KPI check-ins",
      slug: "weekly-kpi-check-ins",
      categoryId: category["ways-of-working"],
      tags: ["performance", "management"],
      authorId: ada.id,
      status: "scheduled",
      publishAt: daysAhead(4),
      readingMinutes: 3,
      excerpt: "A score on its own means nothing. The conversation around it is the point.",
      body: "<p>Every Friday, each lead grades their team against five measures.</p><h2>What we grade</h2><ul><li>Delivery</li><li>Quality</li><li>Collaboration</li></ul>",
    },
    {
      title: "Design tokens at CVSpan",
      slug: "design-tokens-at-cvspan",
      categoryId: category.design,
      tags: ["design systems", "figma"],
      authorId: person.moses.id,
      status: "draft",
      readingMinutes: 5,
      excerpt: "Two layers: raw palette, then semantic tokens that flip with the theme.",
      body: "<p>Our colours live in two layers, and only one of them is allowed in a component.</p>",
    },
    {
      title: "Meet the Autumn data cohort",
      slug: "meet-the-autumn-data-cohort",
      categoryId: category.programmes,
      tags: ["programmes", "data"],
      coverImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200",
      coverAlt: "Students at laptops in a bright room",
      authorId: ngozi.id,
      status: "published",
      publishAt: daysAhead(-8),
      readingMinutes: 2,
      excerpt: "Twelve students joined us in September. Here is what they are working on.",
      body: "<p>Twelve students joined the Autumn cohort, spread across analytics and engineering.</p>",
    },
    ])
    .returning();

  const postInReview = posts.find((post) => post.status === "in_review");

  const jobs = await db
    .insert(schema.jobListings)
    .values([
      {
        title: "Senior Frontend Engineer",
        slug: "senior-frontend-engineer",
        departmentId: dept.development,
        employmentType: "full_time",
        seniority: "senior",
        summary: "Own the interface layer of the CVSpan portal and website.",
        description:
          "<h2>About the role</h2><p>You will own the front end of the portal our whole team uses every day.</p><h2>What you'll do</h2><ul><li>Build product surfaces in Next.js and TypeScript</li><li>Keep the design system honest</li></ul><h2>What we're looking for</h2><ul><li>Five years building production React</li><li>Care about accessibility</li></ul>",
        location: "Lagos, Nigeria",
        workMode: "hybrid",
        experience: "5+ years",
        language: "English",
        openings: 1,
        skills: ["React", "TypeScript", "Next.js", "CSS"],
        salaryMin: 650000,
        salaryMax: 900000,
        salaryCurrency: "NGN",
        salaryPeriod: "month",
        salaryPublic: true,
        hiringManagerId: tunde.id,
        applyMethod: "portal",
        closingDate: daysAgo(-21),
        stage: "interviewing",
        postedAt: daysAhead(-18),
      },
      {
        title: "Product Designer",
        slug: "product-designer",
        departmentId: dept.design,
        employmentType: "full_time",
        seniority: "mid",
        summary: "Design the surfaces our members, managers and students use daily.",
        description:
          "<h2>About the role</h2><p>You will shape how the portal feels to use.</p><h2>What you'll do</h2><ul><li>Take problems from research through to shipped design</li><li>Extend the CVSpan design system</li></ul>",
        location: "Lagos, Nigeria",
        workMode: "hybrid",
        experience: "3–5 years",
        language: "English",
        openings: 1,
        skills: ["Figma", "Design systems", "Prototyping"],
        salaryMin: 450000,
        salaryMax: 600000,
        salaryCurrency: "NGN",
        salaryPeriod: "month",
        salaryPublic: true,
        hiringManagerId: ada.id,
        applyMethod: "portal",
        closingDate: daysAgo(-14),
        stage: "screening",
        postedAt: daysAhead(-12),
      },
      {
        title: "Marketing Intern",
        slug: "marketing-intern",
        departmentId: dept.marketing,
        employmentType: "internship",
        seniority: "intern",
        summary: "Six months learning content and community work with our marketing team.",
        description:
          "<h2>About the role</h2><p>A six month internship with real ownership from week one.</p>",
        location: "Remote Worldwide",
        workMode: "remote",
        experience: "1–2 years",
        language: "English",
        openings: 2,
        skills: ["Writing", "Social media"],
        salaryMin: 150000,
        salaryCurrency: "NGN",
        salaryPeriod: "month",
        salaryPublic: false,
        hiringManagerId: ngozi.id,
        applyMethod: "email",
        applyValue: "jobs@cvspan.com",
        closingDate: daysAgo(-7),
        stage: "open",
        postedAt: daysAhead(-6),
      },
      {
        title: "Community Volunteer",
        slug: "community-volunteer",
        departmentId: dept.project,
        employmentType: "volunteer",
        seniority: "junior",
        summary: "Help run cohort events and keep our community active.",
        description: "<h2>About the role</h2><p>A few hours a week supporting our programmes.</p>",
        location: "Lagos, Nigeria",
        workMode: "on_site",
        experience: "No experience needed",
        language: "English",
        openings: 3,
        skills: ["Events", "Community"],
        salaryCurrency: "NGN",
        salaryPeriod: "month",
        salaryPublic: false,
        applyMethod: "portal",
        stage: "draft",
      },
    ])
    .returning();

  await db.insert(schema.applications).values([
    { jobId: jobs[0].id, candidateName: "Ifeanyi Obi", candidateEmail: "ifeanyi@example.com", stage: "interview" },
    { jobId: jobs[0].id, candidateName: "Rita Danjuma", candidateEmail: "rita@example.com", stage: "offer" },
    { jobId: jobs[0].id, candidateName: "Sam Ade", candidateEmail: "sam@example.com", stage: "screening" },
    { jobId: jobs[1].id, candidateName: "Blessing Nwachukwu", candidateEmail: "blessing@example.com", stage: "screening" },
    { jobId: jobs[1].id, candidateName: "Tobi Alabi", candidateEmail: "tobi@example.com", stage: "applied" },
    { jobId: jobs[2].id, candidateName: "Ruth Eze", candidateEmail: "ruth@example.com", stage: "applied" },
    { jobId: jobs[2].id, candidateName: "Musa Bala", candidateEmail: "musa@example.com", stage: "applied" },
    { jobId: jobs[0].id, candidateName: "Peace John", candidateEmail: "peace@example.com", stage: "hired" },
  ]);

  console.log("Approvals, notifications and activity…");
  await db.insert(schema.approvals).values([
    { kind: "leave", subjectId: leaveRows[1].id, requestedById: person.chioma.id, assignedToId: tunde.id, detail: "Study leave, 2 days" },
    { kind: "leave", subjectId: leaveRows[3].id, requestedById: person.femi.id, assignedToId: ngozi.id, detail: "Unpaid leave, 5 days" },
    { kind: "timesheet", requestedById: person.bello.id, assignedToId: ngozi.id, detail: "Week 39, 18 hours" },
    { kind: "blog_post", subjectId: postInReview?.id, requestedById: person.bello.id, assignedToId: person.kemi.id, detail: `“${postInReview?.title}”` },
  ]);

  await db.insert(schema.notifications).values([
    { userId: person.moses.id, title: "Ada Obi assigned you “Review blog drafts”", href: "/tasks" },
    { userId: person.moses.id, title: "Tunde Ke graded your week 38 KPI: 4.2 / 5", href: "/kpis" },
    { userId: person.moses.id, title: "HR published the October holiday calendar", href: "/attendance" },
    { userId: person.chioma.id, title: "Your week 3 assignment was graded", href: "/programmes" },
  ]);

  await db.insert(schema.activityLog).values([
    { actorId: ada.id, action: "assigned a task to Moses Arfo", subject: "Review blog drafts" },
    { actorId: tunde.id, action: "graded a KPI cycle", subject: "Week 38 · Moses Arfo" },
    { actorId: person.kemi.id, action: "published the holiday calendar", subject: "October 2026" },
    { actorId: ngozi.id, action: "moved an applicant to Offer", subject: "Senior Frontend Engineer" },
    { actorId: seyi.id, action: "approved leave", subject: "Moses Arfo · 10 Oct" },
  ]);

  console.log(`\nSeeded. Demo sign-in password for every account: ${DEMO_PASSWORD}`);
  console.log("  seyi@cvspan.com   — super admin");
  console.log("  kemi@cvspan.com   — admin / HR");
  console.log("  ada@cvspan.com    — manager");
  console.log("  moses@cvspan.com  — member");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
