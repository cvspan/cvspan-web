import React from 'react';
import Image from 'next/image';

import Frame from '../../../../public/assets/images/Frame 1618868713.png';

const UIlanding = ({
    title = 'UI/UX Product Design Services',
    description = 'As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.',
}: {
    title?: string;
}) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <div className="flex w-[1200px] items-center justify-between gap-32">
                    <div className="words w-1/2 space-y-[32px]">
                        <h1 className="font-pp-mori text-[70px] font-semibold leading-[78px] text-white">{title}</h1>
                        <p className="font-eudoxus text-[18px] font-normal leading-[26px] text-white">{description}</p>
                    </div>
                    <div className="image w-1/2">
                        <Image src={Frame} alt="elipse_image" className="h-[506px] w-[502px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIlanding;
