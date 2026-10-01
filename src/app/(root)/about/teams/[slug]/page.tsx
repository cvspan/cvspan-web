import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EmployeePage from '@/components/pages/about/team';
import { Team } from '@/components/molecules/OurTeam/types';
import { TEAMS } from '@/components/ui/data';
import { buildMetadata } from '@/lib/seo/metadata';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const employee: Team | undefined = TEAMS.find((team: Team) => team?.id === params?.slug);
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
export function generateStaticParams() {
    return TEAMS.map((team: Team) => ({ slug: team.id }));
}

export default function Page({ params }: Props) {
    const employee: Team | undefined = TEAMS.find((team: Team) => team?.id === params?.slug);
    if (!employee) notFound();

    return <EmployeePage team={employee} />;
}
