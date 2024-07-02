import React from 'react';
import Landing from '@/components/molecules/ReusableLandingSection/Landing';

type Props = {};

const page = (props: Props) => {
    return (
        <>
            <Landing
                Heading={'Mobile app design services'}
                subHeading={
                    "Is your app design losing you users? They struggle with poor user experience and strange pop-ups. You need to act quickly before they erase it permanently. We can resolve this for you."
                }
            />
        </>
    );
};

export default page;
