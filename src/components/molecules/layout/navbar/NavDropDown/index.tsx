import React from 'react';
import Link from 'next/link';
import { NavbarList, SubNavbarList } from '../types';
import { motion } from 'framer-motion';

const LetsTalk = () => (
    <div className="h-full">
        <div className="bg relative flex h-full flex-col rounded-r-3xl py-[37px] pe-[25px] ps-[37px]">
            <div className="flex flex-col gap-y-1">
                <h1 className={'leding-[56px] max-w-[350px] font-eudoxus text-5xl font-extrabold text-white'}>
                    HAVE AN IDEA IN MIND
                </h1>

                <div className={'font-eudoxus text-lg font-normal text-white'}>
                    Let`s create amazing digital experiences together
                </div>
            </div>

            <Link href={'/contact'} className="mt-auto">
                <motion.button
                    whileHover="on_hover"
                    className="group inline-flex flex-shrink-0 items-center gap-x-[40px] font-eudoxus text-[34px] leading-[42px] text-white"
                >
                    <motion.h4 className="text-[34px] leading-[42px] group-hover:text-white/80">LET’S TALK</motion.h4>

                    <motion.img
                        initial={{ x: '-30px', y: 30, opacity: 0 }}
                        variants={{
                            on_hover: {
                                x: 0,
                                y: 0,
                                opacity: 1,
                            },
                        }}
                        src="/assets/icons/arrow-up-big-white.svg"
                        className="hidden h-[40px] w-[40px] group-hover:block"
                    />

                    <motion.img
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        variants={{
                            on_hover: {
                                x: 30,
                                y: -30,
                                opacity: 0,
                            },
                        }}
                        src="/assets/icons/arrow-up-big-white.svg"
                        className="h-[40px] w-[40px] group-hover:hidden"
                    />
                </motion.button>
            </Link>
        </div>
    </div>
);

export const NavDropDownService = ({ links }: { links: NavbarList[] }) => {
    return (
        <div
            className="lg:grid lg:auto-cols-auto lg:grid-cols-12 lg:gap-x-[33px] lg:rounded-3xl lg:bg-white"
            style={{
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                zIndex: '1000',
            }}
        >
            <div className="lg:col-span-7">
                <div className="py-[37px] lg:rounded-l-[24px] lg:ps-[40px]">
                    <div className="grid gap-y-10 lg:gap-x-[60px]">
                        {links.map((navList: NavbarList) => (
                            <div key={navList.id} className="row-start-1">
                                <h2 className="font-eudoxus text-lg text-[#a3a3a3]">{navList.title}</h2>
                                <div className="mt-8 grid gap-y-4 lg:gap-y-8">
                                    {navList.list.map((list: SubNavbarList) => (
                                        <div key={list.id} className="group">
                                            <Link href={list.link} className="flex gap-x-6">
                                                <div className="block h-[50px] w-[50px] rounded-full bg-[#d9d9d9]">
                                                    <img src={list.icon} alt="" />
                                                </div>
                                                <span>
                                                    <div className="font-eudoxus text-base font-medium text-[#1a1a1a] group-hover:text-[#1A1AFF]">
                                                        {list.title}
                                                    </div>
                                                    <div className="text-slate-[#1a1a1a] hidden font-eudoxus text-xs lg:block">
                                                        {list.caption}
                                                    </div>
                                                </span>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
                <LetsTalk />
            </div>
        </div>
    );
};

export const NavDropDownIndustry = ({ links }: { links: NavbarList[] }) => {
    return (
        <div>
            <div>
                <div
                    className="grid auto-cols-auto grid-cols-4 rounded-3xl bg-white"
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                        zIndex: '1000',
                    }}
                >
                    <div className="col-span-2 pe-[80px]">
                        <div className="lg:rounded-l-[24px] lg:bg-white lg:py-[37px] lg:ps-[40px]">
                            <div className="grid gap-y-10 lg:gap-x-14">
                                {links.map((navList: NavbarList) => (
                                    <div key={navList.id} className={`cvspan-nav-link lg:row-start-1`}>
                                        <h2 className="font-eudoxus text-lg text-[#a3a3a3]">{navList.title}</h2>
                                        <div className="mt-8 grid gap-y-4 lg:gap-y-8">
                                            {navList.list.map((list: SubNavbarList) => (
                                                <div key={list.id} className="group">
                                                    <Link href={list.link} className="flex gap-x-6">
                                                        <div className="hidden h-[50px] w-[50px] rounded-full bg-[#d9d9d9] lg:block">
                                                            <img src={list.icon} alt="" />
                                                        </div>
                                                        <span>
                                                            <div
                                                                className={`cvspan-nav-title font-eudoxus text-base font-medium text-[#1a1a1a] group-hover:text-[#1A1AFF]`}
                                                            >
                                                                {list.title}
                                                            </div>
                                                            <div className="hidden font-eudoxus text-xs text-[#1a1a1a] lg:block">
                                                                {list.caption}
                                                            </div>
                                                        </span>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 block">
                        <LetsTalk />
                    </div>
                </div>
            </div>
        </div>
    );
};
