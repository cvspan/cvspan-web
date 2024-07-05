import React from 'react';
import { websitedesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';

import UIlanding from '@/components/molecules/UILanding/UIlanding';
import Design from '@/components/molecules/design/page';
import { uiux } from '@/components/molecules/arrayOfFeatures/arrays';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import WhatToExpect from '@/components/molecules/whatToExpect/WhatToExpect';
import GetThings from '@/components/molecules/GetThings';

const WebsiteDesign = () => {
    return (
        <>
            <Navbar light />
            <Landing
                Heading={'Website Design & Development Services'}
                subHeading={`Your website should not confuse, but rather convert, its visitors. A perfect combination of good user experience and appealing design can spark growth; we'll help you get there.`}
            />

            <section>
                <SharedFeaturesComponent
                    intro="You need a website that adapts to any screen size. No loading delays, no navigation issues, and no performance problems. Just results. That’s what we do."
                    title="Our comprehensive web design services"
                    arrayOfFeatures={websitedesign}
                    description="As a design agency offering comprehensive web design services, we aim to provide end-to-end solutions that enhance user experience, align with client goals, and drive business growth. Here's a highlight of what our web design services comprise."
                />
            </section>

            <GetThings title="Benefits of our Web Design Services" />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default WebsiteDesign;
