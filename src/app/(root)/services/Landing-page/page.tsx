'use client';
import { design } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import GetThings from '@/components/molecules/GetThings';
import { services } from '@/components/molecules/arrayOfFeatures/arrays';

const LandingPage = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/services/landing-page.svg"
                Heading={'Landing page design services'}
                subHeading={`Our landing page design firm will assist you in increasing your internet visibility, generating more leads, and converting them into repeat clients.`}
            />

            <SharedFeaturesComponent
                intro="Transform your marketing efforts with high-performing landing pages that capture attention, drive conversions, and boost your business growth. Partner with us to design landing pages that deliver measurable results and enhance your digital marketing strategy."
                title="Landing page design services we offer"
                description="Your landing page is often the first interaction potential customers have with your brand. A well-designed landing page not only captures attention but also drives conversions by delivering a clear, compelling message and guiding visitors toward a specific action. Our landing page design services are crafted to help you maximize your marketing efforts and achieve your business objectives with high-impact, conversion-optimized pages."
                arrayOfFeatures={services['landing page'].summary}
            />
            {/* <CustomizableDesign /> */}
            <GetThings
                title="Benefits of our Landing Page Design Services"
                products={[
                    {
                        id: 1,
                        title: 'Expert Designers',
                        text: 'Our team of experienced designers specializes in creating high-converting landing pages that are visually appealing and strategically optimized for your target audience.',
                    },
                    {
                        id: 2,
                        title: 'Fast Turnaround',
                        text: 'We understand the importance of timely marketing campaigns and are committed to delivering high-quality landing pages on time and within budget.',
                    },
                    {
                        id: 3,
                        title: 'Data-Driven Approach',
                        text: 'We leverage data and analytics to inform our design decisions, ensuring that your landing pages are optimized for maximum performance and conversions.',
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

export default LandingPage;
