import React from 'react';
import { OurTeamItem } from './OurTeamItem';
import { Team } from './types';

export const OurTeamList = ({ teams }: { teams: Team[] }) => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="grid grid-cols-1 gap-[16px] min-[550px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1040px]:grid-cols-4 xl:gap-[24px]">
                    {teams.map((item: Team, i: number) => (
                        <OurTeamItem item={item} key={i} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
