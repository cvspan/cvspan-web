import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ApprovalButtons } from "@/components/forms/approval-buttons";
import { PostReviewButtons } from "@/components/forms/website-forms";
import { ApproveCertificateButton, DeclineCertificateButton } from "@/components/forms/certificate-forms";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ensureDueCertificateRequests } from "@/app/actions/certificate-flow";
import { getApprovalsFor, getOpenApprovals, getPendingLeave } from "@/db/queries";
import { getCertificateEvidence, getCertificatesVisibleTo, type CertificateEvidence } from "@/db/queries-certificates";
import { certificateTitle, evidenceLine } from "@/lib/certificates";
import { initials, relativeDays } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";
import { cn } from "@/lib/utils";

export const metadata = { title: "Approvals" };

const types = [
  { key: "all", label: "All" },
  { key: "leave", label: "Leave" },
  { key: "certificates", label: "Certificates" },
  { key: "blog", label: "Blog posts" },
  { key: "other", label: "Other" },
] as const;
type TypeKey = (typeof types)[number]["key"];

const kindLabels: Record<string, string> = {
  leave: "Leave",
  certificate: "Certificate",
  timesheet: "Timesheet",
  kpi_grade: "KPI grade",
  blog_post: "Blog post",
};

function groupOf(kind: string): Exclude<TypeKey, "all"> {
  return kind === "leave" ? "leave" : kind === "certificate" ? "certificates" : kind === "blog_post" ? "blog" : "other";
}

