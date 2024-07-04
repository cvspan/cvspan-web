import { mobiledesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const Saas = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="You need a website that adapts to any screen size. No loading delays, no navigation issues, and no performance problems. Just results. That’s what we do."
                title="Our comprehensive web design services"
                arrayOfFeatures={mobiledesign}
                description="As a design agency offering comprehensive web design services, we aim to provide end-to-end solutions that enhance user experience, align with client goals, and drive business growth. Here's a highlight of what our web design services comprise."
            />
        </section>
    );
};

export default Saas;
