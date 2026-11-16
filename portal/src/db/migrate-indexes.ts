/**
 * Indexes for the lookups the portal makes on every page: per-person lists (notifications, KPI scores,
 * leave, certificates, enrolments), the approvals queue, message threads, the activity log and the
 * blog. Without them every one of these reads the whole table, which is invisible at a dozen people
 * and the first thing to hurt at a few thousand.
 *
 * Purely additive: indexes change how fast a read is, never what it returns. Safe to re-run, and
 * safe on a busy database (`create index if not exists` only takes a short lock on these small tables).
 *
 *   npm run db:migrate-indexes
 */
import { sql } from "./sql";

const indexes = [
  "create index if not exists notifications_user_created_idx on notifications (user_id, created_at)",
  "create index if not exists approvals_assignee_open_idx on approvals (assigned_to_id, resolved_at)",
  "create index if not exists approvals_subject_idx on approvals (kind, subject_id)",
  "create index if not exists kpi_scores_user_period_idx on kpi_scores (user_id, period_start)",
  "create index if not exists leave_requests_user_status_idx on leave_requests (user_id, status)",
  "create index if not exists messages_thread_created_idx on messages (thread_id, created_at)",
  "create index if not exists thread_members_user_idx on thread_members (user_id)",
  "create index if not exists certificates_user_idx on certificates (user_id)",
  "create index if not exists enrolments_user_idx on enrolments (user_id)",
  "create index if not exists submissions_user_idx on submissions (user_id)",
  "create index if not exists activity_log_created_idx on activity_log (created_at)",
  "create index if not exists applications_job_idx on applications (job_id)",
  "create index if not exists blog_posts_author_idx on blog_posts (author_id)",
  "create index if not exists blog_posts_status_publish_idx on blog_posts (status, publish_at)",
  "create index if not exists users_manager_idx on users (manager_id)",
  "create index if not exists users_department_idx on users (department_id)",
];

async function main() {
  for (const statement of indexes) {
    await sql.query(statement);
    console.log(statement.split(" ")[5]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
