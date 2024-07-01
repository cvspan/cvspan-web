import React from 'react';
import UIlanding from '@/components/molecules/UILanding/UIlanding';
import Design from '@/components/molecules/design/page';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import { uiux } from '@/components/molecules/arrayOfFeatures/arrays';

const DesignPage = () => {
    return (
        <>
            <UIlanding />
            <SharedFeaturesComponent
                intro="We design intuitive UI UX solutions that connect you with your audience. Whether it's a website, an app, or a product, we make it easy and engaging."
                title="The scope of our UI/UX design solutions"
                description="The scope of UI/UX design solutions typically encompasses a wide range of activities and deliverables aimed at creating intuitive, engaging, and aesthetically pleasing user interfaces. Here are some key aspects that fall within this scope"
                arrayOfFeatures={uiux}
            />
        </>
    );
};

export default DesignPage;
