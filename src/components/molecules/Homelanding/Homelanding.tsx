import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Ribbon from '../../../../public/Ribbon-2.png';
import Button from '../Button';

type Props = {};

const Homelanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="relative flex h-full w-full items-center justify-center space-y-6 md:justify-start">
                <div className="w-[335px] space-y-8 md:w-[941px] lg:ml-[120px]">
                    <h1 className="text-center font-pp-mori text-[67px] font-thin leading-[72.36px] text-white md:text-left md:text-[120px] md:leading-[129.6px]">
                        We <span className="font-semibold">Create Awesome</span> Stuff
                    </h1>
                    <p className="font-Exodus md:text-[18px]md:leading-[26px] text-center text-[16px] font-normal leading-[24px] text-white md:text-left">
                        Our experts accompany our Clients from the private and public sector in their <br /> digital
                        transformation journey by providing business value solutions
                    </p>
                    <div className="flex w-full flex-col gap-6 md:flex-row lg:w-[400px]">
                        <Button background="white" title="OUR SERVICES" height="56px" fullWidth />

                        <Button background="transparent" title="GET STARTED" height="56px" fullWidth />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-[959.12px] rotate-[21.43] overflow-hidden lg:w-auto">
                <Image src={Ribbon} alt="elipse" className="lg:w-auto" />
            </div>
        </div>
    );
};

export default Homelanding;
