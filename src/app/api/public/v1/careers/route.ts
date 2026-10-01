import { getPublicDepartments, getPublicJobs } from "@/db/queries-public";
import { preflight, publicJson } from "@/lib/public-api";
import { toPublicJobSummary } from "@/lib/public-content";

/**
 * GET /api/public/v1/careers?department=design
 * Open roles, newest first, plus every department with how many roles it has open, which is what
 * the website's "Filter by departments" chips need.
 */
export async function GET(request: Request) {
  const department = new URL(request.url).searchParams.get("department")?.slice(0, 80) || undefined;

  const [jobs, departments] = await Promise.all([getPublicJobs(department), getPublicDepartments()]);

  return publicJson(request, {
    jobs: jobs.map(toPublicJobSummary),
    departments,
  });
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
