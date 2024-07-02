import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Graphic Design services'}
                subHeading={
                    "As a graphic design agency, we assist products in reflecting their company values through creative illustrations, icons, and marketing materials."
                }
            />
        </>
    );
};

export default page;
