/**
 * Seeds a realistic CVSpan organisation.
 * Safe to re-run: it clears the tables it owns first.
 *
 *   npm run db:seed
 */
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
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
  await db.delete(schema.tasks);
  await db.delete(schema.users);
  await db.delete(schema.teams);
  await db.delete(schema.departments);

  console.log("Departments and teams…");
  const departmentRows = await db
    .insert(schema.departments)
    .values([
      { name: "Design", slug: "design" },
      { name: "Engineering", slug: "engineering" },
      { name: "Marketing", slug: "marketing" },
      { name: "Programmes", slug: "programmes" },
      { name: "Operations", slug: "operations" },
    ])
    .returning();

  const dept = Object.fromEntries(departmentRows.map((row) => [row.slug, row.id]));

  const teamRows = await db
    .insert(schema.teams)
    .values([
      { name: "Product Design", departmentId: dept.design },
      { name: "Platform", departmentId: dept.engineering },
      { name: "Growth", departmentId: dept.marketing },
      { name: "Cohorts", departmentId: dept.programmes },
      { name: "People Ops", departmentId: dept.operations },
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
        employmentType: "full_time",
        status: "active",
        jobTitle: "Chief Operating Officer",
        departmentId: dept.operations,
        teamId: team["People Ops"],
        startDate: "2023-01-09",
      })
      .returning()
  )[0];

  const staff = await db
    .insert(schema.users)
    .values([
      { email: "kemi@cvspan.com", passwordHash, name: "Kemi Lawal", role: "admin", employmentType: "full_time", status: "active", jobTitle: "HR Manager", departmentId: dept.operations, teamId: team["People Ops"], managerId: seyi.id, startDate: "2024-06-03" },
      { email: "ada@cvspan.com", passwordHash, name: "Ada Obi", role: "manager", employmentType: "full_time", status: "active", jobTitle: "Design Lead", departmentId: dept.design, teamId: team["Product Design"], managerId: seyi.id, startDate: "2024-03-11" },
      { email: "tunde@cvspan.com", passwordHash, name: "Tunde Ke", role: "manager", employmentType: "full_time", status: "active", jobTitle: "Engineering Lead", departmentId: dept.engineering, teamId: team.Platform, managerId: seyi.id, startDate: "2023-08-21" },
      { email: "ngozi@cvspan.com", passwordHash, name: "Ngozi Uche", role: "manager", employmentType: "full_time", status: "active", jobTitle: "Marketing Lead", departmentId: dept.marketing, teamId: team.Growth, managerId: seyi.id, startDate: "2024-11-04" },
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
      { email: "chioma@cvspan.com", passwordHash, name: "Chioma Eze", role: "member", employmentType: "internship", status: "active", jobTitle: "Frontend Intern", departmentId: dept.engineering, teamId: team.Platform, managerId: tunde.id, startDate: "2026-07-06", endDate: "2026-12-12" },
      { email: "bello@cvspan.com", passwordHash, name: "Bello Ibrahim", role: "member", employmentType: "part_time", status: "active", jobTitle: "Content Writer", departmentId: dept.marketing, teamId: team.Growth, managerId: ngozi.id, startDate: "2026-02-02" },
      { email: "femi@cvspan.com", passwordHash, name: "Femi Adeyemi", role: "member", employmentType: "volunteer", status: "active", jobTitle: "Community Volunteer", departmentId: dept.programmes, teamId: team.Cohorts, managerId: ngozi.id, startDate: "2026-05-18" },
      { email: "grace@cvspan.com", passwordHash, name: "Grace Peters", role: "member", employmentType: "student", status: "active", jobTitle: "Data Student", departmentId: dept.programmes, teamId: team.Cohorts, managerId: tunde.id, startDate: "2026-09-01" },
      { email: "daniel@cvspan.com", passwordHash, name: "Daniel Okoro", role: "member", employmentType: "internship", status: "invited", jobTitle: "Backend Intern", departmentId: dept.engineering, teamId: team.Platform, managerId: tunde.id, startDate: "2026-10-05" },
      { email: "amaka@cvspan.com", passwordHash, name: "Amaka Nwosu", role: "member", employmentType: "internship", status: "alumni", jobTitle: "Design Intern", departmentId: dept.design, teamId: team["Product Design"], managerId: ada.id, startDate: "2026-02-10", endDate: "2026-08-28" },
    ])
    .returning();

  const person = Object.fromEntries(
    [seyi, ...staff, ...members].map((row) => [row.email.split("@")[0], row]),
  );

  console.log("Tasks…");
  await db.insert(schema.tasks).values([
    { title: "Submit weekly KPI self-assessment", project: "Performance", assigneeId: person.moses.id, createdById: ada.id, teamId: team["Product Design"], status: "todo", priority: "high", dueAt: daysAhead(-1) },
    { title: "Finish onboarding checklist", project: "Onboarding", assigneeId: person.moses.id, createdById: ada.id, teamId: team["Product Design"], status: "in_progress", priority: "normal", dueAt: daysAhead(3) },
    { title: "Review 3 blog drafts for the website", project: "Website", assigneeId: person.moses.id, createdById: ngozi.id, teamId: team["Product Design"], status: "in_progress", priority: "normal", dueAt: daysAhead(3) },
    { title: "Upload September attendance notes", project: "Attendance", assigneeId: person.moses.id, createdById: person.kemi.id, status: "todo", priority: "low", dueAt: daysAhead(6) },
    { title: "Team retro notes", project: "Operations", assigneeId: person.moses.id, createdById: ada.id, status: "done", priority: "low", dueAt: daysAhead(-4), completedAt: daysAhead(-4) },
    { title: "Prepare intern induction deck", project: "Programmes", assigneeId: person.chioma.id, createdById: tunde.id, teamId: team.Platform, status: "todo", priority: "high", dueAt: daysAhead(8) },
    { title: "Publish October careers page update", project: "Website", assigneeId: person.bello.id, createdById: ngozi.id, teamId: team.Growth, status: "todo", priority: "normal", dueAt: daysAhead(9) },
    { title: "Fix mobile nav overlap on dashboard", project: "Platform", assigneeId: person.chioma.id, createdById: tunde.id, teamId: team.Platform, status: "in_progress", priority: "high", dueAt: daysAhead(2) },
    { title: "Draft cohort 5 curriculum", project: "Programmes", assigneeId: person.femi.id, createdById: person.kemi.id, teamId: team.Cohorts, status: "todo", priority: "normal", dueAt: daysAhead(14) },
    { title: "Weekly data lab write-up", project: "Programmes", assigneeId: person.grace.id, createdById: tunde.id, teamId: team.Cohorts, status: "in_progress", priority: "normal", dueAt: daysAhead(4) },
  ]);

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
      { title: "Senior Frontend Engineer", departmentId: dept.engineering, employmentType: "full_time", stage: "interviewing", postedAt: daysAhead(-18) },
      { title: "Product Designer", departmentId: dept.design, employmentType: "full_time", stage: "screening", postedAt: daysAhead(-12) },
      { title: "Marketing Intern", departmentId: dept.marketing, employmentType: "internship", stage: "open", postedAt: daysAhead(-6) },
      { title: "Community Volunteer", departmentId: dept.programmes, employmentType: "volunteer", stage: "draft" },
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
