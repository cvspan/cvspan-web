'use client';
import React from 'react';
import { industries } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';

import GetThings from '@/components/molecules/GetThings';

const Page = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/industries/saas.svg"
                Heading={'Scale your product with professional SaaS Design'}
                subHeading={`Our skilled product designers are used to develop fresh SaaS offerings, enhance or revamp current ones, and propel your company forward.`}
            />

            <SharedFeaturesComponent
                intro="As a SaaS product design agency, we've specialized in developing B2B and B2C web applications, dashboards, mobile-first SaaS, and B2B SaaS websites across various industries. Our experience spans collaboration tools, CRMs, management applications, entertainment, and educational SaaS. Now, we are pushing the boundaries by incorporating AI and machine learning into SaaS web design."
                title="How we create SaaS products that meet all user requirements "
                arrayOfFeatures={industries.saas.summary}
                description="Our SaaS web design company expertly combines user needs and corporate objectives to produce a compelling UX design."
            />
            {/* <CustomizableDesign /> */}
            <GetThings title="SaaS products that our team can develop" products={industries.saas.products} />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default Page;
