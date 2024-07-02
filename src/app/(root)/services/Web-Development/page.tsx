import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'UI/UX Product Design Services'}
                subHeading={
                    "As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen."
                }
            />
        </>
    );
};

export default page;
