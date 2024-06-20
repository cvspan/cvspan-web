import React from 'react';
import Link from 'next/link';
import { NavbarList, SubNavbarList } from '../layout/navbar/types';

export const ServiceNavDropDown = ({ isLight, links }: { isLight: boolean; links: NavbarList[] }) => {
    return (
        <div>
            <div>
                <div className="grid auto-cols-auto grid-cols-12 gap-x-[33px] rounded-3xl bg-white">
                    <div className="col-span-7">
                        <div className="rounded-l-[24px] bg-white py-14 ps-[40px]">
                            <ul className="grid gap-x-[60px]">
                                {links.map((navList: NavbarList) => (
                                    <li key={navList.id} className="row-start-2">
                                        <h2 className="text-lg text-slate-1100">{navList.title}</h2>
                                        <ul className="mt-8 grid gap-y-8">
                                            {navList.list.map((list: SubNavbarList) => (
                                                <li key={list.id} className="flex gap-x-6">
                                                    <div className="h-[50px] w-[50px] rounded-full bg-[#d9d9d9]" />
                                                    <span>
                                                        <div className="text-base font-medium text-slate-1000">
                                                            {list.title}
                                                        </div>
                                                        <div className="text-xs text-slate-1050">{list.caption}</div>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-5">
                        <div className="h-full">
                            <div className="bg relative flex h-full flex-col justify-between rounded-r-3xl py-12 pe-2 ps-8">
                                <div className="flex flex-shrink-0 flex-col gap-y-1">
                                    <h1 className={`text-5xl font-extrabold ${isLight ? 'text-black' : 'text-white'}`}>
                                        HAVE AN IDEA IN MIND
                                    </h1>

                                    <div className={`text-lg font-normal ${isLight ? 'text-black' : 'text-white'}`}>
                                        Let`s create amazing digital experiences together
                                    </div>
                                </div>
                                <Link
                                    href="/"
                                    className={`inline-flex flex-shrink-0 items-center gap-x-[40px] text-[34px] ${isLight ? 'text-black' : 'text-white'}`}
                                >
                                    <span>LET{`'S`} TALK</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="currentColor"
                                    >
                                        <path d="M1.90476 0L1.82466 5.38679L30.8036 5.3869L0 36.1905L3.80952 40L34.6131 9.19643L34.6132 38.0954L40 38.0952C40 24.1486 40 13.3486 40 0H1.90476Z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const IndustryDropDown = ({ isLight, links }: { isLight: boolean; links: NavbarList[] }) => {
    return (
        <div>
            <div>
                <div className="grid auto-cols-auto grid-cols-4 gap-x-[80px] rounded-3xl bg-white">
                    <div className="col-span-2">
                        <div className="rounded-l-[24px] bg-white py-14 ps-[40px]">
                            <ul className="grid gap-x-14">
                                {links.map((navList: NavbarList) => (
                                    <li key={navList.id} className="row-start-2">
                                        <h2 className="text-lg text-slate-1100">{navList.title}</h2>
                                        <ul className="mt-8 grid gap-y-8">
                                            {navList.list.map((list: SubNavbarList) => (
                                                <li key={list.id} className="flex gap-x-6">
                                                    <div className="h-[50px] w-[50px] rounded-full bg-[#d9d9d9]" />
                                                    <span>
                                                        <div className="text-base font-medium text-slate-1000">
                                                            {list.title}
                                                        </div>
                                                        <div className="text-xs text-slate-1050">{list.caption}</div>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-full">
                            <div className="bg relative flex h-full flex-col justify-between rounded-r-3xl py-12 pe-2 ps-8">
                                <div className="flex flex-shrink-0 flex-col gap-y-1">
                                    <h1 className={`text-5xl font-extrabold ${isLight ? 'text-black' : 'text-white'}`}>
                                        HAVE AN IDEA IN MIND
                                    </h1>

                                    <div className={`text-lg font-normal ${isLight ? 'text-black' : 'text-white'}`}>
                                        Let`s create amazing digital experiences together
                                    </div>
                                </div>
                                <Link
                                    href="/"
                                    className={`inline-flex flex-shrink-0 items-center gap-x-[40px] text-[34px] ${isLight ? 'text-black' : 'text-white'}`}
                                >
                                    <span>LET{`'S`} TALK</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="currentColor"
                                    >
                                        <path d="M1.90476 0L1.82466 5.38679L30.8036 5.3869L0 36.1905L3.80952 40L34.6131 9.19643L34.6132 38.0954L40 38.0952C40 24.1486 40 13.3486 40 0H1.90476Z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
