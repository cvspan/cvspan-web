import React from 'react';

import { OurPeople } from '@/components/molecules/OurPeople';
import { OurVisionAndMission } from '@/components/molecules/OurMissionAndVision';

import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Careerlanding from '@/components/molecules/CareerLanding/Careerlanding';
import CTA_OPenPositions from '@/components/molecules/CTA_OPenPositions';
import PerksAndBenefits from '@/components/molecules/perksAndBenefits';
import OurValues from '@/components/molecules/values/OurValues';

import FactsAndFigures from '@/components/molecules/FactsAndFigures';

export default function CareersPage() {
    return (
        <>
            <Navbar />
            <Careerlanding />
            <FactsAndFigures
                title="Join a native remote company"
                description={`CVSpan has operated as a fully remote organization since its inception, expanding our team without geographical or cultural limitations. Our business is remote-first in every aspect, prioritizing clear communication, well-defined expectations, and shared goals.`}
                card1Number={80}
                card2Number={56}
                card3Number={1}
                card4Number={28}
                containerBackground="/assets/images/backgrounds/careers-figures-bg.webp"
            />
            <OurPeople />
            <OurVisionAndMission />
            <OurValues />
            <PerksAndBenefits />
            <CTA_OPenPositions />
            <Footer />
        </>
    );
}
