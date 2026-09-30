import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getApprovalsFor, getOpenApprovals, getPendingLeave } from "@/db/queries";
import { initials, relativeDays } from "@/lib/format";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { statusTone } from "@/lib/tone";

export default async function ApprovalsPage() {
  const user = await requireUser();
  const [queue, leave] = await Promise.all([
    atLeast(user.viewRole, "admin") ? getOpenApprovals() : getApprovalsFor(user.id),
    getPendingLeave(),
  ]);

  const pending = leave.filter((request) => request.status === "pending");

  return (
    <>
      <PageHeader
        pretitle="Manage"
        title="Approvals"
        actions={<Button variant="secondary">Approve all leave</Button>}
      />

      <p className="text-secondary -mt-1 max-w-200 text-body">
        Everything waiting on a decision, in one queue: leave, timesheets, grading and anything
        headed for the public website.
      </p>

      <Card>
        <CardHeader
          title="Waiting on you"
          action={<Badge tone={queue.length > 0 ? "warning" : "success"}>{queue.length}</Badge>}
        />
        {queue.length === 0 ? (
          <p className="text-muted px-5 py-8 text-center text-body">Nothing to approve.</p>
        ) : (
          <ul>
            {queue.map((item) => (
              <li
                key={item.id}
                className="border-line hover:bg-raised flex items-center gap-3 border-b px-5 py-4 transition-colors last:border-b-0"
              >
                <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                  {initials(item.requestedBy ?? "??")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-primary block text-body font-semibold capitalize">
                    {item.kind.replace("_", " ")} · {item.requestedBy}
                  </span>
                  <span className="text-muted block truncate text-tiny">
                    {item.detail} · {relativeDays(item.createdAt)}
                  </span>
                </span>
                <span className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <RiCloseLine size={16} aria-hidden />
                    Decline
                  </Button>
                  <Button size="sm">
                    <RiCheckLine size={16} aria-hidden />
                    Approve
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

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
                <span className="text-primary block text-body font-semibold">
                  {request.person}
                </span>
                <span className="text-muted block text-tiny">
                  {request.type} · {request.startDate}
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
      </Card>
    </>
  );
}
