export type Tone = "neutral" | "accent" | "success" | "warning" | "error";

/** Overdue beats status: an unfinished task past its date always reads as error. */
export function taskTone(
  status: "todo" | "in_progress" | "blocked" | "done",
  dueAt?: Date | string | null,
): Tone {
  if (status === "done") return "success";
  if (dueAt && new Date(dueAt) < new Date()) return "error";
  if (status === "in_progress") return "accent";
  if (status === "blocked") return "warning";
  return "neutral";
}

export function statusTone(status: string): Tone {
  switch (status) {
    case "active":
    case "published":
    case "approved":
    case "hired":
    case "graded":
      return "success";
    case "invited":
    case "in_review":
    case "pending":
    case "screening":
      return "warning";
    case "scheduled":
    case "interviewing":
    case "interview":
    case "submitted":
    case "offer":
      return "accent";
    case "declined":
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

export function attendanceTone(kind: "on_site" | "remote" | "leave" | "absent"): Tone {
  if (kind === "on_site") return "success";
  if (kind === "remote") return "accent";
  if (kind === "leave") return "warning";
  return "error";
}
