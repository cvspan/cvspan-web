import React from 'react';
import { OurTeamItem } from './OurTeamItem';
import { Team } from './types';

export const OurTeamList = ({ teams }: { teams: Team[] }) => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="grid grid-cols-4 gap-6 sm:grid-cols-8 lg:grid-cols-12 lg:gap-12">
                    {teams.map((item: Team, i: number) => (
                        <OurTeamItem item={item} key={i} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
