import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Landing page design services'}
                subHeading={
                    "Our landing page design firm will assist you in increasing your internet visibility, generating more leads, and converting them into repeat clients."
                }
            />
        </>
    );
};

export default page;
