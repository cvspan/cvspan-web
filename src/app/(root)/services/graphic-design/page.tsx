'use client';
import { brandIdentity, graphicDesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import WhatToExpect from '@/components/molecules/whatToExpect/WhatToExpect';
import GetThings from '@/components/molecules/GetThings';

const GraphicDesign = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/services/graphic-design.svg"
                Heading={'Graphic Design services'}
                subHeading={`As a graphic design agency, we assist products in reflecting their company values through creative illustrations, icons, and marketing materials.`}
            />

            <SharedFeaturesComponent
                intro="A unique identity is more than just a logo. It’s a story, a message, a promise. Make your brand memorable by creating an identity that resonates with your audience."
                title="Graphic design solutions we offer!"
                arrayOfFeatures={graphicDesign}
                description="Our graphic design services take a deliberate approach to meeting clients' creative objectives while producing high-quality visuals that successfully communicate their message. This is a detailed description of how a graphic design service could be constructed."
            />

            <GetThings
                title="Benefits of our Graphic Design Services"
                products={[
                    {
                        id: 1,
                        title: 'Build trust & loyalty',
                        text: 'Professional graphic design builds trust and loyalty among users, establishes trustworthy brand image.',
                    },
                    {
                        id: 2,
                        title: 'High brand awareness',
                        text: 'Recognizable graphics will help your product to stay relevant and modern in the ever-changing digital space.',
                    },
                    {
                        id: 3,
                        title: 'Strengthen your brand',
                        text: 'Unique and memorable brand helps you to gain competitive advantage and set your brand apart from competitors.',
                    },
                ]}
            />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default GraphicDesign;
