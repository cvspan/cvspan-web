import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavLetsTalkButton } from '.';

import { NavButtons, NavLinks } from '../data';
import { NavLink } from '../types';
import { NavWithDropDown } from './NavWithDropDown';
import { NavWithoutDropDown } from './NavWithoutDropDown';

export const MobileNav = ({ isLight }: { isLight: boolean }) => {
    const [menuActive, setMenuActive] = useState<boolean>(false);

    const onToggleMenu = () => {
        document.body.classList.toggle('fixed');
        document.body.classList.toggle('w-full');
        setMenuActive((prevState: boolean) => !prevState);
    };
    return (
        <div
            className={`${menuActive ? 'fixed inset-0 bg-white' : 'bg-transparent'} fixed left-0 right-0 top-0 z-[101] ${isLight && 'left-0 right-0 top-0 bg-white'} lg:hidden`}
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
                                {NavButtons.map((navbutton, i: number) => (
                                    <NavWithDropDown title={navbutton.text} buttons={navbutton.links} key={i} />
                                ))}

                                {NavLinks.map((navLink: NavLink, i: number) => (
                                    <NavWithoutDropDown key={i} navLink={navLink} />
                                ))}
                            </div>
                            <NavLetsTalkButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
