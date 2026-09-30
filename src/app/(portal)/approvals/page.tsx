import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { approvals, leaveRequests } from "@/lib/mock-data";

export default function ApprovalsPage() {
  const pendingLeave = leaveRequests.filter((request) => request.status === "Pending");

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
        <CardHeader title="Waiting on you" action={<Badge tone="warning">{approvals.length}</Badge>} />
        <ul>
          {approvals.map((item) => (
            <li
              key={item.id}
              className="border-line hover:bg-raised flex items-center gap-3 border-b px-5 py-4 transition-colors last:border-b-0"
            >
              <span className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-full text-caption font-semibold">
                {item.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-primary block text-body font-semibold">
                  {item.kind} · {item.who}
                </span>
                <span className="text-muted block truncate text-tiny">
                  {item.detail} · {item.when}
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
      </Card>

      <Card>
        <CardHeader title="Leave requests" action={<Badge>{pendingLeave.length} pending</Badge>} />
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
                <span className="text-primary block text-body font-semibold">
                  {request.person}
                </span>
                <span className="text-muted block text-tiny">
                  {request.type} · {request.dates} · {request.days} day
                  {request.days > 1 ? "s" : ""}
                </span>
              </span>
              <Badge tone={request.status === "Approved" ? "success" : "warning"}>
                {request.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
