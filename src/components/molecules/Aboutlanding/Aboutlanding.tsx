import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Brands from './Brands';
import Button from '../Button';

type Props = {};

const Aboutlanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="mx-auto flex w-[335px] flex-col items-center justify-center space-y-6 lg:w-[1012px]">
                    <h1 className="text-center font-pp-mori text-[32px] font-[500] leading-[42px] text-white lg:text-[70px] lg:font-[600] lg:leading-[78px]">
                        We provide innovative design solutions & expert talents
                    </h1>
                    <p className="w-full text-center font-eudoxus text-[16px] font-[400] leading-[24px] text-white lg:w-[615px] lg:text-[18px] lg:leading-[26px]">
                        From a small team of five people to a leading global remote team of professional designers &
                        developers that strive to develop valuable digital products for people worldwide.
                    </p>
                    <div className="flex w-full flex-col items-center justify-center space-y-4 lg:w-[400px] lg:flex-row lg:space-x-6">
                        <Button title="OUR SERVICES" fullWidth height="56px" background="white" />
                        <Button title="GET STARTED" fullWidth height="56px" background="transparent" />
                    </div>
                </div>

                <div className="absolute bottom-9">
                    <Brands />
                </div>
            </div>
        </div>
    );
};

export default Aboutlanding;
