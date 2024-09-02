import React from 'react';
import { OurTeamList } from './OurTeamList';
import { OurTeamHeader } from './OurTeamHeader';
import { Team } from './types';

const TEAM: Team[] = [
    {
        id: 1,
        name: 'Moses Arfo',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
    {
        id: 2,
        name: 'Tobi Olowu',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
    {
        id: 3,
        name: 'Charles Eshimokhai',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
    {
        id: 4,
        name: 'David Arfo',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
    {
        id: 5,
        name: 'Vivian Adams',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
    {
        id: 6,
        name: 'Moses Arfo',
        role: 'Founder & CEO',
        avatar: '',
        linkedin: '/',
    },
];

export const OurTeam = () => {
    return (
        <section>
            <div className="bg-white px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                    <OurTeamHeader />
                    <OurTeamList teams={TEAM.slice(0, 4)} />
                </div>
            </div>
        </section>
    );
};
