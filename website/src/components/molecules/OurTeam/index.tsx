import React from 'react';
import { OurTeamList } from './OurTeamList';
import { OurTeamHeader } from './OurTeamHeader';
import type { Team } from './types';

export const OurTeam = ({ teams }: { teams: Team[] }) => {
    return (
        <section>
            <div className="bg-white px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                    <OurTeamHeader />
                    <OurTeamList teams={teams.slice(0, 4)} />
                </div>
            </div>
        </section>
    );
};
