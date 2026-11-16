'use client';
import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Button from '@/components/molecules/Button';

import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';
import useWindowSize from '@/hooks/general/useWindowSize';
import { PORTAL_API_URL, type PortalDepartment, type PortalJob } from '@/lib/portal';

type Listing = {
    title: string;
    language: string;
    level: string;
    experience: string;
    location: string;
    link: string;
    department: string;
};

const fromPortal = (job: PortalJob): Listing => ({
    title: job.title,
    language: job.language ?? 'English',
    level: job.employmentLabel,
    experience: job.experience ?? job.seniorityLabel,
    location: job.location ?? job.workModeLabel,
    link: job.slug,
    department: job.department?.name ?? 'Other',
});

const FALLBACK_LISTINGS: Listing[] = [
    {
        title: 'Front End Developer',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Remote Worldwide',
        link: 'front-end',
        department: 'Development',
    },
    {
        title: 'Graphic Designer',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Remote Worldwide',
        link: 'graphic-designer',
        department: 'Design',
    },
    {
        title: 'Human Resources (HR)',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Remote Worldwide',
        link: 'human-resource',
        department: 'Management',
    },
    {
        title: 'Social Media Manager',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Remote Worldwide',
        link: 'social-media-manager',
        department: 'Business Development',
    },
    {
        title: 'Marketing Manager',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Nigeria or Remote',
        link: 'marketing-manager',
        department: 'Marketing',
    },
    {
        title: 'SEO Manager',
        language: 'English',
        level: 'Internship',
        experience: '1-2 Years Experience',
        location: 'Nigeria or Remote',
        link: 'seo-manager',
        department: 'Development',
    },
    {
        title: 'Volunteers',
        language: 'English',
        level: 'Volunteering',
        experience: '0-2 Years Experience',
        location: 'Nigeria or Remote',
        link: 'volunteers',
        department: 'Project',
    },
];

const FALLBACK_FILTERS = ['Design', 'Development', 'Marketing', 'Business Development', 'Project', 'Management'];

export type OpenPositionsData = { jobs: PortalJob[]; departments: PortalDepartment[] };

