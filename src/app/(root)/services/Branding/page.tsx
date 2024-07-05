import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Brand Design & Consulting Services'}
                subHeading={
                    "You want your brand to sparkle and capture your target audience. But how do you do this? By telling a distinctive, memorable, and captivating tale that connects with people. And that is exactly what we assist you with."
                }
            />
        </>
    );
};

export default page;
