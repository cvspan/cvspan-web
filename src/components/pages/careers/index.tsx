import React from 'react';

import { OurPeople } from '@/components/molecules/OurPeople';
import { OurVisionAndMission } from '@/components/molecules/OurMissionAndVision';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Careerlanding from '@/components/molecules/CareerLanding/Careerlanding';
import FactsAndFigures from '@/components/molecules/FactsAndFigures';

import StoriesCard from '@/components/molecules/Stories/StoriesCard';
export default function CareersPage() {
    return (
        <>
            <Navbar light />
            <Careerlanding />
            <FactsAndFigures />
            <OurPeople />
            <OurVisionAndMission />
            <StoriesCard />
            <Footer />
        </>
    );
}
