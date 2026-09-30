import { JobEditor } from "@/components/editor/job-editor";
import { getDepartments, getPeople, getSkills } from "@/db/queries";
import { atLeast } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { notFound } from "next/navigation";

export const metadata = { title: "New listing · CVSpan Portal" };

export default async function NewJobPage() {
  const user = await requireUser();
  if (!atLeast(user.role, "admin")) notFound();

  const [departments, people, skills] = await Promise.all([
    getDepartments(),
    getPeople(),
    getSkills(),
  ]);

  return (
    <JobEditor
      job={{
        title: "",
        description: "",
        summary: null,
        departmentId: null,
        employmentType: "full_time",
        seniority: "mid",
        location: null,
        workMode: "on_site",
        openings: 1,
        skills: [],
        salaryMin: null,
        salaryMax: null,
        salaryCurrency: "NGN",
        salaryPeriod: "month",
        salaryPublic: false,
        hiringManagerId: null,
        applyMethod: "portal",
        applyValue: null,
        closingDate: null,
        stage: "draft",
      }}
      departments={departments}
      managers={people
        .filter((person) => person.role !== "member")
        .map((person) => ({ id: person.id, name: person.name }))}
      skillSuggestions={skills}
    />
  );
}
