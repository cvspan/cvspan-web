'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/molecules/Button';
import PortalHtml from '@/components/molecules/PortalContent/PortalHtml';
import { ANIMATE_PROPS } from '@/helpers/motion';
import type { PortalJobDetail } from '@/lib/portal';
import ApplyForm from './ApplyForm';

/** Where the "Apply here" button goes: the form below, an email, or an external page. */
function applyHref(job: PortalJobDetail) {
    if (job.apply.method === 'email' && job.apply.target) return `mailto:${job.apply.target}`;
    if (job.apply.method === 'url' && job.apply.target) return job.apply.target;
    return '#apply';
}

const ApplyButton = ({ job }: { job: PortalJobDetail }) => (
    <Link href={applyHref(job)}>
        <Button
            fullWidth
            height="56px"
            title="APPLY HERE"
            rightIcon={'/assets/images/arrowUp.svg'}
            animateRightIconOnHover
            rightIconSize="24px"
        />
    </Link>
);

/** A role published from the CVSpan Portal. Mirrors the layout of the original hand-written role pages. */
const PortalJobDetailView = ({ job }: { job: PortalJobDetail }) => {
    const facts = [
        job.employmentLabel,
        job.seniorityLabel,
        job.experience,
        job.location ?? job.workModeLabel,
        job.language,
    ]
        .filter(Boolean)
        .filter((fact, index, all) => all.indexOf(fact) === index) as string[];

    return (
        <section className="py-[80px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] px-[16px] lg:flex-row">
                <motion.div
                    {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                    className="hidden h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:flex lg:h-[264px] lg:max-w-[200px]"
                >
                    <ApplyButton job={job} />
                </motion.div>

                <div className="ml-auto w-full pt-[60px] lg:max-w-[800px] lg:pt-0">
                    <div className="mb-[32px]">
                        <h1 className="mb-3 font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:text-[60px] lg:leading-[64px]">
                            {job.title}
                        </h1>
                        {job.department && (
                            <span className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]">
                                {job.department.name}
                            </span>
                        )}
                        <ul className="mt-6 flex flex-wrap gap-[8px]">
                            {facts.map((fact) => (
                                <li
                                    key={fact}
                                    className="rounded-[20px] bg-[#F4F4F4] px-3 py-2 font-eudoxus text-[14px] font-medium text-[#1A1A1A]"
                                >
                                    {fact}
                                </li>
                            ))}
                            {job.salary && (
                                <li className="rounded-[20px] bg-[#F4F4F4] px-3 py-2 font-eudoxus text-[14px] font-medium text-[#1A1A1A]">
                                    {job.salary.display}
                                </li>
                            )}
                        </ul>
                    </div>

                    {job.summary && (
                        <p className="mb-8 font-eudoxus text-[18px] leading-[28px] text-[#1a1a1a]">{job.summary}</p>
                    )}

                    <PortalHtml html={job.descriptionHtml} />

                    {job.skills.length > 0 && (
                        <div className="mt-10">
                            <p className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]">
                                Skills
                            </p>
                            <ul className="flex flex-wrap gap-[8px]">
                                {job.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="rounded-[20px] border-[1px] border-[#D1D1D1] px-3 py-1 font-eudoxus text-[14px] text-[#484848]"
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.closingDate && (
                        <p className="mt-10 font-eudoxus text-[14px] text-[#484848]">
                            Applications close on{' '}
                            {new Date(job.closingDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                            .
                        </p>
                    )}

                    {job.apply.method === 'portal' && (
                        <div className="mt-12 border-t-[1px] border-[#D1D1D1] pt-10">
                            <ApplyForm slug={job.slug} title={job.title} />
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-50 mt-[60px] w-full border-t-[1px] border-[#D1D1D1] bg-white p-4 lg:hidden">
                <ApplyButton job={job} />
            </div>
        </section>
    );
};

export default PortalJobDetailView;
