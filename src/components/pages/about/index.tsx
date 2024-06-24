import React from 'react';

import Aboutlanding from '@/components/molecules/Aboutlanding/Aboutlanding';
import { HowweWork } from '@/components/molecules/HowWeWork';
import { OurTeam } from '@/components/molecules/OurTeam';
import Achievements from '@/components/molecules/achievements';

export default function Aboutpage() {
    return (
        <>
            <Aboutlanding />
            <HowweWork />
            <OurTeam />
            <Achievements />
        </>
    );
}
