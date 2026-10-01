import Link from "next/link";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Thead, Tr } from "@/components/ui/table";
import { GradeWeekButton, type ReviewDialogData } from "@/components/forms/review-forms";
import { InternshipCountdown } from "@/components/reviews/internship-countdown";
import { RatingMeter } from "@/components/reviews/rating-meter";
import { WeeklyTrend } from "@/components/reviews/weekly-trend";
import {
  getGradablePeople,
  getLoginTrackingStart,
  getReviewsForPeople,
  getReviewsForUser,
  getWeekEvidence,
  type ReviewRow,
} from "@/db/queries-reviews";
import { getPeople } from "@/db/queries";
import { addDays, companyDay, mondayOf } from "@/lib/dates";
import { employmentLabels, formatDay, pluralise, relativeDays } from "@/lib/format";
import {
  CRITERIA,
  RATING_LABELS,
  canReview,
  defaultReviewWeek,
  evidenceHints,
  evidenceRatios,
  internshipWindow,
  isReviewableWeek,
  ratingTone,
  reviewerIdFor,
  suggestRating,
} from "@/lib/grading";
import { atLeast, roleLabels } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Weekly reviews · CVSpan Portal" };

const weekLabel = (weekStart: string) => `${formatDay(weekStart)} – ${formatDay(addDays(weekStart, 6))}`;

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const user = await requireUser();
  const today = companyDay();
  const thisWeek = mondayOf(today);

  const { week: requested } = await searchParams;
  const weekStart =
    requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)
      ? (() => {
          const monday = mondayOf(requested);
          return monday > thisWeek ? thisWeek : monday;
        })()
      : defaultReviewWeek(today);

  const [people, everyone] = await Promise.all([getGradablePeople(), getPeople()]);
  const me = people.find((person) => person.id === user.id) ?? null;

  /** Admins can grade anyone; everyone else grades the people they are the reviewer for. */
  const isAdminView = atLeast(user.viewRole, "admin");
  const subjects = people.filter((person) => {
    if (person.id === user.id) return false;
    if (isAdminView) return true;
    return reviewerIdFor(person, person.departmentHeadId) === user.id;
  });

  const [myReviews, weekReviews, evidence, trackingStart] = await Promise.all([
    me ? getReviewsForUser(me.id) : Promise.resolve([] as ReviewRow[]),
    getReviewsForPeople(subjects.map((person) => person.id), weekStart, weekStart),
    getWeekEvidence(subjects.map((person) => person.id), weekStart),
    getLoginTrackingStart(),
  ]);

  const tracksLogins = trackingStart !== null && weekStart >= trackingStart;
  const myWeek = myReviews.find((review) => review.weekStart === weekStart) ?? null;
  const reviewByPerson = new Map(weekReviews.map((review) => [review.userId, review]));
  /** A reviewer may be an admin, who isn't in the weekly cycle themselves. */
  const nameById = new Map(everyone.map((person) => [person.id, person.name]));

  const intern = me && me.employmentType === "internship" ? internshipWindow(me, today) : null;

  /** Last eight weeks, oldest first, for the trend. */
  const trend = Array.from({ length: 8 }, (_, index) => {
    const week = addDays(thisWeek, -7 * (7 - index));
    return {
      label: formatDay(week),
      value: myReviews.find((review) => review.weekStart === week)?.average ?? null,
    };
  });

  const previousWeek = addDays(weekStart, -7);
  const nextWeek = addDays(weekStart, 7);

  const gradeData = (person: (typeof subjects)[number]): ReviewDialogData => {
    const personEvidence = evidence.get(person.id)!;
    const ratios = evidenceRatios(personEvidence, tracksLogins);
    const existing = reviewByPerson.get(person.id);

    return {
      userId: person.id,
      name: person.name,
      weekStart,
      weekLabel: weekLabel(weekStart),
      hints: evidenceHints(personEvidence, tracksLogins),
      suggestions: {
        meetings: suggestRating(ratios.meetings),
        availability: suggestRating(ratios.availability),
        tasks: suggestRating(ratios.tasks),
        daily_login: suggestRating(ratios.daily_login),
      },
      existing: existing
        ? {
            ratings: existing.ratings,
            comment: existing.comment,
            updatedAt: existing.updatedAt.toISOString(),
          }
        : null,
    };
  };

  const graded = subjects.filter((person) => reviewByPerson.has(person.id)).length;

  return (
    <>
      <PageHeader
        pretitle="Performance"
        title="Weekly reviews"
        actions={
          <nav aria-label="Choose a week" className="flex items-center gap-1">
            <Link
              href={`/reviews?week=${previousWeek}`}
              aria-label="Previous week"
              className="border-line text-secondary hover:bg-raised flex size-10 items-center justify-center rounded-lg border"
            >
              <RiArrowLeftSLine size={18} aria-hidden />
            </Link>
            <span className="border-line text-primary flex h-10 items-center rounded-lg border px-4 text-body font-semibold whitespace-nowrap">
              {weekLabel(weekStart)}
              {weekStart === thisWeek ? <Badge className="ml-2">This week</Badge> : null}
            </span>
            {nextWeek <= thisWeek ? (
              <Link
                href={`/reviews?week=${nextWeek}`}
                aria-label="Next week"
                className="border-line text-secondary hover:bg-raised flex size-10 items-center justify-center rounded-lg border"
              >
                <RiArrowRightSLine size={18} aria-hidden />
              </Link>
            ) : (
              <span
                aria-hidden
                className="border-line text-muted flex size-10 items-center justify-center rounded-lg border opacity-40"
              >
                <RiArrowRightSLine size={18} />
              </span>
            )}
          </nav>
        }
      />

      {intern ? <InternshipCountdown window={intern} /> : null}

      {me ? (
        <section className="grid items-start gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader
              title="My review"
              action={myWeek ? <Badge tone={ratingTone(myWeek.average ?? 0)}>{RATING_LABELS[Math.round(myWeek.average ?? 1)]}</Badge> : null}
            />

            {myWeek ? (
              <div className="grid gap-5 p-5 md:grid-cols-[11rem_1fr]">
                <div className="flex flex-col gap-2">
                  <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Overall</p>
                  <p className="text-primary text-h3 font-semibold">
                    {myWeek.average?.toFixed(1)}
                    <span className="text-muted text-para font-normal"> / 5</span>
                  </p>
                  <RatingMeter value={myWeek.average ?? 0} />
                  <p className="text-muted mt-1 text-tiny">
                    Graded by {myWeek.reviewerName ?? "your reviewer"} · {relativeDays(myWeek.updatedAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-3">
                    {CRITERIA.map((criterion) => {
                      const value = myWeek.ratings[criterion.key];
                      return (
                        <li key={criterion.key} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-primary w-44 text-body font-semibold">{criterion.name}</span>
                          {value ? (
                            <>
                              <RatingMeter value={value} size="sm" />
                              <span className="text-secondary text-caption">
                                {value} · {RATING_LABELS[value]}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted text-caption">Not rated</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {myWeek.comment ? (
                    <blockquote className="border-line text-secondary border-l-2 pl-4 text-body whitespace-pre-line">
                      {myWeek.comment}
                    </blockquote>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="text-muted px-5 py-10 text-center text-body">
                {isReviewableWeek(weekStart, today, me.startDate)
                  ? weekStart === thisWeek && weekStart !== defaultReviewWeek(today)
                    ? "This week isn't over yet. Your reviewer grades at the end of the week."
                    : "Not graded yet. Your reviewer grades at the end of each week."
                  : "You hadn't started by this week."}
              </p>
            )}
          </Card>

          <Card>
            <CardHeader title="Last 8 weeks" />
            <WeeklyTrend points={trend} />
          </Card>
        </section>
      ) : null}

      {subjects.length > 0 ? (
        <Card>
          <CardHeader
            title={isAdminView ? "All reviews this week" : "Reviews to give"}
            action={
              <Badge tone={graded === subjects.length ? "success" : "warning"}>
                {graded} of {subjects.length} graded
              </Badge>
            }
          />
          <Table>
            <Thead
              columns={[
                "Person",
                ...(isAdminView ? ["Reviewer"] : []),
                "This week",
                "Rating",
                "",
              ]}
            />
            <tbody>
              {subjects.map((person) => {
                const review = reviewByPerson.get(person.id);
                const personEvidence = evidence.get(person.id)!;
                const reviewable = isReviewableWeek(weekStart, today, person.startDate);
                const reviewerId = reviewerIdFor(person, person.departmentHeadId);
                const mayGrade = canReview({ id: user.id, role: user.role }, person, person.departmentHeadId);

                return (
                  <Tr key={person.id}>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Avatar name={person.name} />
                        <span className="min-w-0">
                          <Link
                            href={`/people/${person.id}`}
                            className="text-primary hover:text-accent block truncate font-semibold"
                          >
                            {person.name}
                          </Link>
                          <span className="text-muted block truncate text-tiny">
                            {roleLabels[person.role]} · {employmentLabels[person.employmentType]}
                          </span>
                        </span>
                      </span>
                    </Td>
                    {isAdminView ? (
                      <Td className="whitespace-nowrap">
                        {reviewerId ? (nameById.get(reviewerId) ?? "—") : <span className="text-muted">None set</span>}
                      </Td>
                    ) : null}
                    <Td className="text-caption whitespace-nowrap">
                      <span className="block">
                        Logged in {tracksLogins ? `${personEvidence.loginDays}/5` : "—"} · Clocked in {personEvidence.presentDays}/5
                      </span>
                      <span className="text-muted block text-tiny">
                        {personEvidence.tasksDue === 0
                          ? "No tasks due"
                          : `Tasks ${personEvidence.tasksDone}/${personEvidence.tasksDue} done`}
                      </span>
                    </Td>
                    <Td>
                      {review ? (
                        <span className="flex items-center gap-2.5">
                          <RatingMeter value={review.average ?? 0} size="sm" />
                          <span className="text-primary text-caption font-semibold">
                            {review.average?.toFixed(1)}
                          </span>
                        </span>
                      ) : reviewable ? (
                        <Badge tone="warning">Not graded</Badge>
                      ) : (
                        <span className="text-muted">Not started</span>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span className="flex justify-end">
                        {reviewable && mayGrade ? <GradeWeekButton data={gradeData(person)} /> : null}
                      </span>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      ) : null}

      {me ? (
        <Card>
          <CardHeader title="My history" action={<Badge>{pluralise(myReviews.length, "week")} graded</Badge>} />
          {myReviews.length === 0 ? (
            <p className="text-muted px-5 py-8 text-body">Nothing graded yet.</p>
          ) : (
            <Table>
              <Thead
                columns={["Week", "Overall", ...CRITERIA.map((criterion) => criterion.name), "Reviewer"]}
              />
              <tbody>
                {myReviews.map((review) => (
                  <Tr key={review.id}>
                    <Td className="whitespace-nowrap">
                      <Link
                        href={`/reviews?week=${review.weekStart}`}
                        className="text-primary hover:text-accent font-semibold"
                      >
                        {weekLabel(review.weekStart)}
                      </Link>
                    </Td>
                    <Td>
                      <Badge tone={ratingTone(review.average ?? 0)}>{review.average?.toFixed(1)}</Badge>
                    </Td>
                    {CRITERIA.map((criterion) => (
                      <Td key={criterion.key}>{review.ratings[criterion.key] ?? "—"}</Td>
                    ))}
                    <Td className="whitespace-nowrap">{review.reviewerName ?? "—"}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      ) : null}

      {!me && subjects.length === 0 ? (
        <Card>
          <p className="text-muted px-5 py-10 text-center text-body">
            Nothing to review. Reviews go to the people who report to you, or to the managers in a
            department you head.
          </p>
        </Card>
      ) : null}
    </>
  );
}
