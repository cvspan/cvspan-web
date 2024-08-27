'use client';
import Openposition from '@/components/molecules/Openpositions/Openposition';
import Positionslanding from '@/components/molecules/Positionslanding/Positionslanding';
import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import PerksAndBenefits from '@/components/molecules/perksAndBenefits';

const page = () => {
    return (
        <>
            <Navbar />
            <Positionslanding />
            <Openposition />
            <PerksAndBenefits />
            <Footer />
        </>
    );
};

export default page;
