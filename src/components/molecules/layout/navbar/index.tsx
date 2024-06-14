'use client';
import React from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';

function Navbar() {
    return (
        <header className="bg-slate-1000">
            <div>
                <section className="flex min-h-20 w-full flex-col justify-center">
                    <div className="mx-auto min-w-full px-28">
                        <div className="relative flex flex-grow flex-nowrap items-center">
                            <NavBrand />
                            <NavMenu />
                            <NavLetsTalkButton />
                        </div>
                    </div>
                </section>
            </div>
        </header>
    );
}

export default Navbar;
