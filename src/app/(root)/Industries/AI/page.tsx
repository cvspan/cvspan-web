import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'UI/UX Product Design Services'}
                subHeading={
                    "As a UI/UX design company, we develop profitable digital solutions that balance customer demands with organisational objectives. Our approach to human-centered design makes it possible."
                }
            />
        </>
    );
};

export default page;
