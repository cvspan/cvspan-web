import React from 'react';
import UIlanding from '@/components/molecules/UILanding/UIlanding';
import Design from '@/components/molecules/design/page';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

const DesignPage = () => {
    return (
        <>
            {/* <UIlanding /> */}
            <Landing
                Heading={'UI/UX Product Design Services'}
                subHeading={
                    'As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.'
                }
            />
            <Design />
        </>
    );
};

export default DesignPage;
