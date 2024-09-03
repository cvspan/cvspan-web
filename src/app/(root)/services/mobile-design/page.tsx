'use client';
import { mobiledesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import GetThings from '@/components/molecules/GetThings';

const MobileDesign = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/services/mobile-design.svg"
                Heading={'Mobile app design services'}
                subHeading={`Is your app design losing you users? They struggle with poor user experience and strange pop-ups. You need to act quickly before they erase it permanently. We can resolve this for you.`}
            />

            <SharedFeaturesComponent
                intro="Is your app's UX buried under unnecessary features? It frustrates and leads your users to churn. Stop losing them by giving the experience they desire. "
                title="Mobile app solutions we offer!"
                arrayOfFeatures={mobiledesign}
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users."
            />

            <GetThings
                title="Benefits of our Mobile Design Services"
                products={[
                    {
                        id: 1,
                        title: 'Intuitive mobile design for the user',
                        text: 'It is crucial for us to understand how your users interact with your app so that everything they need is clear and intuitive for them.',
                    },
                    {
                        id: 2,
                        title: 'Engaging app user experience',
                        text: 'Our mobile ui ux design services tend to keep your users engaged and captivated which leads to higher user retention.',
                    },
                    {
                        id: 3,
                        title: 'App design that reflects your brand',
                        text: 'We design mobile applications that reflect your brand, make it recognizable among users and competitive on the market.',
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

export default MobileDesign;
