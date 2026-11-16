'use client';
import Openposition, { type OpenPositionsData } from '@/components/molecules/Openpositions/Openposition';
import Positionslanding from '@/components/molecules/Positionslanding/Positionslanding';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import PerksAndBenefits from '@/components/molecules/perksAndBenefits';

const OpenPositionPage = ({ initial = null }: { initial?: OpenPositionsData | null }) => {
    return (
        <>
            <Navbar />
            <Positionslanding />
            <Openposition initial={initial} />
            <PerksAndBenefits />
            <Footer />
        </>
    );
};

export default OpenPositionPage;
