import React from 'react';
import Image from 'next/image';
import Elipse from '../../../../public/Ellipse 1.png';
import Featured from './Featured';
import Button from '../Button';
import Search from '../../../../public/assets/icons/Vector.png';

type Props = {};

const Bloglanding = (props: Props) => {
    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <Image src={Elipse} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="w-[335px] space-y-[60px] lg:w-[1012px]">
                    <div className="flex flex-col justify-center gap-y-[24px]">
                        <h1 className="text-center font-pp-mori text-[48px] font-[500] leading-[56px] text-white lg:text-[96px] lg:font-[600] lg:leading-[103.66px]">
                            Blog & Article
                        </h1>
                        <p className="text-center font-eudoxus text-[16px] leading-[24px] text-white lg:mx-auto lg:w-[615px] lg:text-[18px] lg:leading-[26px]">
                            The Toptal Blog is the top hub for developers, designers, finance experts, executives, and
                            entrepreneurs, featuring key technology updates, tutorials, freelancer resources, and
                            management insights.
                        </p>
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-[20px]">
                            <Image src={Search} alt="search" className="h-[24px] w-[24px]" />
                        </span>
                        <input
                            type="text"
                            className="placehoder:text-[18px] h-[64px] w-full rounded-full border-[1px] border-gray-400 bg-[#1a1a1a] pl-[44px] text-[18px] font-normal leading-[26px] text-white outline-none placeholder:font-eudoxus placeholder:font-normal placeholder:leading-[26px]"
                            placeholder="What are you looking for?"
                        />
                        <div className="relative right-1 top-[4px] mt-[12px] w-full lg:absolute lg:mt-0 lg:w-auto">
                            <Button background="blue" title="SEARCH" height="56px" fullWidth />
                        </div>
                    </div>
                </div>
                {/* <div className="absolute bottom-6">
                    <Featured />
                </div> */}
            </div>
        </div>
    );
};

export default Bloglanding;
