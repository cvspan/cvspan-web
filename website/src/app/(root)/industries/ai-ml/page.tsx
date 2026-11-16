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
                bannerImage="/assets/images/headers/industries/alml.svg"
                Heading={'Expert Designers for AI Products'}
                subHeading={`We provide design solutions that transform your sophisticated AI product into a digital experience that is transparent, trustworthy, easy to use, and intuitive.`}
            />

            <SharedFeaturesComponent
                intro="AI has gained immense popularity, with startups everywhere integrating it into their offerings. In this landscape, the emphasis has shifted from the technology itself to the unique experiences that set a product apart."
                title="How we design AI products that cater to user needs "
                arrayOfFeatures={industries['ai-ml'].summary}
                description="Our expertise in designing UX for AI and ML firms has refined our understanding of user requirements, allowing us to develop AI solutions that are truly impactful and meaningful."
            />
            {/* <CustomizableDesign /> */}
            <GetThings title="AI products that our team can develop" products={industries['ai-ml'].products} />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default Page;
