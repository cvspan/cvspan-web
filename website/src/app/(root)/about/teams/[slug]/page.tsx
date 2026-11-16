import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EmployeePage from '@/components/pages/about/team';
import { Team } from '@/components/molecules/OurTeam/types';
import { fetchTeam } from '@/lib/portal';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = {
    params: { slug: string };
};

// Profiles for people added in the portal after the last build are rendered on first visit, then cached.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const employee: Team | undefined = (await fetchTeam()).find((team: Team) => team?.id === params?.slug);
    const path = `/about/teams/${params.slug}`;

    // An unknown profile is a 404 in the page below, so keep it out of the index.
    if (!employee) {
        return buildMetadata({
            title: 'Team member not found',
            description: 'This profile does not exist.',
            path,
            noIndex: true,
        });
    }

    return buildMetadata({
        title: `${employee.name} — ${employee.role}`,
        description: `${employee.name} is ${employee.role} at CVSpan, a digital product design and development agency.`,
        path,
        image: employee.avatar || undefined,
    });
}

/** Every profile is built ahead of time, so each one is in the HTML crawlers fetch. */
export async function generateStaticParams() {
    return (await fetchTeam()).map((team: Team) => ({ slug: team.id }));
}

export default async function Page({ params }: Props) {
    const employee: Team | undefined = (await fetchTeam()).find((team: Team) => team?.id === params?.slug);
    if (!employee) notFound();

    return <EmployeePage team={employee} />;
}
