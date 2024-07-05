import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';

type Props = {};

const Positionslanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <h1 className="w-[1012px] text-center font-pp-mori text-[96px] font-[600] leading-[103.65px] text-white">
                    Check our <br /> open positions
                </h1>
            </div>
        </div>
    );
};

export default Positionslanding;
