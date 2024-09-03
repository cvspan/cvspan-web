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

const Page = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                bannerImage="/assets/images/headers/services/web-development.svg"
                Heading={'Web Development'}
                subHeading={`As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.`}
            />

            <SharedFeaturesComponent
                intro="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                title="Discover the benefits of professional UIUX design service "
                arrayOfFeatures={design}
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
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
