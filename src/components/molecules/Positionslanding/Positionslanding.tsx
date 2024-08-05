import React from 'react';
import Image from 'next/image';

type Props = {};

const Positionslanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <h1 className="w-[335px] text-center font-pp-mori text-[48px] font-[400] leading-[56px] text-white lg:w-[1012px] lg:text-[96px] lg:font-[600] lg:leading-[103.65px]">
                    Check our <br /> open positions
                </h1>
            </div>
        </div>
    );
};

export default Positionslanding;
