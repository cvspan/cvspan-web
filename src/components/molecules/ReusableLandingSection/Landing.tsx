import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
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
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <div className="flex w-[1200px] items-center justify-between gap-32">
                    <div className="words w-1/2 space-y-[32px]">
                        <h1 className="font-pp-mori text-[70px] font-semibold leading-[78px] text-white">{Heading}</h1>
                        <p className="font-eudoxus text-[18px] font-normal leading-[26px] text-white">{subHeading}</p>
                        <Button title="LET'S TALK" height='56px' leftIcon='../../../../public/assets/icons/vector(1).png' background='dark' />
                    </div>
                    <div className="image w-1/2">
                        <Image src={Frame} alt="elipse_image" className="h-[506px] w-[502px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
