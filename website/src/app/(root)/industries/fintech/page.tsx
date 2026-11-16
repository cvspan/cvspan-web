'use client';
import { industries } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

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
                bannerImage="/assets/images/headers/industries/fintech.svg"
                Heading={'Our Fintech Design Covers Your Business Goals'}
                subHeading={`Our skilled designers are employed to simplify complicated items for end consumers. Work together with our fintech UI/UX design team to get excellent outcomes.`}
            />

            <SharedFeaturesComponent
                intro="Working with trade companies, investment startups, neobanks, and forward-thinking entrepreneurs, we strive to disrupt the norm by introducing financial innovations that seamlessly blend into daily routines."
                title="How we Develop Fintech products to meet every consumer requirement "
                arrayOfFeatures={industries.fintech.summary}
                description="As a FinTech design firm, we develop valuable user experiences that enable people and companies to invest, save, and do business in a convenient and modern way."
            />
            {/* <CustomizableDesign /> */}
            <GetThings title="Fintech products that our team can develop" products={industries.fintech.products} />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default Page;
