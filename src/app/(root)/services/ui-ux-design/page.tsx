'use client';

import React from 'react';

import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import { uiux } from '@/components/molecules/arrayOfFeatures/arrays';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import WhatToExpect from '@/components/molecules/whatToExpect/WhatToExpect';
import GetThings from '@/components/molecules/GetThings';

const UIUXDesign = () => {
    return (
        <>
            <Navbar />
            <Landing
                bannerImage="/assets/images/headers/services/uiux-design.svg"
                Heading={'UI/UX Product Design Services'}
                subHeading={
                    'As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.'
                }
            />

            <SharedFeaturesComponent
                intro="We design intuitive UI UX solutions that connect you with your audience. Whether it's a website, an app, or a product, we make it easy and engaging."
                title="The scope of our UI/UX design solutions"
                description="The scope of UI/UX design solutions typically encompasses a wide range of activities and deliverables aimed at creating intuitive, engaging, and aesthetically pleasing user interfaces. Here are some key aspects that fall within this scope"
                arrayOfFeatures={uiux}
            />
            <WhatToExpect />
            <GetThings title="Benefits of our Design Services" />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default UIUXDesign;
