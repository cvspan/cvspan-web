import React from 'react';
import Link from 'next/link';
import { NavbarList, SubNavbarList } from '../types';

const LetsTalk = () => (
    <div className="h-full">
        <div className="bg relative flex h-full flex-col justify-between rounded-r-3xl py-12 pe-2 ps-8">
            <div className="flex flex-shrink-0 flex-col gap-y-1">
                <h1 className={'font-eudoxus text-5xl font-extrabold text-white'}>HAVE AN IDEA IN MIND</h1>

                <div className={'font-eudoxus text-lg font-normal text-white'}>
                    Let`s create amazing digital experiences together
                </div>
            </div>
            <Link
                href="/"
                className="inline-flex flex-shrink-0 items-center gap-x-[40px] font-eudoxus text-[34px] text-white"
            >
                <span>LET{`'S`} TALK</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M1.90476 0L1.82466 5.38679L30.8036 5.3869L0 36.1905L3.80952 40L34.6131 9.19643L34.6132 38.0954L40 38.0952C40 24.1486 40 13.3486 40 0H1.90476Z" />
                </svg>
            </Link>
        </div>
    </div>
);

export const NavDropDownService = ({ links }: { links: NavbarList[] }) => {
    return (
        <div>
            <div>
                <div className="lg:grid lg:auto-cols-auto lg:grid-cols-12 lg:gap-x-[33px] lg:rounded-3xl lg:bg-white">
                    <div className="lg:col-span-7">
                        <div className="lg:rounded-l-[24px] lg:bg-white lg:py-14 lg:ps-[40px]">
                            <ul className="grid gap-y-10 lg:gap-x-[60px]">
                                {links.map((navList: NavbarList) => (
                                    <li key={navList.id} className="lg:row-start-2">
                                        <h2 className="font-eudoxus text-lg text-[#a3a3a3]">{navList.title}</h2>
                                        <ul className="mt-8 grid gap-y-4 lg:gap-y-8">
                                            {navList.list.map((list: SubNavbarList) => (
                                                <li key={list.id} className="flex gap-x-6">
                                                    <div className="hidden h-[50px] w-[50px] rounded-full bg-[#d9d9d9] lg:block" />
                                                    <span>
                                                        <div className="font-eudoxus text-base font-medium text-[#1a1a1a]">
                                                            {list.title}
                                                        </div>
                                                        <div className="text-slate-[#1a1a1a] hidden font-eudoxus text-xs lg:block">
                                                            {list.caption}
                                                        </div>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="hidden lg:col-span-5 lg:block">
                        <LetsTalk />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NavDropDownIndustry = ({ links }: { links: NavbarList[] }) => {
    return (
        <div>
            <div>
                <div className="lg:grid lg:auto-cols-auto lg:grid-cols-4 lg:gap-x-[80px] lg:rounded-3xl lg:bg-white">
                    <div className="lg:col-span-2">
                        <div className="lg:rounded-l-[24px] lg:bg-white lg:py-14 lg:ps-[40px]">
                            <ul className="grid gap-y-10 lg:gap-x-14">
                                {links.map((navList: NavbarList) => (
                                    <li key={navList.id} className="lg:row-start-2">
                                        <h2 className="font-eudoxus text-lg text-[#a3a3a3]">{navList.title}</h2>
                                        <ul className="mt-8 grid gap-y-4 lg:gap-y-8">
                                            {navList.list.map((list: SubNavbarList) => (
                                                <li key={list.id} className="flex gap-x-6">
                                                    <div className="hidden h-[50px] w-[50px] rounded-full bg-[#d9d9d9] lg:block" />
                                                    <span>
                                                        <div className="font-eudoxus text-base font-medium text-[#1a1a1a]">
                                                            {list.title}
                                                        </div>
                                                        <div className="hidden font-eudoxus text-xs text-[#1a1a1a] lg:block">
                                                            {list.caption}
                                                        </div>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-2 hidden lg:block">
                        <LetsTalk />
                    </div>
                </div>
            </div>
        </div>
    );
};
