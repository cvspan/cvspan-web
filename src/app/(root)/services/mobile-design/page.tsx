import { mobiledesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const MobileDesign = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="Is your app's UX buried under unnecessary features? It frustrates and leads your users to churn. Stop losing them by giving the experience they desire. "
                title="Mobile app solutions we offer!"
                arrayOfFeatures={mobiledesign}
                description="As a design agency that specializes in mobile app solutions, our offerings are designed to create intuitive, engaging, and high-performing applications that meet the specific needs of your clients and their target users."
            />
        </section>
    );
};

export default MobileDesign;
