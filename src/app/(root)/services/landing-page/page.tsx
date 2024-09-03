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
import CustomizableDesign from '@/components/molecules/customizableDesign/CustomizableDesign';
import GetThings from '@/components/molecules/GetThings';

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
                intro="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                title="Discover the benefits of professional UIUX design service "
                arrayOfFeatures={design}
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
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
