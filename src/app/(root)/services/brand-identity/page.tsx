import { brandIdentity } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

import Navbar from '@/components/molecules/layout/navbar';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';
import Footer from '@/components/molecules/layout/footer';
import Faqs from '@/components/molecules/FAQS';
import Testimonials from '@/components/molecules/Testimonials';
import Cta from '@/components/molecules/CTA';
import WhatToExpect from '@/components/molecules/whatToExpect/WhatToExpect';
import GetThings from '@/components/molecules/GetThings';

const BrandIdentity = () => {
    return (
        <>
            <Navbar light={false} />
            <Landing
                Heading={'Brand Design & Consulting Services'}
                subHeading={`You want your brand to sparkle and capture your target audience. But how do you do this? By telling a distinctive, memorable, and captivating tale that connects with people. And that is exactly what we assist you with.`}
            />

            <SharedFeaturesComponent
                intro="A unique identity is more than just a logo. It’s a story, a message, a promise. Make your brand memorable by creating an identity that resonates with your audience. "
                title="Brand design solutions we offer!"
                arrayOfFeatures={brandIdentity}
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users. "
            />

            <WhatToExpect />
            <GetThings title="Benefits of our Design Services" />
            <Faqs />
            <Testimonials />
            <Cta />
            <Footer />
        </>
    );
};

export default BrandIdentity;
