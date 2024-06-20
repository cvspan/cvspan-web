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
                        <div className="relative box-border flex flex-grow flex-nowrap items-center">
                            <NavBrand isLight={isLight} />
                            <NavMenu isLight={isLight} currentIndex={currentIndex} onIndexChanged={setCurrentIndex} />
                            <NavLetsTalkButton isLight={isLight} />
                        </div>
                    </div>
                </section>
            </div>
        </header>
    );
}

export default Navbar;
