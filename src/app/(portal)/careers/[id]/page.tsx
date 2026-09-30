import { notFound } from "next/navigation";
import { JobEditor } from "@/components/editor/job-editor";
import { getDepartments, getJobById, getPeople, getSkills } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  if (!atLeast(user.role, "admin")) notFound();

  const job = await getJobById(id);
  if (!job) notFound();

  const [departments, people, skills] = await Promise.all([
    getDepartments(),
    getPeople(),
    getSkills(),
  ]);

  return (
    <JobEditor
      job={{
        id: job.id,
        title: job.title,
        description: job.description ?? "",
        summary: job.summary,
        departmentId: job.departmentId,
        employmentType: job.employmentType,
        seniority: job.seniority,
        location: job.location,
        workMode: job.workMode,
        openings: job.openings,
        skills: job.skills,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        salaryPeriod: job.salaryPeriod,
        salaryPublic: job.salaryPublic,
        hiringManagerId: job.hiringManagerId,
        applyMethod: job.applyMethod,
        applyValue: job.applyValue,
        closingDate: job.closingDate,
        experience: job.experience,
        language: job.language,
        stage: job.stage,
      }}
      departments={departments}
      managers={people
        .filter((person) => person.role !== "member")
        .map((person) => ({ id: person.id, name: person.name }))}
      skillSuggestions={skills}
    />
  );
}
