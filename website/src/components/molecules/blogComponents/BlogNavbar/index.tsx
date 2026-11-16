import React from 'react';
import Link from 'next/link';
import Dropdown from './Dropdown';

const BlogNavbar = () => {
    return (
        <div className="fixed left-0 right-0 top-0 z-50 block border-b-[1px] border-[#d1d1d1] bg-white">
            <div className="flex h-[60px] w-full flex-col justify-center px-5 lg:h-20">
                <div className="mx-auto h-full w-full max-w-[1200px]">
                    <div className="flex h-full items-center justify-between">
                        <Link href="/blog" className="flex cursor-pointer items-center gap-2">
                            <div className="relative my-auto box-border block text-white">
                                <img
                                    src={'/assets/images/logo-black.svg'}
                                    alt="Cvspan logo"
                                    className="w-[80px] sm:w-[100px] lg:w-[152px]"
                                />
                            </div>

                            <span>|</span>
                            <div className="span font-eudoxus text-[14px] font-[400] leading-[22px]">Blog</div>
                        </Link>
                        <div className="hidden h-[41px] w-[471px] items-center gap-[12px] rounded-[100px] bg-[#f4f4f4] p-[12px] lg:flex">
                            <div className="size-[24px]">
                                <img src="/assets/icons/Search.svg" alt="" />
                            </div>
                            <input
                                type="text"
                                aria-label="Search"
                                placeholder="Search"
                                className="w-full bg-transparent font-eudoxus text-[16px] font-[400] leading-[24px] outline-none placeholder:font-eudoxus placeholder:text-[16px] placeholder:font-[400] placeholder:leading-[24px]"
                            />
                        </div>
                        <div className="flex items-center gap-[32px]">
                            <Link href="/blog/dashboard/write" className="flex cursor-pointer items-center gap-[6px]">
                                <img src="/assets/icons/Write.svg" alt="" />
                                <span className="font-eudoxus text-[16px] font-[400] leading-[24px] text-[#1a1a1a]">
                                    Write
                                </span>
                            </Link>

                            <Dropdown />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogNavbar;
