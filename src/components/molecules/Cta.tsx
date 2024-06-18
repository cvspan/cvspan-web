import React from 'react';
import Image from 'next/image';
import Img from '../../../public/Ribbon-2.png';
import icon from '../../../public/CTAarrow.png'

type Props = {};

const Cta = (props: Props) => {
    return (
        <div className="relative h-auto gradient mb-20 ">
            <div className="ctabg relative w-full">
                <Image src={Img} alt="image cta" />
            </div>
            <div className="absolute left-0 top-0 flex flex-col md:flex-row h-full w-full items-center lg:gap-10 bg-[#0c0c0c]/60 px-3 md:px-10 backdrop-blur-sm">
                <div className="lg:w-1/2 w-full mt-[8px] mb-[5px] lg:m-0  px-4 lg:p-4">
                    <h1 className="font-pp-mori text-[24px] md:text-[40px] lg:text-[120px] font-semibold leading-[26px] md:leading-[65px] lg:leading-[129.6px] text-white">
                        Have a project in mind?
                    </h1>
                </div>

                <div className="flex h-[50%] lg:w-1/2 w-full  flex-col justify-between text-white px-4 ">
                    <div className="">
                        <p className=" text-[14px] lg:text-[18px] font-medium leading-[19px] lg:leading-[26px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    <div className="flex justify-end gap-5 text-white">
                        <p className=" text-[18px] lg:text-[34px] font-medium leading-[20px] lg:leading-[42px]">LET’S TALK</p>
                        <span className="">
                        <Image src={icon} alt="image cta" className='w-[20px]' /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cta;
