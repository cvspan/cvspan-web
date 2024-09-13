import Image from 'next/image';
import React from 'react';
import Rectangle from '../../../../public/assets/images/Rectangle.png';

const BlogPostLanding = () => {
    return (
        <>
            <div className="mx-auto mt-[100px] w-full max-w-[1200px] px-4 pt-10 md:px-6 lg:px-8">
                <div>
                    <h1 className="xs:text-[30px] xs:font-[500] font-pp-mori text-[40px] font-[600] leading-tight sm:text-[34px] md:text-[40px] lg:text-[96px]">
                        Top 10 Digital Design Agencies
                    </h1>

                    <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-[#D9D9D9] md:h-[48px] md:w-[48px]"></div>
                            <div className="flex flex-col">
                                <h1 className="font-eudoxus text-sm font-[400] leading-5 md:text-base">Moses Arfo</h1>
                                <span className="font-eudoxus text-xs font-[400] leading-[20px] text-[#A3A3A3] md:text-sm">
                                    Founder & CEO
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-5">
                            <p className="rounded-[20px] bg-[#F4F4F4] p-2 font-eudoxus text-xs font-medium md:text-sm">
                                Article
                            </p>
                            <p className="font-eudoxus text-xs font-[400] leading-[22px] text-[#1A1A1A] md:text-sm">
                                3 mins read
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Image
                src={Rectangle}
                alt="  alt text"
                className="mt-[60px] h-auto w-full overflow-hidden object-cover sm:h-[208px] lg:h-[377px]"
            />
        </>
    );
};

export default BlogPostLanding;
