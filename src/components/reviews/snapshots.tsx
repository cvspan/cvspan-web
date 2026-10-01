import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InternshipCountdown } from "@/components/reviews/internship-countdown";
import { RatingMeter } from "@/components/reviews/rating-meter";
import { getUserById } from "@/db/queries";
import {
  getOutstandingReviewCount,
  getReviewsForUser,
  getSubjectsFor,
} from "@/db/queries-reviews";
import { addDays, companyDay } from "@/lib/dates";
import { formatDay, pluralise } from "@/lib/format";
import { CRITERIA, RATING_LABELS, internshipWindow, ratingTone } from "@/lib/grading";

/** The intern's countdown, shown only to people on an internship. */
export async function MyInternshipCountdown({ userId }: { userId: string }) {
  const person = await getUserById(userId);
  if (!person || person.employmentType !== "internship") return null;

  const window = internshipWindow(person, companyDay());
  return window ? <InternshipCountdown window={window} /> : null;
}

/** Your most recent weekly grade, with the breakdown. */
export async function MyLatestReview({ userId }: { userId: string }) {
  const [latest] = await getReviewsForUser(userId, 1);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted text-tiny font-semibold tracking-wide uppercase">
            Latest weekly grade
          </p>
          {latest ? (
            <p className="text-muted mt-0.5 text-tiny">
              Week of {formatDay(latest.weekStart)} – {formatDay(addDays(latest.weekStart, 6))}
            </p>
          ) : null}
        </div>
        <Link href="/reviews">
          <Button variant="ghost" size="sm">
            All grades
            <RiArrowRightSLine size={16} aria-hidden />
          </Button>
        </Link>
      </div>

      {latest ? (
        <div className="mt-3 grid gap-4 sm:grid-cols-[9rem_1fr]">
          <div>
            <p className="text-primary text-h4 font-semibold">
              {latest.average?.toFixed(1)}
              <span className="text-muted text-para font-normal"> / 5</span>
            </p>
            <RatingMeter value={latest.average ?? 0} className="mt-2" />
            <Badge tone={ratingTone(latest.average ?? 0)} className="mt-2">
              {RATING_LABELS[Math.round(latest.average ?? 1)]}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1.5">
            {CRITERIA.map((criterion) => (
              <li key={criterion.key} className="flex items-center justify-between gap-3 text-caption">
                <span className="text-secondary">{criterion.name}</span>
                <span className="text-primary font-semibold">{latest.ratings[criterion.key] ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted mt-4 text-body">
          Nothing graded yet. Your reviewer grades at the end of each week.
        </p>
      )}
    </Card>
  );
}

/** For reviewers: how many weekly grades they still owe. Renders nothing for people with no one to grade. */
export async function ReviewsDue({ userId }: { userId: string }) {
  const subjects = await getSubjectsFor(userId);
  if (subjects.length === 0) return null;

  const owed = await getOutstandingReviewCount(subjects, companyDay());

  return (
    <Card className="p-5">
      <p className="text-muted text-tiny font-semibold tracking-wide uppercase">Weekly reviews</p>
      <p className="text-primary mt-1 text-h5 font-semibold">
        {owed === 0 ? "All caught up" : `${pluralise(owed, "grade")} to give`}
      </p>
      <p className="text-muted mt-1 text-caption">
        For {pluralise(subjects.length, "person", "people")} you review.
      </p>
      <Link href="/reviews" className="mt-4 block">
        <Button variant={owed === 0 ? "secondary" : "primary"} size="sm">
          {owed === 0 ? "Open reviews" : "Grade now"}
        </Button>
      </Link>
    </Card>
  );
}
