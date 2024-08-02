import React from 'react';
import Link from 'next/link';

export const DigitalProduct = ({ item }: { item?: any }) => {
    return (
        <div
            className={`relative h-[212px] w-full overflow-hidden rounded-[12px] border-[1px] border-transparent ${item?.isLetsTalk ? 'bg-[#0A1EB9]' : 'bg-[#1a1a1a]'} p-[16px] hover:border-[#272727] md:p-[24px]`}
        >
            {!item?.isLetsTalk ? null : (
                <img src="/assets/images/service-card-bg.jpg" className="z-1 absolute left-0 top-0 h-full w-full" />
            )}
            <div className="relative z-[2] flex h-full flex-col">
                <div className="flex items-center justify-between gap-[16px]">
                    {item?.isLetsTalk ? (
                        <span></span>
                    ) : (
                        <span>
                            <div className="text-[24px] font-medium leading-[32px] text-white">{item?.title}</div>
                        </span>
                    )}
                    <img src="/assets/icons/arrow-top-right-white.svg" className="h-[16px] w-[16px]" />
                </div>
                <div className="mt-auto">
                    {item?.isLetsTalk ? (
                        <div className="text-[24px] font-medium leading-[32px] text-white">{item?.title}</div>
                    ) : (
                        <span className="text-[16px] leading-[24px] text-[#767676]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. 
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
