import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const BlogNavbar = (props: Props) => {
    return (
        <div className="relative hidden border-b-[1px] border-[#d1d1d1] bg-white lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 lg:block">
            <div className="flex w-full flex-col justify-center px-5 lg:h-20">
                <div className="mx-auto w-full max-w-[1200px] lg:h-full">
                    <div className="flex h-full items-center justify-between">
                        <div className="flex cursor-pointer items-center gap-2">
                            <Link href="/" className="relative my-auto box-border block text-white">
                                <Image
                                    src={'/assets/images/logo-black.svg'}
                                    width={152}
                                    height={31}
                                    alt="Cvspan logo"
                                    className="text-inherit"
                                />
                            </Link>

                            <div className="span border-l-[3px] border-[#000] pl-2 font-eudoxus text-[14px] font-[400] leading-[22px]">
                                Blog
                            </div>
                        </div>
                        <div className="flex h-[41px] w-[471px] items-center gap-[12px] rounded-[100px] bg-[#f4f4f4] p-[12px]">
                            <div className="size-[24px]">
                                <img src="/assets/icons/Search.svg" alt="" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-transparent font-eudoxus text-[16px] font-[400] leading-[24px] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px]"
                            />
                        </div>
                        <div className="flex items-center gap-[32px]">
                            <div className="flex cursor-pointer items-center gap-[6px]">
                                <img src="/assets/icons/Write.svg" alt="" />
                                <span className="font-eudoxus text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">
                                    Write
                                </span>
                            </div>

                            <div className="size-[50px] cursor-pointer">
                                <img src="/assets/images/profile_picture.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogNavbar;
