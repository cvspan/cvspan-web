'use client';
import React from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';
import { MobileNav } from './components/MobileNav';
import { usePathname } from 'next/navigation';
import { useSurfaceTheme } from './hooks/useSurfaceTheme';
import './Navbar.css';

function NavbarWrapper({ light = false, showScrollWatcher }: { light?: boolean; showScrollWatcher?: boolean }) {
    // The bar no longer guesses from a scroll offset. It looks at whatever
    // section is behind it and inverts to suit, so it stays legible over the
    // dark hero and over the pale sections further down without either being
    // hard coded. The `light` prop is only the starting value, which keeps the
    // server and the first client render in agreement.
    const headerRef = React.useRef<HTMLElement>(null);
    const { mode, scrolled } = useSurfaceTheme(headerRef, light ? 'light' : 'dark');
    const _light = mode === 'light';

    // Glass, not a slab: 8% tint doing very little on its own, with the blur
    // behind it separating the bar from whatever is sliding underneath. No
    // border — the blur is the edge.
    const surface = scrolled ? `backdrop-blur-xl ${_light ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}` : 'bg-transparent';

    const pathname = usePathname();
    const isBlogPage = typeof pathname === 'string' && pathname.startsWith('/blog') ? true : false;

    return (
        <>
            {showScrollWatcher ? (
                <div className="scroll_watcher_wrapper">
                    <div className="scroll_watcher"></div>
                </div>
            ) : null}

            <header
                ref={headerRef}
                className={`${surface} relative hidden transition-colors duration-300 lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 lg:block`}
            >
                <div>
                    <section className="flex w-full flex-col justify-center px-5 lg:h-20">
                        <div className="mx-auto w-full max-w-[1200px] lg:h-full">
                            <div className="fixed inset-0 z-50 box-border w-full overflow-y-scroll lg:relative lg:h-full lg:flex-grow lg:flex-nowrap lg:items-center lg:justify-normal lg:overflow-y-visible">
                                <div className="flex flex-col items-center gap-y-10 p-5 lg:h-full lg:flex-row lg:gap-y-0 lg:p-0 lg:py-0">
                                    <div className="flex w-full justify-between lg:w-fit lg:justify-normal">
                                        <NavBrand isLight={_light} />
                                    </div>
                                    <NavMenu isLight={_light} isBlogPage={isBlogPage} />
                                    <NavLetsTalkButton isLight={_light} isBlogPage={isBlogPage} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </header>
            <MobileNav isLight={_light} isBlogPage={isBlogPage} />
        </>
    );
}

const Navbar = ({ light = false, showScrollWatcher }: { light?: boolean; showScrollWatcher?: boolean }) => {
    return <NavbarWrapper light={light} showScrollWatcher={showScrollWatcher} />;
};

export default Navbar;
