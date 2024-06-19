'use client';
import React, { useState } from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';

function Navbar() {
    const [currentIndex, setCurrentIndex] = useState<number | 0>(0);
    return (
        <header className="bg-slate-1000">
            <div>
                <section className="flex min-h-20 w-full flex-col justify-center">
                    <div className="mx-auto w-full max-w-[1200px]">
                        <div className="relative flex flex-grow flex-nowrap items-center">
                            <NavBrand />
                            <NavMenu currentIndex={currentIndex} onIndexChanged={setCurrentIndex} />
                            <NavLetsTalkButton />
                        </div>
                    </div>
                </section>
            </div>
        </header>
    );
}

export default Navbar;
