'use client';
import React from 'react';
import EmployeePage from '@/components/pages/about/team';
import { Team } from '@/components/molecules/OurTeam/types';
import { TEAMS } from '@/components/ui/data';

function Page({ params }: { params: { slug: string } }) {
    const employee: Team | undefined = TEAMS.find((team: Team) => team.id === parseInt(params.slug));
    return <EmployeePage team={employee} />;
}

export default Page;
