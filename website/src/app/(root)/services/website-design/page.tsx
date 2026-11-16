'use client';
import React from 'react';
import { websitedesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';

import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Navbar from '@/components/molecules/layout/navbar';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import GetThings from '@/components/molecules/GetThings';

const WebsiteDesign = () => {
    return (
        <>
            <Navbar />
            <Landing
                bannerImage="/assets/images/headers/services/website-design.svg"
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

            <GetThings
                title="Benefits of our Web Design Services"
                products={[
                    {
                        id: 1,
                        title: 'Get strong web presence',
                        text: 'Improve your reputation and brand awareness, make your website memorable.',
                    },
                    {
                        id: 2,
                        title: 'Increase conversions',
                        text: 'Effectively convert your leads into customers and get higher profits with our website design company.',
                    },
                    {
                        id: 3,
                        title: 'Improve retention rates',
                        text: 'Your current customers will value your product and will provide a sustainable source of revenue.',
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

export default WebsiteDesign;
