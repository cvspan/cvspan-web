import Openposition from '@/components/molecules/Openpositions/Openposition';
import Positionslanding from '@/components/molecules/Positionslanding/Positionslanding';
import React from 'react';

type Props = {};

const page = (props: Props) => {
    return (
        <div>
            <Positionslanding />
            <Openposition />
        </div>
    );
};

export default page;
