import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GlobalTeam from '@/components/molecules/GlobalTeam';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import PortalJobDetail from '@/components/molecules/PortalJobDetail';
import JsonLd from '@/components/seo/JsonLd';
import { fetchJob, type PortalJobDetail as Job } from '@/lib/portal';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, buildGraph, jobPostingSchema } from '@/lib/seo/structured-data';
import '@/components/pages/careers/specific-job/index.css';

/** Roles are published from the CVSpan Portal; a page is built on first visit and refreshed every minute. */
export const revalidate = 60;

type Params = { params: { slug: string } };

const EMPLOYMENT_TYPES: Record<Job['employmentType'], string> = {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    internship: 'INTERN',
    volunteer: 'VOLUNTEER',
    student: 'INTERN',
};

/** A job page that can't load (portal down) is treated as missing rather than crashing the build. */
async function loadJob(slug: string) {
    try {
        return await fetchJob(slug);
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const job = await loadJob(params.slug);
    if (!job)
        return buildMetadata({
            title: 'Role not found',
            description: 'This role is no longer open.',
            path: `/careers/${params.slug}`,
            noIndex: true,
        });

    return buildMetadata({
        title: `${job.title} — Careers`,
        description:
            job.summary ?? `Join CVSpan as ${job.title}. ${job.employmentLabel}, ${job.location ?? job.workModeLabel}.`,
        path: `/careers/${job.slug}`,
    });
}

export default async function PortalJobPage({ params }: Params) {
    const job = await loadJob(params.slug);
    if (!job) notFound();

    const path = `/careers/${job.slug}`;
    const graph = buildGraph([
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
            { name: job.title, path },
        ]),
        jobPostingSchema({
            title: job.title,
            description: job.summary ?? job.title,
            path,
            employmentType: EMPLOYMENT_TYPES[job.employmentType],
            datePosted: (job.postedAt ?? new Date().toISOString()).slice(0, 10),
        }),
    ]);

    return (
        <>
            <JsonLd data={graph} />
            <Navbar light showScrollWatcher />
            <PortalJobDetail job={job} />
            <GlobalTeam />
            <Footer />
        </>
    );
}
