import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavLetsTalkButton } from '.';

import { NavButtons, NavLinks } from '../data';
import { NavbarList, NavLink, SubNavbarList } from '../types';
import ComingSoonBadge from '@/components/molecules/ComingSoonBadge';
import { cn } from '@/lib/utils';

export const MobileNav = ({ isLight }: { isLight: boolean }) => {
    const serviceRef = useRef<HTMLDivElement>(null);
    const industryRef = useRef<HTMLDivElement>(null);
    const [menuActive, setMenuActive] = useState<boolean>(false);

    const onToggle = () => {
        serviceRef.current?.classList.toggle('hidden');
    };

    const onToggleIndustry = () => {
        industryRef.current?.classList.toggle('hidden');
    };

    const onToggleMenu = () => {
        document.body.classList.toggle('fixed');
        document.body.classList.toggle('w-full');
        setMenuActive((prevState: boolean) => !prevState);
    };
    return (
        <div
            className={`${menuActive || isLight ? 'bg-white' : 'bg-transparent'} fixed left-0 right-0 top-0 z-[101] lg:hidden`}
        >
            <div className="flex flex-col">
                <header className="">
                    <div className="">
                        <section className="flex w-full flex-col">
                            <div className={`flex h-20 w-full justify-between p-5`}>
                                <Link href="/" className="relative my-auto box-border block text-white">
                                    <Image
                                        src={`${menuActive || isLight ? '/assets/images/logo-black.svg' : '/assets/images/logo-transparent.svg'}`}
                                        width={152}
                                        height={31}
                                        alt="Cvspan logo"
                                        className="text-inherit"
                                    />
                                </Link>
                                <button
                                    type="button"
                                    aria-label="Open menu"
                                    onClick={onToggleMenu}
                                    className={`${menuActive ? 'hidden' : 'block'}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="none"
                                    >
                                        <path
                                            d="M5 7.5H35V11.25H5V7.5ZM5 18.125H35V21.875H5V18.125ZM5 28.75H35V32.5H5V28.75Z"
                                            fill={`${menuActive || isLight ? '#1a1a1a' : 'white'}`}
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={onToggleMenu}
                                    aria-label="Close Menu"
                                    className={`${menuActive ? 'visible block opacity-100' : 'invisible hidden opacity-0'}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="none"
                                    >
                                        <path
                                            d="M22.0275 20L35.5 32.831L33.221 35L19.75 22.169L6.27747 35L4 32.831L17.471 20L4 7.169L6.27747 5L19.75 17.831L33.221 5L35.5 7.169L22.0275 20Z"
                                            fill={`${menuActive ? '#1a1a1a' : 'white'}`}
                                        />
                                    </svg>
                                </button>
                            </div>
                        </section>
                    </div>
                </header>

                {menuActive && (
                    <div className="fixed inset-0 left-0 right-0 top-[calc(80px-1px)] z-[9999] flex flex-col overflow-y-scroll">
                        <div className="flex flex-col gap-y-10 bg-white p-5 opacity-100">
                            <div className="col-span-1 flex flex-col gap-y-6">
                                <div className="border-box">
                                    <div className="flex flex-grow flex-col justify-center">
                                        <button
                                            onClick={onToggle}
                                            type="button"
                                            className={
                                                'inline-flex flex-grow items-center font-eudoxus text-[34px] font-medium leading-[42px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]'
                                            }
                                        >
                                            <span className="pe-2">Services</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="19"
                                                height="18"
                                                viewBox="0 0 19 18"
                                                fill="none"
                                            >
                                                <path
                                                    d="M19 9L12 15L5 9"
                                                    stroke="#1a1a1a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div ref={serviceRef} className="hidden">
                                        <ul className="mt-4 grid gap-y-10 ps-6">
                                            {NavButtons[0].links.map((subList: NavbarList, i: number) => (
                                                <li key={i}>
                                                    <div className="font-eudoxus text-lg font-normal leading-[22px] text-[#a3a3a3]">
                                                        {subList.title}
                                                    </div>
                                                    <ul>
                                                        {subList.list.map((list: SubNavbarList, i: number) => (
                                                            <li className="mt-4" key={i}>
                                                                <Link href={`${list.link}`} className="no-underline">
                                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                                        {list.title}
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="border-box">
                                    <div className="flex flex-grow flex-col justify-center">
                                        <button
                                            onClick={onToggleIndustry}
                                            type="button"
                                            className={
                                                'inline-flex flex-grow items-center font-eudoxus text-[34px] font-medium leading-[42px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]'
                                            }
                                        >
                                            <span className="pe-2">Industries</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="19"
                                                height="18"
                                                viewBox="0 0 19 18"
                                                fill="none"
                                            >
                                                <path
                                                    d="M19 9L12 15L5 9"
                                                    stroke="#1a1a1a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div ref={industryRef} className="hidden">
                                        <ul className="mt-4 grid gap-y-10 ps-6">
                                            <li>
                                                <div className="font-eudoxus text-lg font-normal leading-[22px] text-[#a3a3a3]">
                                                    Industries
                                                </div>
                                                <ul>
                                                    {NavButtons[1].links[0].list.map(
                                                        (link: SubNavbarList, i: number) => (
                                                            <li className="mt-4" key={i}>
                                                                <Link
                                                                    href={`${link.link}`}
                                                                    className="mt-4 flex no-underline"
                                                                >
                                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                                        {link.title}
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {NavLinks.map((navLink: NavLink, i: number) => {
                                    const className =
                                        'inline-flex items-center font-eudoxus text-[34px] font-medium leading-[39px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]';

                                    return (
                                        <div key={i} className="flex items-center gap-[8px]">
                                            {navLink?.disabled ? (
                                                <div
                                                    className={cn(
                                                        className,
                                                        'cursor-not-allowed text-[#767676] opacity-[60%]',
                                                    )}
                                                >
                                                    {navLink.text}
                                                </div>
                                            ) : (
                                                <Link href={navLink.link} className={className}>
                                                    {navLink.text}
                                                </Link>
                                            )}

                                            {navLink?.comingSoon ? <ComingSoonBadge /> : null}
                                        </div>
                                    );
                                })}
                            </div>
                            <NavLetsTalkButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
