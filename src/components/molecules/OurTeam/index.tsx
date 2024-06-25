import React from 'react';
import { OurTeamList } from './OurTeamList';
import { OurTeamHeader } from './OurTeamHeader';

export const OurTeam = () => {
    return (
        <section>
            <div className="bg-white">
                <div className="mx-auto w-full max-w-[1200px] py-[120px]">
                    <OurTeamHeader />
                    <OurTeamList />
                </div>
            </div>
        </section>
    );
};