/** `initial` is fetched on the server so the roles are in the page's HTML; without it the list loads in the browser. */
const Openposition = ({ initial = null }: { initial?: OpenPositionsData | null }) => {
    const [selected, setSelected] = useState<string>('All');
    /** null while loading; the portal's roles once they arrive; the built-in list if it can't be reached. */
    const [listings, setListings] = useState<Listing[] | null>(initial ? initial.jobs.map(fromPortal) : null);
    const [filters, setFilters] = useState<string[]>(
        initial
            ? initial.departments.filter((department) => (department.openRoles ?? 0) > 0).map((d) => d.name)
            : FALLBACK_FILTERS,
    );

    useEffect(() => {
        if (initial) return;
        const controller = new AbortController();
        fetch(`${PORTAL_API_URL}/careers`, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(String(response.status));
                return response.json() as Promise<{ jobs: PortalJob[]; departments: PortalDepartment[] }>;
            })
            .then(({ jobs, departments }) => {
                setListings(jobs.map(fromPortal));
                setFilters(departments.filter((department) => (department.openRoles ?? 0) > 0).map((d) => d.name));
            })
            .catch((error) => {
                if (error?.name !== 'AbortError') setListings(FALLBACK_LISTINGS);
            });
        return () => controller.abort();
    }, [initial]);

    const buttons = ['All', ...filters];

    const filteredListings =
        selected === 'All' ? listings ?? [] : (listings ?? []).filter((job) => job.department === selected);

    const { width } = useWindowSize();
    const smallDevice = width < 900;
    return (
        <>
            <section className="px-[16px] pt-[60px] lg:pt-[120px]">
                <div className="mx-auto mb-[32px] max-w-[1200px] border-b-[1px] border-b-[#A3A3A3] pb-[32px] lg:mb-[40px] lg:pb-[60px]">
                    <p className="font-eudoxus text-[16px] text-[#1A1A1A]">Filter by departments</p>

                    <div className="mt-[24px] flex w-full flex-wrap items-center justify-start gap-[12px]">
                        {buttons.map((title) => {
                            const active = selected === title;
                            return (
                                <Button
                                    title={title}
                                    key={title}
                                    height="56px"
                                    onClick={() => setSelected(title)}
                                    background={active ? 'dark' : 'white-with-border'}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="px-[16px] pb-[60px] lg:pb-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: smallDevice ? 'bottom' : 'left' })}
                        className="flex h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:h-[264px] lg:max-w-[300px]"
                    >
                        <p className="mb-[24px] font-eudoxus text-[34px] font-medium leading-[42px] text-[#1A1A1A]">
                            Open Positions
                        </p>

                        <p className="font-eudoxus text-[14px] leading-[24px] text-[#484848]">
                            Become a part of our growing team and contribute to building innovative digital solutions
                            for clients worldwide. We look forward to hearing from you and potentially welcoming you to
                            our team!
                        </p>
                    </motion.div>
                    <div className="ml-auto w-full lg:max-w-[800px]">
                        <div className="flex flex-col gap-[20px]">
                            {listings === null && (
                                <div
                                    className="flex flex-col gap-[20px]"
                                    aria-busy="true"
                                    aria-label="Loading open positions"
                                >
                                    {[0, 1, 2].map((item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse border-t-[1px] border-[#A3A3A3] pb-10 pt-10"
                                        >
                                            <div className="mb-[12px] h-[40px] w-3/4 rounded bg-[#F4F4F4]" />
                                            <div className="h-[20px] w-1/2 rounded bg-[#F4F4F4]" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {listings !== null && filteredListings.length === 0 && (
                                <div className="flex w-full gap-[12px] rounded-[8px] bg-[#F4F4F4] p-[24px]">
                                    <img src="/assets/icons/info-circle.svg" alt="" loading="lazy" decoding="async" />
                                    <p className="text-[16px] font-normal leading-[24px] text-[#1A1A1A]">
                                        We have no positions open at the moment. Check back later
                                    </p>
                                </div>
                            )}

                            {filteredListings.map((job, index) => (
                                <Link className="cursor-pointer" href={`/careers/${job.link}`} key={index}>
                                    <motion.div
                                        {...ANIMATE_PROPS({
                                            delay: 0.05 * index,
                                            from: smallDevice ? 'bottom' : 'right',
                                        })}
                                        whileHover="on_hover"
                                        className={`flex items-start justify-between pb-10 ${
                                            index !== 0 ? 'border-t-[1px] border-[#A3A3A3] pt-10' : ''
                                        }`}
                                    >
                                        <div className="">
                                            <h3 className="mb-[12px] font-eudoxus text-[24px] font-medium leading-[32px] lg:text-[48px] lg:leading-[56px]">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-[11px]">
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.language}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.level}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.experience}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative h-[22px] w-[22px]">
                                            <motion.img
                                                initial={{ x: 0, y: 0, opacity: 1 }}
                                                variants={{
                                                    on_hover: {
                                                        x: 20,
                                                        y: -30,
                                                        opacity: 0,
                                                        transition: { duration: 0.2 },
                                                    },
                                                }}
                                                src={'/assets/icons/arrow-top-right-gray-slim.svg'}
                                                alt="arrow"
                                                className="absolute h-[22px] w-[22px]"
                                            />

                                            <motion.img
                                                initial={{ x: -20, y: 30, opacity: 0 }}
                                                variants={{
                                                    on_hover: { x: 0, y: 0, opacity: 1, transition: { duration: 0.2 } },
                                                }}
                                                src={'/assets/icons/arrow-top-right-gray-slim.svg'}
                                                alt="arrow"
                                                className="absolute h-[22px] w-[22px]"
                                            />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Openposition;
