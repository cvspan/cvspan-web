import React from 'react';
import { OurTeamList } from './OurTeamList';
import { OurTeamHeader } from './OurTeamHeader';

export const OurTeam = () => {
    return (
        <section>
            <div className="bg-white px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                    <OurTeamHeader />
                    <OurTeamList />
                </div>
            </div>
        </section>
    );
};
