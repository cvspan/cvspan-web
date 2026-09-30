"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiAddLine,
  RiBriefcaseLine,
  RiCloseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
  RiUserStarLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./rich-text";
import { TagField } from "./tag-field";
import { saveJob } from "@/app/actions/website";
import {
  applyMethodLabels,
  employmentLabels,
  seniorityLabels,
  salaryPeriodLabels,
  workModeLabels,
  type EmploymentType,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export type JobDraft = {
  id?: string;
  title: string;
  description: string;
  summary: string | null;
  departmentId: string | null;
  employmentType: EmploymentType;
  seniority: keyof typeof seniorityLabels;
  location: string | null;
  workMode: keyof typeof workModeLabels;
  openings: number;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: keyof typeof salaryPeriodLabels;
  salaryPublic: boolean;
  hiringManagerId: string | null;
  applyMethod: keyof typeof applyMethodLabels;
  applyValue: string | null;
  closingDate: string | null;
  experience: string | null;
  language: string | null;
  stage: string;
};

const inputClass =
  "border-line-input text-primary placeholder:text-muted h-11 w-full rounded-lg border bg-transparent px-3.5 text-para outline-none";

/** A skeleton that nudges people to write the four sections candidates look for. */
const STARTER = `<h2>About the role</h2><p></p><h2>What you'll do</h2><ul><li></li></ul><h2>What we're looking for</h2><ul><li></li></ul><h2>What we offer</h2><ul><li></li></ul>`;

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: RemixiconComponentType;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line bg-card rounded-lg border p-4">
      <h2 className="text-primary mb-3 flex items-center gap-1.5 text-body font-semibold">
        {Icon ? <Icon size={16} className="text-muted" /> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-secondary text-caption font-semibold">{label}</span>
      {children}
    </label>
  );
}

