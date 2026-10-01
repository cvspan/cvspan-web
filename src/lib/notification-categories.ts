/**
 * The kinds of notification the portal actually sends, so people can switch each on or off.
 * Only categories that something produces are listed: a switch for an alert that never arrives
 * would be a dead control.
 */
export const notificationCategories = [
  { key: "tasks", label: "A task is assigned to me" },
  { key: "grades", label: "My KPI grade or weekly review is posted" },
  { key: "approvals", label: "Leave requests for me to approve, and decisions on mine" },
  { key: "projects", label: "I am added to a project or made its manager" },
  { key: "organisation", label: "My role, department or reporting line changes" },
  { key: "careers", label: "A candidate applies for a role I am hiring for" },
] as const;

export type NotificationCategory = (typeof notificationCategories)[number]["key"];
