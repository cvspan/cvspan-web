import React from 'react';
import { OurTeamList } from './OurTeamList';
import { OurTeamHeader } from './OurTeamHeader';
import { TEAMS } from '@/components/ui/data';

export const OurTeam = () => {
    return (
        <section>
            <div className="bg-white px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                    <OurTeamHeader />
                    <OurTeamList teams={TEAMS.slice(0, 4)} />
                </div>
            </div>
        </section>
    );
};
