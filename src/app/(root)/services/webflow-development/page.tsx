'use client';
import React from 'react';

import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';

import GetThings from '@/components/molecules/GetThings';
import { services } from '@/components/molecules/arrayOfFeatures/arrays';
type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Navbar />
            <Landing
                bannerImage="/assets/images/headers/services/webflow-developement.svg"
                Heading={'Webflow Design & Development Services'}
                subHeading={`As a certified Webflow partner, our developers understand how to create fully responsive and functioning websites that provide an exceptional user experience.`}
            />

            <SharedFeaturesComponent
                intro="Is your app's UX buried under unnecessary features? It frustrates and leads your users to churn. Stop losing them by giving the experience they desire. "
                title="Range of our Webflow design and development solutions"
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users."
                arrayOfFeatures={services.webflow.summary}
            />

            <GetThings
                title="Benefits of our Design Services"
                products={[
                    {
                        id: 1,
                        title: 'Flexible collaboration & fixed monthly rate',
                        text: 'Once we’ve heard more about your goals and timeline, we’ll start assembling your team',
                    },
                    {
                        id: 2,
                        title: 'Hiring system with immediate start',

                        text: 'Your new development team will work tirelessly to deliver on your product vision',
                    },
                    {
                        id: 3,
                        title: 'Work directly with the designer',
                        text: 'Following release, we’ll easily scale your team to match your product’s success',
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

export default page;
