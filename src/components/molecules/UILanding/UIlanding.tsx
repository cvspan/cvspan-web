import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Frame from '../../../../public/assets/images/Frame 1618868713.png';

type Props = {};

const UIlanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <div className="flex w-[1200px] items-center justify-between gap-32 ">
                    <div className="words w-1/2 space-y-[32px] ">
                        <h1 className="text-white text-[70px] leading-[78px] font-pp-mori font-semibold ">UI/UX Product Design Services</h1>
                        <p className="text-white text-[18px] leading-[26px] font-normal font-eudoxus">As a UI/UX design agency, we create successful digital products that combine user needs with business goals. Our human centred design approach makes it happen.</p>
                    </div>
                    <div className="image w-1/2">
                        <Image src={Frame} alt="elipse_image" className='w-[502px] h-[506px] ' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIlanding;
