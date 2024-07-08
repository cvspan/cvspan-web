import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavLetsTalkButton } from '.';
import { NavLinks } from '../data';
import { NavLink } from '../types';

export const MobileNav = () => {
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
        <header
            className={`${menuActive ? 'bg-white' : 'bg-transparent'} fixed left-0 right-0 top-0 z-50 bg-transparent lg:hidden`}
        >
            <div>
                <section className="flex w-full flex-col justify-center gap-y-10">
                    <div className="sticky top-0 z-30 flex h-20 w-full justify-between p-5">
                        <Link href="/" className="relative my-auto box-border block text-white">
                            <Image
                                src={`${menuActive ? '/assets/images/logo-black.svg' : '/assets/images/logo-transparent.svg'}`}
                                width={152}
                                height={31}
                                alt="Cvspan logo"
                                className="text-inherit"
                            />
                        </Link>
                        <button type="button" onClick={onToggleMenu} className={`${menuActive ? 'hidden' : 'block'}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                            >
                                <path
                                    d="M5 7.5H35V11.25H5V7.5ZM5 18.125H35V21.875H5V18.125ZM5 28.75H35V32.5H5V28.75Z"
                                    fill={`${menuActive ? '#1a1a1a' : 'white'}`}
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={onToggleMenu}
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
                    <div
                        className={`${menuActive ? 'visible fixed bottom-0 left-0 right-0 top-[calc(80px-1px)] z-20 flex flex-col gap-y-10 overflow-y-scroll bg-white p-5 opacity-100' : 'invisible hidden opacity-0'}`}
                    >
                        <div className="flex flex-col gap-y-6">
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
                                        <li>
                                            <div className="font-eudoxus text-lg font-normal leading-[22px] text-[#a3a3a3]">
                                                Design
                                            </div>
                                            <ul>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        UI/UX Design
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Website Design
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Mobile Design
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Brand Identity
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Graphic Design
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="font-eudoxus text-lg font-normal leading-[22px] text-[#a3a3a3]">
                                                Development
                                            </div>
                                            <ul>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Webflow Development
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Landing Page
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Web Development
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Mobile Development
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        DevOps
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
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
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        AI & ML
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Fintech
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        HealtCare
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Web 3,Blockchain
                                                    </div>
                                                </li>
                                                <li className="mt-4">
                                                    <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                        Saas
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {NavLinks.map((navLink: NavLink, i: number) => (
                                <Link
                                    key={i}
                                    href="/"
                                    className={
                                        'inline-flex items-center font-eudoxus text-[34px] font-medium leading-[42px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]'
                                    }
                                >
                                    {navLink.text}
                                </Link>
                            ))}
                        </div>
                        <NavLetsTalkButton />
                    </div>
                </section>
            </div>
        </header>
    );
};
