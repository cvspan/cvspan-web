'use client';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { blogSideBarItems } from '@/components/molecules/blogComponents/BlogDashboardWrapper/BlogDashboardSideBar';

const Dropdown = () => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <button type="button" aria-label="Open account menu">
                        <img src="/assets/images/profile_picture.png" alt="" className="size-[40px] md:size-[50px]" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-[5px] rounded-xl p-4">
                    <DropdownMenuLabel>
                        <div className="space-y-3">
                            <h1 className="font-gordita text-[16px] font-medium capitalize leading-[24px] text-[#000] dark:text-[#ffffff]">
                                Arfo Moses
                            </h1>
                            <p className="font-gordita text-[14px] font-normal capitalize leading-[22px] text-[#4e4e4e] dark:text-[#ffffff]">
                                mosesarfo@gmail.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {blogSideBarItems.map((item) => {
                        return (
                            <Link key={item?.title} href={item?.link}>
                                <DropdownMenuItem>
                                    <div className="flex items-center gap-2">
                                        <img src={item?.image} alt="" loading="lazy" decoding="async" />
                                        <span>
                                            <p className="font-gordita text-[16px] font-normal leading-[24px]">
                                                {item?.title}
                                            </p>
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                            </Link>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Dropdown;
