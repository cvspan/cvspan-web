'use client';
import React, { useState } from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';

function Navbar({ light = false }: { light: boolean }) {
    const [currentIndex, setCurrentIndex] = useState<number | 0>(0);
    const [isLight, setIsLight] = useState<boolean | false>(light);

    return (
        <header className="bg-slate-1000">
            <div>
                <section className="flex min-h-20 w-full flex-col justify-center">
                    <div className="mx-auto w-full max-w-[1200px]">
                        <div className="fixed inset-0 z-50 box-border w-full overflow-y-scroll bg-white lg:relative lg:flex-grow lg:flex-nowrap lg:items-center lg:justify-normal lg:overflow-y-visible">
                            <div className="flex flex-col gap-y-10 p-5 lg:flex-row lg:gap-y-0">
                                <div className="flex w-full justify-between lg:w-fit lg:justify-normal">
                                    <NavBrand isLight={isLight} />
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
                                <NavMenu
                                    isLight={isLight}
                                    currentIndex={currentIndex}
                                    onIndexChanged={setCurrentIndex}
                                />
                                <NavLetsTalkButton isLight={isLight} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </header>
    );
}

export default Navbar;
