import React from 'react';
import Image from 'next/image';
import Elipse from '../../../public/Ellipse 1.png';

type Props = {};

const Aboutlanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full items-center justify-center space-y-6 flex-col">
                    <h1 className="text-[70px] font-[600] leading-[78px] text-white font-pp-mori w-[1012px] text-center">
                        We provide innovative design solutions & expert talents
                    </h1>
                    <p className="text-[18px] leading-[26px] w-[615px] text-white font-eudoxus text-center ">From a small team of five people to a leading global remote team of professional designers & developers that strive to develop valuable digital products for people worldwide.</p> 
            </div>
        </div>
    );
};

export default Aboutlanding;
