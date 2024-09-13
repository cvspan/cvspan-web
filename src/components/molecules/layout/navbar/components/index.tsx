import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavButtons, NavLinks } from '../data';
import { NavLink } from '../types';
import { NavDropDownIndustry, NavDropDownService } from '../NavDropDown';
import { motion } from 'framer-motion';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import '../Navbar.css';
import { cn } from '@/lib/utils';

export const NavBrand = ({ isLight }: { isLight: boolean }) => {
    return (
        <Link href="/" className="relative my-auto box-border block text-white">
            <Image
                src={`${isLight ? '/assets/images/logo-black.svg' : '/assets/images/logo-transparent.svg'}`}
                width={152}
                height={31}
                alt="Cvspan logo"
                className="text-inherit"
            />
        </Link>
    );
};

export const NavMenu = ({ isLight }: { isLight: boolean }) => {
    return (
        <div className="flex flex-col gap-y-6 lg:mx-auto lg:flex-row lg:flex-nowrap lg:items-center lg:gap-x-8">
            <div className="border-box group/services relative w-fit lg:static lg:flex lg:h-full lg:max-w-full lg:flex-grow-0">
                <div className="flex flex-grow flex-col justify-center">
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                className={`inline-flex flex-grow items-center font-eudoxus text-[34px] font-medium leading-[42px] lg:text-sm lg:font-normal lg:leading-[22px] ${isLight ? 'text-[#1a1a1a]' : 'text-white'} hover:underline`}
                            >
                                <span className="pr-2">Services</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 19 18"
                                    fill="none"
                                >
                                    <path
                                        d="M19 9L12 15L5 9"
                                        stroke={`${isLight ? 'black' : 'white'}`}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                            side={'bottom'}
                            sideOffset={20}
                            className="m-0 ml-[100px] h-[500px] w-[1100px] border-none bg-white/0 p-0"
                        >
                            <NavDropDownService links={NavButtons[0].links} />
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </div>
            <div className="border-box group/industries relative w-fit lg:static lg:flex lg:h-full lg:max-w-full lg:flex-grow-0">
                <div className="flex flex-grow flex-col justify-center">
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                className={`inline-flex flex-grow items-center font-eudoxus text-[34px] font-medium leading-[42px] lg:text-sm lg:font-normal lg:leading-[22px] ${isLight ? 'text-[#1a1a1a]' : 'text-white'} hover:underline`}
                            >
                                <span className="pr-2">Industries</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 19 18"
                                    fill="none"
                                >
                                    <path
                                        d="M19 9L12 15L5 9"
                                        stroke={`${isLight ? 'black' : 'white'}`}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </HoverCardTrigger>
                        <HoverCardContent sideOffset={20} className="m-0 h-[500px] w-[800] border-none bg-white/0 p-0">
                            <NavDropDownIndustry links={NavButtons[1].links} />
                        </HoverCardContent>
                    </HoverCard>
                </div>

                {/* <div className="">
                    <NavDropDownIndustry links={NavButtons[1].links} />
                </div> */}
            </div>

            {NavLinks.map((navLink: NavLink) => {
                const className = `inline-flex items-center font-eudoxus text-[34px] font-medium leading-[42px] hover:underline lg:text-sm lg:font-normal lg:leading-[22px] ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`;

                if (navLink.disabled)
                    return (
                        <div className={cn(className, 'cursor-not-allowed')} key={navLink.id}>
                            {navLink.text}
                        </div>
                    );
                return (
                    <Link href={navLink.link} className={className} key={navLink.id}>
                        {navLink.text}
                    </Link>
                );
            })}
        </div>
    );
};

export const NavLetsTalkButton = ({ isLight }: { isLight?: boolean }) => {
    return (
        <Link href="/contact">
            <motion.button
                whileHover="animate"
                whileTap="animate"
                className="relative z-[13] flex h-[40px] w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-[32px] px-[16px] py-[8px] text-[14px] leading-[22px] text-white sm:w-[140px] sm:justify-between"
            >
                <motion.span
                    variants={{
                        animate: {
                            color: isLight ? '#1A1AFF' : undefined,
                            fontWeight: isLight ? '500' : undefined,
                        },
                    }}
                    className="relative z-[2] text-inherit"
                >
                    LET{"'"}S TALK
                </motion.span>

                <img src="/assets/icons/pen-white.svg" className="relative z-[3]" />
                <motion.span
                    variants={{
                        animate: {
                            x: '69%',
                        },
                    }}
                    className="absolute left-0 top-0 z-[1] h-full w-full rounded-[32px] bg-[#1A1AFF]"
                ></motion.span>
            </motion.button>
        </Link>

        // <Link
        //     href="/contact"
        //     aria-label="Let's Talk"
        //     role="button"
        //     className="my-auto inline-flex w-full items-center justify-center gap-x-2 whitespace-nowrap text-nowrap rounded-[100px] bg-[#1a1aff] px-4 py-2 font-eudoxus text-base text-white lg:w-fit lg:justify-normal"
        // >
        //     LET{`'`}S TALK
        //     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="">
        //         <path
        //             d="M7.66212 14.4563C7.90076 14.2702 8.11722 14.0537 8.55008 13.6209L14.097 8.07399C13.342 7.75978 12.4479 7.24365 11.6022 6.39801C10.7565 5.55224 10.2403 4.65794 9.92612 3.90293L4.37912 9.44992L4.37907 9.44997C3.94624 9.8828 3.7298 10.0992 3.54367 10.3379C3.3241 10.6194 3.13585 10.924 2.98226 11.2463C2.85205 11.5195 2.75526 11.8099 2.56167 12.3906L1.54084 15.4531C1.44557 15.7389 1.51995 16.054 1.73297 16.267C1.94599 16.48 2.26108 16.5544 2.54688 16.4592L5.60938 15.4383C6.19014 15.2447 6.48052 15.1479 6.75373 15.0177C7.07602 14.8641 7.38061 14.6759 7.66212 14.4563Z"
        //             fill="white"
        //         />
        //         <path
        //             d="M15.6362 6.53479C16.7879 5.38301 16.7879 3.51561 15.6362 2.36383C14.4844 1.21206 12.617 1.21206 11.4652 2.36383L10.7999 3.02911C10.809 3.05662 10.8185 3.08451 10.8283 3.11277C11.0721 3.81562 11.5322 4.737 12.3977 5.60252C13.2632 6.46803 14.1846 6.92811 14.8875 7.17196C14.9156 7.18172 14.9434 7.19113 14.9708 7.2002L15.6362 6.53479Z"
        //             fill="white"
        //         />
        //     </svg>
        // </Link>
    );
};
