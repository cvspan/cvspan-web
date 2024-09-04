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
                bannerImage="/assets/images/headers/services/devops.svg"
                Heading={'DevOps Services'}
                subHeading={`Optimize the flow of data and information in project development to reduce delivery costs, enhance automation, and accelerate digital transformation efforts.`}
            />

            <SharedFeaturesComponent
                intro="Transform your development processes and accelerate your digital transformation with our DevOps services. Partner with us to drive efficiency, innovation, and growth in your organization."
                title="Scope of our DevOps Services"
                description="In today's fast-paced digital landscape, organizations need to deliver high-quality software rapidly and reliably. Our comprehensive DevOps services are designed to bridge the gap between development and operations, enabling your teams to work seamlessly together, automate processes, and achieve continuous delivery."
                arrayOfFeatures={services.devops.summary}
            />
            {/* <CustomizableDesign /> */}
            <GetThings
                title="Benefits of our DevOps Services"
                products={[
                    {
                        id: 1,
                        title: 'Expertise',
                        text: 'Our team of seasoned DevOps professionals brings deep experience in implementing best practices across various industries.',
                    },
                    {
                        id: 2,
                        title: 'Tailored Solutions',
                        text: 'We understand that every organization is unique, and we customize our services to meet your specific needs and challenges.',
                    },
                    {
                        id: 3,
                        title: 'Scalability',
                        text: "Whether you're a startup or a large enterprise, our solutions are designed to scale with your business.",
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
