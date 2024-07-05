import React from 'react';

import { OurPeople } from '@/components/molecules/OurPeople';
import { OurVisionAndMission } from '@/components/molecules/OurMissionAndVision';
import CareerJoinUs from '@/components/molecules/careerJoinUs/CareerJoinUs';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Careerlanding from '@/components/molecules/CareerLanding/Careerlanding';

import PerksAndBenefits from '@/components/molecules/perksAndBenefits';
import OurValues from '@/components/molecules/values/OurValues';
import OpenPosition from '@/components/molecules/openPosition';
export default function CareersPage() {
    return (
        <>
            <Navbar light />
            <Careerlanding />
            <CareerJoinUs />
            <OurPeople />
            <OurVisionAndMission />
            <OurValues />
            <PerksAndBenefits />
            <OpenPosition />
            <Footer />
        </>
    );
}