export function JobEditor({
  job,
  departments,
  managers,
  skillSuggestions,
}: {
  job: JobDraft;
  departments: { id: string; name: string }[];
  managers: { id: string; name: string }[];
  skillSuggestions: string[];
}) {
  const [applyMethod, setApplyMethod] = useState(job.applyMethod);
  const [newDepartment, setNewDepartment] = useState(false);
  const [showSalary, setShowSalary] = useState(job.salaryPublic);

  return (
    <form action={saveJob} className="bg-app fixed inset-0 z-50 flex flex-col overflow-y-auto">
      {job.id ? <input type="hidden" name="id" value={job.id} /> : null}

      <header className="border-line bg-card sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:px-6">
        <Link
          href="/careers"
          aria-label="Close editor"
          className="text-muted hover:bg-raised hover:text-primary flex size-9 items-center justify-center rounded-lg transition-colors"
        >
          <RiCloseLine size={20} aria-hidden />
        </Link>

        <span className="min-w-0 flex-1">
          <span className="text-primary block text-body font-semibold">
            {job.id ? "Edit listing" : "New job listing"}
          </span>
          <span className="text-muted block text-tiny">
            Published listings appear on the CVSpan website careers page
          </span>
        </span>

        <Button type="submit" name="intent" value="draft" variant="secondary">
          Save draft
        </Button>
        {job.stage === "open" ? (
          <Button type="submit" name="intent" value="close" variant="secondary">
            Close role
          </Button>
        ) : null}
        <Button type="submit" name="intent" value="publish">
          {job.stage === "open" ? "Update live listing" : "Publish listing"}
        </Button>
      </header>

      <div className="mx-auto grid w-full max-w-450 flex-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-6">
        <div className="border-line bg-card flex flex-col overflow-hidden rounded-lg border">
          <input
            name="title"
            defaultValue={job.title}
            required
            placeholder="Role title"
            aria-label="Role title"
            className="text-primary placeholder:text-muted w-full shrink-0 bg-transparent px-4 pt-6 pb-2 text-h4 font-semibold outline-none sm:px-6"
          />
          <input
            name="summary"
            defaultValue={job.summary ?? ""}
            placeholder="One line that sells the role — shown on the careers listing"
            aria-label="Summary"
            className="text-secondary placeholder:text-muted w-full shrink-0 bg-transparent px-4 pb-4 text-para outline-none sm:px-6"
          />
          <RichTextEditor
            name="description"
            defaultValue={job.description || (job.id ? "" : STARTER)}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Panel title="Role" icon={RiBriefcaseLine}>
            <div className="flex flex-col gap-3">
              {newDepartment ? (
                <Field label="New department">
                  <input
                    name="newDepartment"
                    autoFocus
                    placeholder="e.g. Business Development"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setNewDepartment(false)}
                    className="text-muted hover:text-primary cursor-pointer self-start text-tiny"
                  >
                    Choose an existing one instead
                  </button>
                </Field>
              ) : (
                <Field label="Department">
                  <select
                    name="departmentId"
                    defaultValue={job.departmentId ?? ""}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="">No department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setNewDepartment(true)}
                    className="text-accent flex cursor-pointer items-center gap-1 self-start text-tiny font-semibold"
                  >
                    <RiAddLine size={12} aria-hidden />
                    New department
                  </button>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Employment type">
                  <select
                    name="employmentType"
                    defaultValue={job.employmentType}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {(Object.keys(employmentLabels) as EmploymentType[]).map((type) => (
                      <option key={type} value={type}>
                        {employmentLabels[type]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Level">
                  <select
                    name="seniority"
                    defaultValue={job.seniority}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {(Object.keys(seniorityLabels) as (keyof typeof seniorityLabels)[]).map(
                      (level) => (
                        <option key={level} value={level}>
                          {seniorityLabels[level]}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Openings">
                  <input
                    name="openings"
                    type="number"
                    min={1}
                    defaultValue={job.openings}
                    className={inputClass}
                  />
                </Field>
                <Field label="Closing date">
                  <input
                    name="closingDate"
                    type="date"
                    defaultValue={job.closingDate ?? ""}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Location" icon={RiMapPinLine}>
            <div className="flex flex-col gap-3">
              <Field label="Where">
                <input
                  name="location"
                  defaultValue={job.location ?? ""}
                  placeholder="Lagos, Nigeria"
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Experience">
                  <input
                    name="experience"
                    defaultValue={job.experience ?? ""}
                    placeholder="1–2 years"
                    className={inputClass}
                  />
                </Field>
                <Field label="Language">
                  <input
                    name="language"
                    defaultValue={job.language ?? "English"}
                    placeholder="English"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Work mode">
                <select
                  name="workMode"
                  defaultValue={job.workMode}
                  className={cn(inputClass, "cursor-pointer")}
                >
                  {(Object.keys(workModeLabels) as (keyof typeof workModeLabels)[]).map((mode) => (
                    <option key={mode} value={mode}>
                      {workModeLabels[mode]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Compensation" icon={RiMoneyDollarCircleLine}>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Minimum">
                  <input
                    name="salaryMin"
                    inputMode="numeric"
                    defaultValue={job.salaryMin ?? ""}
                    placeholder="450000"
                    className={inputClass}
                  />
                </Field>
                <Field label="Maximum">
                  <input
                    name="salaryMax"
                    inputMode="numeric"
                    defaultValue={job.salaryMax ?? ""}
                    placeholder="600000"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Currency">
                  <select
                    name="salaryCurrency"
                    defaultValue={job.salaryCurrency}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="NGN">NGN ₦</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                  </select>
                </Field>
                <Field label="Period">
                  <select
                    name="salaryPeriod"
                    defaultValue={job.salaryPeriod}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {(Object.keys(salaryPeriodLabels) as (keyof typeof salaryPeriodLabels)[]).map(
                      (period) => (
                        <option key={period} value={period}>
                          {salaryPeriodLabels[period]}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </div>

              <label className="text-secondary flex cursor-pointer items-start gap-2 text-caption">
                <input
                  type="checkbox"
                  name="salaryPublic"
                  defaultChecked={job.salaryPublic}
                  onChange={(event) => setShowSalary(event.target.checked)}
                  className="accent-brand mt-0.5 size-4 cursor-pointer"
                />
                <span>
                  Show the range on the careers page
                  <span className="text-muted block text-tiny">
                    {showSalary
                      ? "Listings with a visible range attract more applicants."
                      : "Hidden ranges are still used internally for offers."}
                  </span>
                </span>
              </label>
            </div>
          </Panel>

          <Panel title="Hiring" icon={RiUserStarLine}>
            <div className="flex flex-col gap-3">
              <Field label="Hiring manager">
                <select
                  name="hiringManagerId"
                  defaultValue={job.hiringManagerId ?? ""}
                  className={cn(inputClass, "cursor-pointer")}
                >
                  <option value="">Unassigned</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="How to apply">
                <select
                  name="applyMethod"
                  value={applyMethod}
                  onChange={(event) =>
                    setApplyMethod(event.target.value as keyof typeof applyMethodLabels)
                  }
                  className={cn(inputClass, "cursor-pointer")}
                >
                  {(Object.keys(applyMethodLabels) as (keyof typeof applyMethodLabels)[]).map(
                    (method) => (
                      <option key={method} value={method}>
                        {applyMethodLabels[method]}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              {applyMethod !== "portal" ? (
                <Field label={applyMethod === "email" ? "Applications email" : "Application URL"}>
                  <input
                    name="applyValue"
                    type={applyMethod === "email" ? "email" : "url"}
                    defaultValue={job.applyValue ?? ""}
                    placeholder={
                      applyMethod === "email" ? "jobs@cvspan.com" : "https://…"
                    }
                    className={inputClass}
                  />
                </Field>
              ) : (
                <input type="hidden" name="applyValue" value="" />
              )}
            </div>
          </Panel>

          <Panel title="Skills" icon={RiPriceTag3Line}>
            <TagField
              name="skills"
              initial={job.skills}
              suggestions={skillSuggestions}
              placeholder="Add a skill, press Enter"
            />
          </Panel>

          <p className="text-muted text-tiny">
            Listings read better when the first section says what the person will own, not what the
            company does. Keep requirements to what is genuinely required.
          </p>
        </aside>
      </div>
    </form>
  );
}
