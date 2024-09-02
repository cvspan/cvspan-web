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
import CustomizableDesign from '@/components/molecules/customizableDesign/CustomizableDesign';
import GetThings from '@/components/molecules/GetThings';

const Page = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                Heading={'Web3 design agency with cutting-edge solutions'}
                subHeading={`We offer design solutions that simplify your complex blockchain product, making it intuitive, user-friendly, transparent, and trustworthy.`}
            />

            <SharedFeaturesComponent
                intro="Leveraging our expertise in blockchain, decentralized applications, cryptocurrency, and immersive experiences, along with powerful digital design, we assist brands in transforming their customer interactions."
                title="How we design Web3 products that meet all user requirements "
                arrayOfFeatures={industries.web3.summary}
                description="Our mission is to make Web3 accessible to everyday people, build crypto communities, and enable businesses to harness blockchain technology. No matter what blockchain solution you want to introduce, we ensure it resonates with your audience and helps you establish a strong market presence."
            />
            {/* <CustomizableDesign /> */}
            <GetThings title="Web3 products that our team can develop" products={industries.web3.products} />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default Page;
