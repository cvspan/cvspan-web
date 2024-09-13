import React from 'react';
import type { Metadata } from 'next';
import EmployeePage from '@/components/pages/about/team';
import { Team } from '@/components/molecules/OurTeam/types';
import { TEAMS } from '@/components/ui/data';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const employee: Team | undefined = TEAMS.find((team: Team) => team?.id === params?.slug);

    return {
        title: employee?.name,
        description: employee?.role,
        openGraph: {
            images: [{ width: 600, height: 600, url: employee?.avatar || '', href: employee?.avatar || '' }],
        },
    };
}

export default function Page({ params }: Props) {
    const employee: Team | undefined = TEAMS.find((team: Team) => team?.id === params?.slug);

    return <EmployeePage team={employee} />;
}
