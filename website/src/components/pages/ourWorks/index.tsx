'use client';

import React from 'react';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Cta from '@/components/molecules/CTA';
import OurWorksLanding from '@/components/molecules/OurWorksLanding/OurWorksLanding';
import CaseStudyCards from '@/components/molecules/caseStudyCards/index';

export default function OurWorksPage() {
    return (
        <>
            <Navbar />
            <OurWorksLanding />
            <CaseStudyCards />
            <Cta />
            <Footer />
        </>
    );
}
