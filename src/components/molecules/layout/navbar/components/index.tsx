import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { NavButtons, NavLinks } from '../data';
import { NavLink } from '../types';
import { NavDropDownIndustry, NavDropDownService } from '../NavDropDown';
import '../Navbar.css';

export const NavBrand = ({ isLight }: { isLight: boolean }) => {
    return (
        <Link href="/" className="relative box-border block text-white">
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

export const NavMenu = ({
    isLight,
    currentIndex,
    onIndexChanged,
}: {
    isLight: boolean;
    currentIndex: number;
    onIndexChanged: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const ref = useOutsideClick(handleOutsideClick);

    function handleOutsideClick() {
        onIndexChanged(0);
    }
    return (
        <div className="mx-auto flex flex-nowrap items-center gap-x-8">
            <div className="border-box max-w-full flex-grow-0 basis-0">
                <div>
                    <button
                        onClick={() => {
                            onIndexChanged(1);
                        }}
                        type="button"
                        className={`inline-flex text-base font-normal ${isLight ? 'text-black' : 'text-white'}`}
                    >
                        <span className="pe-2">Services</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M19 9L12 15L5 9"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                {currentIndex === 1 && (
                    <div ref={ref} className="absolute left-0 top-[100%] mt-12 ps-16">
                        <NavDropDownService links={NavButtons[0].links} isLight={isLight} />
                    </div>
                )}
            </div>
            <div className="border-box max-w-full flex-grow-0 basis-0">
                <div>
                    <button
                        onClick={() => {
                            onIndexChanged(2);
                        }}
                        type="button"
                        className={`inline-flex text-base font-normal ${isLight ? 'text-black' : 'text-white'}`}
                    >
                        <span className="pe-2">Industries</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M19 9L12 15L5 9"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                {currentIndex === 2 && (
                    <div ref={ref} className="absolute left-[25%] top-[100%] mt-12 rounded-3xl ps-16">
                        <NavDropDownIndustry links={NavButtons[1].links} isLight={isLight} />
                    </div>
                )}
            </div>

            {NavLinks.map((navLink: NavLink) => (
                <Link href="/" className="text-base font-normal text-white" key={navLink.id}>
                    {navLink.text}
                </Link>
            ))}
        </div>
    );
};

export const NavLetsTalkButton = ({ isLight }: { isLight: boolean }) => {
    return (
        <button
            type="button"
            aria-label="Let's Talk"
            className={`bg-blue-1000 inline-flex items-center gap-x-2 whitespace-nowrap text-nowrap rounded-2xl px-4 py-2 text-base ${isLight ? 'text-black' : 'text-white'}`}
        >
            LET{`'`}S TALK
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="">
                <path
                    d="M7.66212 14.4563C7.90076 14.2702 8.11722 14.0537 8.55008 13.6209L14.097 8.07399C13.342 7.75978 12.4479 7.24365 11.6022 6.39801C10.7565 5.55224 10.2403 4.65794 9.92612 3.90293L4.37912 9.44992L4.37907 9.44997C3.94624 9.8828 3.7298 10.0992 3.54367 10.3379C3.3241 10.6194 3.13585 10.924 2.98226 11.2463C2.85205 11.5195 2.75526 11.8099 2.56167 12.3906L1.54084 15.4531C1.44557 15.7389 1.51995 16.054 1.73297 16.267C1.94599 16.48 2.26108 16.5544 2.54688 16.4592L5.60938 15.4383C6.19014 15.2447 6.48052 15.1479 6.75373 15.0177C7.07602 14.8641 7.38061 14.6759 7.66212 14.4563Z"
                    fill="white"
                />
                <path
                    d="M15.6362 6.53479C16.7879 5.38301 16.7879 3.51561 15.6362 2.36383C14.4844 1.21206 12.617 1.21206 11.4652 2.36383L10.7999 3.02911C10.809 3.05662 10.8185 3.08451 10.8283 3.11277C11.0721 3.81562 11.5322 4.737 12.3977 5.60252C13.2632 6.46803 14.1846 6.92811 14.8875 7.17196C14.9156 7.18172 14.9434 7.19113 14.9708 7.2002L15.6362 6.53479Z"
                    fill="white"
                />
            </svg>
        </button>
    );
};
