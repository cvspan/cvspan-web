'use client';
import React from 'react';

import { mobiledesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import WhatToExpect from '@/components/molecules/whatToExpect/WhatToExpect';
import GetThings from '@/components/molecules/GetThings';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Navbar />
            <Landing
                Heading={'Webflow Design & Development Services'}
                subHeading={`As a certified Webflow partner, our developers understand how to create fully responsive and functioning websites that provide an exceptional user experience.`}
            />

            <SharedFeaturesComponent
                intro="Is your app's UX buried under unnecessary features? It frustrates and leads your users to churn. Stop losing them by giving the experience they desire. "
                title="Range of our Webflow design and development solutions"
                arrayOfFeatures={mobiledesign}
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users."
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

export default page;
