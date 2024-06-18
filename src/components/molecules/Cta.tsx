import React from 'react';
import Image from 'next/image';
import Img from '../../../public/Ribbon-2.png';
import icon from '../../../public/CTAarrow.png';

type Props = {};

const Cta = (props: Props) => {
    return (
        <div className="gradient relative mb-20 h-auto">
            <div className="ctabg relative w-full">
                <Image src={Img} alt="image cta" />
            </div>
            <div className="absolute left-0 top-0  h-full w-full  bg-[#0c0c0c]/60 px-3 backdrop-blur-sm  ">
                <div className="container md:flex-row flex flex-col items-center h-full ">
                    <div className="mb-[5px] mt-[8px] w-full px-4 lg:m-0 lg:w-1/2 lg:p-4">
                        <h1 className="font-pp-mori text-[24px] font-semibold leading-[26px] text-white md:text-[40px] md:leading-[65px] lg:text-[120px] lg:leading-[129.6px]">
                            Have a project in mind?
                        </h1>
                    </div>

                    <div className="flex h-[50%] w-full flex-col justify-between px-4 text-white lg:w-1/2">
                        <div className="">
                            <p className="text-[14px] font-medium leading-[19px] lg:text-[18px] lg:leading-[26px]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        <div className="flex justify-end gap-5 text-white">
                            <p className="text-[18px] font-medium leading-[20px] lg:text-[34px] lg:leading-[42px]">
                                LET’S TALK
                            </p>
                            <span className="">
                                <Image src={icon} alt="image cta" className="w-[20px]" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cta;