export default async function ApprovalsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const user = await requireUser();
  /** The menu hides Approvals from members, but anyone could still type the address and read everyone's leave. */
  if (!atLeast(user.viewRole, "manager")) notFound();
  const isAdmin = atLeast(user.viewRole, "hr");

  /** An internship that has ended, or a programme that has been finished, shows up here for an admin to judge. */
  if (atLeast(user.role, "hr")) await ensureDueCertificateRequests();

  const [everything, leave] = await Promise.all([
    isAdmin ? getOpenApprovals() : getApprovalsFor(user.id),
    getPendingLeave(),
  ]);

  /** Posts for the public website are read and decided by admins only, whoever else can see the queue. */
  const reviewsPosts = atLeast(user.viewRole, "admin");
  const queue = everything.filter((item) => item.kind !== "blog_post" || reviewsPosts);
  const visibleTypes = types.filter((item) => item.key !== "blog" || reviewsPosts);

  const active: TypeKey = visibleTypes.some((item) => item.key === type) ? (type as TypeKey) : "all";
  const counts: Record<TypeKey, number> = {
    all: queue.length,
    leave: queue.filter((item) => groupOf(item.kind) === "leave").length,
    certificates: queue.filter((item) => groupOf(item.kind) === "certificates").length,
    blog: queue.filter((item) => groupOf(item.kind) === "blog").length,
    other: queue.filter((item) => groupOf(item.kind) === "other").length,
  };
  const shown = active === "all" ? queue : queue.filter((item) => groupOf(item.kind) === active);

  /** Certificate requests carry the person, the note and their record, so the admin is not deciding blind. */
  const certificateIds = shown.filter((item) => item.kind === "certificate").map((item) => item.subjectId);
  const certificates = certificateIds.length ? await getCertificatesVisibleTo({ id: user.id, role: "hr" }) : [];
  const certificateById = new Map(certificates.map((row) => [row.id, row]));
  const evidence = new Map<string, CertificateEvidence>(
    await Promise.all(
      certificateIds.flatMap((id) => {
        const row = id ? certificateById.get(id) : undefined;
        return row ? [getCertificateEvidence(row.userId).then((value) => [row.id, value] as const)] : [];
      }),
    ),
  );

  const pending = leave.filter((request) => request.status === "pending");

  return (
    <>
      <PageHeader pretitle="Manage" title="Approvals" />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Everything waiting on a decision, in one queue: leave, certificates, blog posts and other requests such as
        timesheets.{reviewsPosts ? " Posts that employees send for review appear here for you to publish or send back." : ""}
        {isAdmin ? " Certificates appear here by themselves when an internship ends or someone finishes a programme that issues one." : ""}
      </p>

      <nav aria-label="Filter by type" className="flex flex-wrap gap-1">
        {visibleTypes.map((item) => (
          <Link
            key={item.key}
            href={item.key === "all" ? "/approvals" : `/approvals?type=${item.key}`}
            aria-current={active === item.key ? "page" : undefined}
            className={cn(
              "rounded-lg px-2.5 py-1 text-caption font-semibold transition-colors",
              active === item.key ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary",
            )}
          >
            {item.label} <span className="font-normal">{counts[item.key]}</span>
          </Link>
        ))}
      </nav>

      <Card>
        <CardHeader
          title="Waiting on you"
          action={<Badge tone={shown.length > 0 ? "warning" : "success"}>{shown.length}</Badge>}
        />
        {shown.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">Nothing to approve.</p>
        ) : (
          <ul>
            {shown.map((item) => {
              const certificate = item.kind === "certificate" && item.subjectId ? certificateById.get(item.subjectId) : undefined;

              if (certificate) {
                const record = evidence.get(certificate.id);
                const name = certificate.person ?? "this person";
                return (
                  <li key={item.id} className="border-line flex flex-wrap items-start gap-4 border-b px-5 py-4 last:border-b-0">
                    <Avatar name={name} size="lg" />
                    <span className="min-w-60 flex-1">
                      <span className="text-primary flex flex-wrap items-center gap-2 text-body font-semibold">
                        {certificateTitle(certificate.programme)} · {name}
                        <Badge tone="accent">Certificate</Badge>
                      </span>
                      <span className="text-muted block text-caption">
                        {certificate.requestedBy ? `Put forward by ${certificate.requestedBy}` : "Requested automatically"} ·{" "}
                        {relativeDays(certificate.requestedAt)}
                      </span>
                      {certificate.requestNote ? (
                        <span className="text-secondary mt-1 block text-body">{certificate.requestNote}</span>
                      ) : null}
                      {record ? <span className="text-muted mt-1 block text-caption">{evidenceLine(record)}</span> : null}
                    </span>
                    <span className="flex gap-2">
                      <DeclineCertificateButton certificateId={certificate.id} name={name} />
                      <ApproveCertificateButton certificateId={certificate.id} name={name} />
                    </span>
                  </li>
                );
              }

              if (item.kind === "blog_post" && item.subjectId) {
                const title = (item.detail ?? "").replace(/^“|”$/g, "");
                return (
                  <li key={item.id} className="border-line flex flex-wrap items-center gap-4 border-b px-5 py-4 last:border-b-0">
                    <Avatar name={item.requestedBy ?? "?"} size="lg" />
                    <span className="min-w-60 flex-1">
                      <span className="text-primary flex flex-wrap items-center gap-2 text-body font-semibold">
                        {title}
                        <Badge tone="accent">Blog post</Badge>
                      </span>
                      <span className="text-muted block text-caption">
                        By {item.requestedBy ?? "an employee"} · {relativeDays(item.createdAt)}
                      </span>
                      <Link href={`/blog/${item.subjectId}`} className="text-accent mt-1 inline-block text-caption font-semibold hover:underline">
                        Read the post
                      </Link>
                    </span>
                    <PostReviewButtons postId={item.subjectId} title={title} />
                  </li>
                );
              }

              return (
                <li
                  key={item.id}
                  className="border-line hover:bg-raised flex items-center gap-3 border-b px-5 py-4 transition-colors last:border-b-0"
                >
                  <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                    {initials(item.requestedBy ?? "??")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-primary block text-body font-semibold">
                      {kindLabels[item.kind] ?? item.kind.replace("_", " ")} · {item.requestedBy ?? "CVSpan"}
                    </span>
                    <span className="text-muted block truncate text-tiny">
                      {item.detail} · {relativeDays(item.createdAt)}
                    </span>
                  </span>
                  <ApprovalButtons
                    approvalId={item.id}
                    label={`${(kindLabels[item.kind] ?? item.kind).toLowerCase()} from ${item.requestedBy ?? "CVSpan"}`}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {active === "all" || active === "leave" ? (
        <Card>
          <CardHeader title="Leave requests" action={<Badge>{pending.length} pending</Badge>} />
          <ul>
            {leave.map((request) => (
              <li
                key={request.id}
                className="border-line flex items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-tiny font-semibold">
                  {initials(request.person ?? "??")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-primary block text-body font-semibold">{request.person}</span>
                  <span className="text-muted block text-tiny">
                    {request.type} · {request.startDate}
                    {request.endDate !== request.startDate ? ` – ${request.endDate}` : ""} · {request.days} day
                    {request.days > 1 ? "s" : ""}
                  </span>
                </span>
                <Badge tone={statusTone(request.status)} className="capitalize">
                  {request.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </>
  );
}
