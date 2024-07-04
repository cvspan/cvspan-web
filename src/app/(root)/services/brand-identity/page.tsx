import { brandIdentity } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const BrandIdentity = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="A unique identity is more than just a logo. It’s a story, a message, a promise. Make your brand memorable by creating an identity that resonates with your audience. "
                title="Brand design solutions we offer!"
                arrayOfFeatures={brandIdentity}
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users. "
            />
        </section>
    );
};

export default BrandIdentity;
