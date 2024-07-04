import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Webflow Design & Development Services'}
                subHeading={
                    "As a certified Webflow partner, our developers understand how to create fully responsive and functioning websites that provide an exceptional user experience."
                }
            />
        </>
    );
};

export default page;
