'use client';
import React from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';
import { MobileNav } from './components/MobileNav';

function Navbar({ light }: { light: boolean }) {
    return (
        <>
            <header className="hidden lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 lg:block">
                <div>
                    <section className="flex w-full flex-col justify-center lg:h-20">
                        <div className="mx-auto w-full max-w-[1200px] px-5 lg:h-full">
                            <div className="fixed inset-0 z-50 box-border w-full overflow-y-scroll lg:relative lg:h-full lg:flex-grow lg:flex-nowrap lg:items-center lg:justify-normal lg:overflow-y-visible">
                                <div className="flex flex-col items-stretch gap-y-10 p-5 lg:h-full lg:flex-row lg:gap-y-0 lg:p-0 lg:py-0">
                                    <div className="flex w-full justify-between lg:w-fit lg:justify-normal">
                                        <NavBrand isLight={light} />
                                        <button type="button" className="lg:hidden">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="40"
                                                height="40"
                                                viewBox="0 0 40 40"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5 7.5H35V11.25H5V7.5ZM5 18.125H35V21.875H5V18.125ZM5 28.75H35V32.5H5V28.75Z"
                                                    fill="black"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <NavMenu isLight={light} />
                                    <NavLetsTalkButton />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </header>
            <MobileNav />
        </>
    );
}

export default Navbar;
