import React from 'react';
import { OurTeamItem } from './OurTeamItem';
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

export const OurTeamList = () => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="grid grid-cols-4 gap-5 sm:grid-cols-8 lg:grid-cols-12 lg:gap-12">
                    {TEAM.map((item: Team, i: number) => (
                        <OurTeamItem item={item} key={i} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
