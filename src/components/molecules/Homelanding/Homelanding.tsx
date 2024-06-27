import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Ribbon from '../../../../public/Ribbon-2.png';

type Props = {};

const Homelanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="justify-left flex h-full w-full items-center space-y-6">
                <div className="ml-[120px] w-[941px] gap-32">
                    <h1 className="font-pp-mori text-[120px] font-thin leading-[129.6px] text-white">
                        We <span className="font-semibold">Create Awesome</span> Stuff
                    </h1>
                    <p className="font-Exodus text-[18px] font-normal leading-[26px] text-white">
                        Our experts accompany our Clients from the private and public sector in their <br /> digital
                        transformation journey by providing business value solutions
                    </p>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 rotate-[21.43]">
                <Image src={Ribbon} alt="elipse" />
            </div>
        </div>
    );
};

export default Homelanding;
