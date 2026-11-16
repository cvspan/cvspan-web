'use client';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import GetThings from '@/components/molecules/GetThings';
import { industries } from '@/components/molecules/arrayOfFeatures/arrays';

const Page = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/industries/healthcare.svg"
                Heading={'Healthcare design solutions'}
                subHeading={`Engage our skilled designers to transform your complex healthcare product into an intuitive, straightforward, and effective user experience.`}
            />

            <SharedFeaturesComponent
                intro="By streamlining your health and wellness operations, CVSpan gives you the peace of mind to focus on strategic growth goals, knowing that your company is in capable hands."
                title="How we design healthcare products that meet all user requirements "
                description="As a Healthcare design firm, we develop valuable user experiences that enable people and companies to invest, save, and do business in a convenient and modern way."
                arrayOfFeatures={industries.health.summary}
            />
            {/* <CustomizableDesign /> */}
            <GetThings title="Healthcare products that our team can develop" products={industries.health.products} />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default Page;
