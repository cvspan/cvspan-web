import React from 'react';
import image from '../../../../public/assets/images/image 28.png';
import Image from 'next/image';
import Button from '../Button';

type Props = {};

const stats = [
    {
        id: '01',
        percentage: '80%',
        description: 'of faster design asset delivery',
    },
    {
        id: '02',
        amount: '$56k',
        description: 'Saved on creative production',
    },
    {
        id: '03',
        number: '+1M',
        description: 'Increase in customer base',
    },
    {
        id: '04',
        percentage: '+28%',
        description: 'Monthly E-commerce visits',
    },
];

const CareerJoinUs = (props: Props) => {
    return (
        <div className="bg-[#0c0c0c] py-[60px] lg:py-[120px]">
            <div className="mx-auto w-[335px] lg:h-[488px] lg:w-[1200px]">
                <div className="flex h-full flex-col gap-6 lg:flex-row">
                    <div className="relative h-[461px] w-full rounded-[24px] bg-gray-600 bg-[url('/assets/images/ribbon.png')] bg-cover bg-center p-6 lg:h-full lg:p-10">
                        <div
                            className="pointer-events-none absolute inset-0 z-10 rounded-[24px] opacity-50"
                            style={{
                                background: 'linear-gradient(to right, #1a1aff , #000032)',
                            }}
                        ></div>
                        <div className="absolute bottom-0 right-0 z-20 overflow-hidden rounded-[24px]">
                            <Image src={image} alt="ellipse" className="" />
                        </div>

                        <div className="relative z-30 space-y-8">
                            <h4 className="font-pp-mori text-[34px] font-medium leading-[42px] text-white lg:text-[60px] lg:font-semibold lg:leading-[64px]">
                                Join a native <br /> remote company
                            </h4>
                            <p className="text-[14px] font-normal leading-[20px] text-white md:text-[18px] md:leading-[26px]">
                                CVSpan has been fully remote since day 1. We've grown the team without any geographical
                                or cultural boundaries. Our business is remote-first in all aspects. We like to
                                over-communicate, set clear expectations, and shared goals.
                            </p>
                            <Button
                                height="56px"
                                title="ABOUT US"
                                leftIcon={'/assets/images/arrowUp.svg'}
                                background="transparent"
                            />
                        </div>
                    </div>

                    <div className="h-full w-full">
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex h-[198px] w-[157.5px] flex-col gap-[32px] rounded-[24px] bg-[#1a1a1a] p-6 lg:h-[232px] lg:w-full lg:gap-[60px]"
                                >
                                    <p className="font-eudoxus text-[16px] font-medium leading-[24px] text-[#484848]">
                                        {stat.id}
                                    </p>

                                    <div className="space-y-[12px]">
                                        <h2 className="font-pp-mori text-[34px] font-medium leading-[42px] text-[#fff] lg:text-[60px] lg:font-semibold lg:leading-[64px]">
                                            {stat.percentage || stat.amount || stat.number}
                                        </h2>
                                        <p className="font-eudoxus text-[12px] font-normal leading-[24px] text-[#484848] lg:text-[16px] lg:leading-[20px]">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerJoinUs;
