import { design } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const WebsiteDevelopment = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="Stop dealing with sloppy web builders. Webflow's visual interface enables entrepreneurs like you to develop professional websites in 7 days. We design; you shine. Are you ready to impress your users?"
                title="Range of our Webflow design and development solutions"
                arrayOfFeatures={design}
                description="Your website need more than just performance and security. It must be intuitive and simple to use. Webflow provides speed and security, so we provide the experience your users demand."
            />
        </section>
    );
};

export default WebsiteDevelopment;
