import React from 'react';
import { useRef } from 'react';
import { NavbarList, SubNavbarList } from '../../types';
import Link from 'next/link';

const NavWithDropDown = ({ title, buttons }: { title: string; buttons: NavbarList[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const onToggle = () => {
        ref.current?.classList.toggle('hidden');
    };
    return (
        <div className="border-box">
            <div className="flex flex-grow flex-col justify-center">
                <button
                    onClick={onToggle}
                    type="button"
                    className={
                        'inline-flex flex-grow items-center font-eudoxus text-[34px] font-medium leading-[42px] text-[#1a1a1a] lg:text-sm lg:font-normal lg:leading-[22px]'
                    }
                >
                    <span className="pe-2">{title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
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

            <div ref={ref} className="hidden">
                <ul className="mt-4 grid gap-y-10 ps-6">
                    {buttons.map((subList: NavbarList, i: number) => (
                        <li key={i}>
                            <div className="font-eudoxus text-lg font-normal leading-[22px] text-[#a3a3a3]">
                                {subList.title}
                            </div>
                            <ul>
                                {subList.list.map((list: SubNavbarList, i: number) => (
                                    <li className="mt-4" key={i}>
                                        <Link href={`${list.link}`} className="no-underline">
                                            <div className="font-eudoxus text-base font-medium leading-6 text-[#1a1a1a]">
                                                {list.title}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export { NavWithDropDown };
