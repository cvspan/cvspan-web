import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Website Design & Development Services'}
                subHeading={
                    "Your website should not confuse, but rather convert, its visitors. A perfect combination of good user experience and appealing design can spark growth we'll help you get there."
                }
            />
        </>
    );
};

export default page;
