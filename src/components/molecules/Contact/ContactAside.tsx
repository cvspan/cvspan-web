'use client';

import Link from 'next/link';
import React from 'react';
import { showDefaultToast } from '@/utils/toaster';
import { CONTACT_SOCIALS } from './socials';

export const ContactAside = () => {
    return (
        <div className="col-span-6 flex flex-col">
            <div className="pt-12">
                {/* The contact page's primary heading — previously a plain div,
                    which left the page with no <h1> at all. */}
                <h1 className="font-pp-mori text-6xl font-semibold leading-[64px] text-white md:text-8xl">
                    Have a <br />
                    <span className="text-[#00ffb2]">project</span> in <br />
                    mind?
                </h1>
                <div className="inline-flex items-center gap-x-2 rounded-full border-[1px] border-[#b0b0b0] px-3 py-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M12 9.675V12.825C12 15.45 10.95 16.5 8.325 16.5H5.175C2.55 16.5 1.5 15.45 1.5 12.825V9.675C1.5 7.05 2.55 6 5.175 6H8.325C10.95 6 12 7.05 12 9.675Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16.5 5.175V8.325C16.5 10.95 15.45 12 12.825 12H12V9.675C12 7.05 10.95 6 8.325 6H6V5.175C6 2.55 7.05 1.5 9.675 1.5H12.825C15.45 1.5 16.5 2.55 16.5 5.175Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <button
                        type="button"
                        aria-label="Copy email address business@cvspan.com"
                        className="cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText('business@cvspan.com');
                            showDefaultToast({
                                message: 'Copied!',
                                position: 'bottom-center',
                                closeButton: false,
                            });
                        }}
                    >
                        <span className="text-base font-normal leading-[26px] text-white">business@cvspan.com</span>
                    </button>
                </div>
            </div>
            <div className="mt-auto hidden md:block">
                <div className="flex gap-x-3">
                    {CONTACT_SOCIALS.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            aria-label={`CVSpan on ${item.label}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block h-8 w-8 text-inherit no-underline"
                        >
                            <img
                                src={item.imageUrlInActive}
                                alt=""
                                className="absolute left-0 top-0 h-full w-full transition-all duration-100 ease-in-out group-hover:scale-0"
                            />
                            <img
                                src={item.imageUrlActive}
                                alt=""
                                className="absolute left-0 top-0 h-full w-full scale-0 transition-all duration-100 ease-in-out group-hover:scale-100"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
