import Aboutlanding from '@/components/molecules/Aboutlanding/Aboutlanding';

import { HowweWork } from '@/components/molecules/HowWeWork';
import { OurTeam } from '@/components/molecules/OurTeam';
import React from 'react';

export default function Aboutpage() {
    return (
        <>
            <Aboutlanding />
            <HowweWork />
            <OurTeam />
        </>
    );
}
