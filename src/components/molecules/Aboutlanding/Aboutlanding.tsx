import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Brands from './Brands';

type Props = {};

const Aboutlanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <h1 className="w-[1012px] text-center font-pp-mori text-[70px] font-[600] leading-[78px] text-white">
                    We provide innovative design solutions & expert talents
                </h1>
                <p className="w-[615px] text-center font-eudoxus text-[18px] leading-[26px] text-white">
                    From a small team of five people to a leading global remote team of professional designers &
                    developers that strive to develop valuable digital products for people worldwide.
                </p>
                <div className="">
                    <Brands />
                </div>
            </div>
        </div>
    );
};

export default Aboutlanding;
