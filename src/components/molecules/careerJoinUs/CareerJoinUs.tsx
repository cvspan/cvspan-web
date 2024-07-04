import React from 'react';
import image from '../../../../public/assets/images/image 28.png';
import Image from 'next/image';

type Props = {};

const CareerJoinUs = (props: Props) => {
    return (
        <div className="bg-[#0c0c0c] py-[120px]">
            <div className="mx-auto h-[488px] w-[1200px]">
                <div className="flex h-full gap-6">
                    <div className="bg-[url('/assets/images/ribbon.png')] relative h-full w-full rounded-[24px] bg-gray-600 bg-cover bg-center p-10">
                        <div
                            className="pointer-events-none absolute inset-0 z-10 rounded-[24px] opacity-50"
                            style={{
                                background: 'linear-gradient(to right, #1a1aff , #000032)',
                            }}
                        ></div>
                        <div className="absolute bottom-0 right-0 z-20 rounded-[24px] overflow-hidden ">
                            <Image src={image} alt="ellipse" className='' />
                        </div>

                        <div className="relative z-30 space-y-8">
                            <h2 className="font-pp-mori text-[60px] font-semibold leading-[64px] text-white">
                                Join a native <br /> remote company
                            </h2>
                            <p className="text-[18px] font-normal leading-[26px] text-white">
                                CVSpan has been fully remote since day 1. We've grown the team without any geographical
                                or cultural boundaries. Our business is remote-first in all aspects. We like to
                                over-communicate, set clear expectations, and shared goals.
                            </p>
                        </div>
                    </div>

                    <div className="h-full w-full">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex h-[232px] flex-col gap-[60px] rounded-[24px] bg-[#1a1a1a] p-6">
                                <p className="font-eudoxus text-[16px] font-medium leading-[24px] text-[#484848]">01</p>

                                <div className="space-y-[12px]">
                                    <h2 className="font-pp-mori text-[60px] font-semibold leading-[64px] text-[#fff]">
                                        80%
                                    </h2>
                                    <p className="font-eudoxus text-[15px] font-normal leading-[24px] text-[#484848]">
                                        of faster design asset delivery
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-[232px] flex-col gap-[60px] rounded-[24px] bg-[#1a1a1a] p-6">
                                <p className="font-eudoxus text-[16px] font-medium leading-[24px] text-[#484848]">02</p>

                                <div className="space-y-[12px]">
                                    <h2 className="font-pp-mori text-[60px] font-semibold leading-[64px] text-[#fff]">
                                        $56k
                                    </h2>
                                    <p className="font-eudoxus text-[16px] font-normal leading-[24px] text-[#484848]">
                                        Saved on creative production
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-[232px] flex-col gap-[60px] rounded-[24px] bg-[#1a1a1a] p-6">
                                <p className="font-eudoxus text-[16px] font-medium leading-[24px] text-[#484848]">03</p>

                                <div className="space-y-[12px]">
                                    <h2 className="font-pp-mori text-[60px] font-semibold leading-[64px] text-[#fff]">
                                        +1M
                                    </h2>
                                    <p className="font-eudoxus text-[16px] font-normal leading-[24px] text-[#484848]">
                                        Increase in customer base
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-[232px] flex-col gap-[60px] rounded-[24px] bg-[#1a1a1a] p-6">
                                <p className="font-eudoxus text-[16px] font-medium leading-[24px] text-[#484848]">04</p>

                                <div className="space-y-[12px]">
                                    <h2 className="font-pp-mori text-[60px] font-semibold leading-[64px] text-[#fff]">
                                        +28%
                                    </h2>
                                    <p className="font-eudoxus text-[16px] font-normal leading-[24px] text-[#484848]">
                                        Monthly E-commerce visits
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerJoinUs;
