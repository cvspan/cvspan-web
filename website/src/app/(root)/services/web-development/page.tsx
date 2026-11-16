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

const Page = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/services/web-development.svg"
                Heading={'Web Development Services'}
                subHeading={`As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.`}
            />

            <SharedFeaturesComponent
                intro="Elevate your digital presence with a website that not only looks great but also delivers exceptional performance and functionality. Partner with us to build a web solution that drives growth, engages users, and enhances your brand’s online presence."
                title="Web Development Services we offer "
                arrayOfFeatures={services['web develpment'].summary}
                description="A compelling and effective web presence is essential for businesses to succeed in today’s digital landscape. Our web development services are designed to create robust, scalable, and secure websites that deliver exceptional user experiences and drive business growth. Whether you need a brand-new website, a redesign, or enhancements to your existing site, our team is here to help you achieve your digital goals."
            />
            {/* <CustomizableDesign /> */}
            <GetThings
                title="Benefits of our Web Development Services"
                products={[
                    {
                        id: 1,
                        title: 'Expert Team',
                        text: 'Our team of skilled developers, designers, and strategists brings extensive experience in delivering high-quality web solutions across various industries.',
                    },
                    {
                        id: 2,
                        title: 'Cutting-Edge Technology',
                        text: 'We stay up-to-date with the latest web development trends and technologies to provide innovative and future-proof solutions.',
                    },
                    {
                        id: 3,
                        title: 'End-to-End Services',
                        text: 'From initial concept and design to development, testing, deployment, and ongoing support, we offer comprehensive web development services to meet all your needs.',
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

export default Page;
