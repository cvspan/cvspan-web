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
                bannerImage="/assets/images/headers/services/mobile-development.svg"
                Heading={'Mobile Development Services'}
                subHeading={`As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.`}
            />

            <SharedFeaturesComponent
                intro="Empower your business with a mobile solution that stands out in today's competitive market. Partner with us for your mobile development needs, and let us help you create a powerful and engaging app that drives growth and enhances your digital presence."
                title="Mobile Development Services we offer"
                arrayOfFeatures={services['mobile developemnt'].summary}
                description="In an increasingly mobile-first world, having a robust and engaging mobile presence is essential for businesses to connect with their customers and stay ahead of the competition. Our mobile development services are designed to help you create high-quality, user-friendly mobile applications that deliver exceptional user experiences and drive business growth."
            />
            {/* <CustomizableDesign /> */}
            <GetThings
                title="Benefits of our Mobile Development Services"
                products={[
                    {
                        id: 1,
                        title: 'Innovation',
                        text: 'We stay at the forefront of mobile technology trends and leverage the latest tools and frameworks to build innovative and future-ready apps.',
                    },
                    {
                        id: 2,
                        title: 'User-Centric Approach',
                        text: 'We prioritize the needs of your users, ensuring that your app delivers an exceptional experience that drives engagement and retention.',
                    },
                    {
                        id: 3,
                        title: 'Agile Methodology',
                        text: 'We use agile development practices to deliver high-quality mobile applications on time and within budget, allowing for flexibility and continuous improvement.',
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
