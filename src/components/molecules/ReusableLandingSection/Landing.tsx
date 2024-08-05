import React from 'react';
import Image from 'next/image';

import Frame from '../../../../public/assets/images/Frame 1618868713.png';
import Button from '../Button';

type Props = {
    Heading: String;
    subHeading: String;
};

const Landing = ({ Heading, subHeading }: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <div className="flex w-[335px] flex-col-reverse items-center justify-between gap-[38px] lg:w-[1200px] lg:flex-row">
                    <div className="words w-full space-y-[32px] lg:w-1/2">
                        <h1 className="text-center font-pp-mori text-[34px] font-medium leading-[42px] text-white lg:text-left lg:text-[70px] lg:font-semibold lg:leading-[78px]">
                            {Heading}
                        </h1>
                        <p className="text-center font-eudoxus text-[16px] font-normal leading-[24px] text-white lg:text-left lg:text-[18px] lg:leading-[26px]">
                            {subHeading}
                        </p>

                        <div className="w-full lg:w-[187px]">
                            <Button
                                title="LET'S TALK"
                                height="56px"
                                rightIcon={'/assets/images/arrowUp.svg'}
                                background="transparent"
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className="image w-full lg:w-1/2">
                        <Image src={Frame} alt="elipse_image" className="lg:h-[506px] lg:w-[502px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
