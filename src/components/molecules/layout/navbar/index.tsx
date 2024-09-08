'use client';
import React from 'react';
import { NavBrand, NavMenu, NavLetsTalkButton } from './components';
import { MobileNav } from './components/MobileNav';

function Navbar({ light = false }: { light?: boolean }) {
    const [_light, setLight] = React.useState<boolean>(light);

    const onNavbarBgChange = () => {
        window.scrollY >= 820 ? setLight(true) : setLight(_light ? true : false);
    };

    React.useEffect(() => {
        window.addEventListener('scroll', onNavbarBgChange);
        return () => {
            window.removeEventListener('scroll', onNavbarBgChange);
        };
    }, []);

    return (
        <>
            <header
                className={`${_light ? 'relative bg-white/60 invert-0 backdrop-blur-[10px]' : 'bg-transparent'} relative hidden lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 lg:block`}
            >
                <div>
                    <section className="flex w-full flex-col justify-center px-5 lg:h-20">
                        <div className="mx-auto w-full max-w-[1200px] lg:h-full">
                            <div className="fixed inset-0 z-50 box-border w-full overflow-y-scroll lg:relative lg:h-full lg:flex-grow lg:flex-nowrap lg:items-center lg:justify-normal lg:overflow-y-visible">
                                <div className="flex flex-col items-center gap-y-10 p-5 lg:h-full lg:flex-row lg:gap-y-0 lg:p-0 lg:py-0">
                                    <div className="flex w-full justify-between lg:w-fit lg:justify-normal">
                                        <NavBrand isLight={_light} />
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
                                    <NavMenu isLight={_light} />
                                    <NavLetsTalkButton isLight={_light} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </header>
            <MobileNav isLight={light} />
        </>
    );
}

export default Navbar;
