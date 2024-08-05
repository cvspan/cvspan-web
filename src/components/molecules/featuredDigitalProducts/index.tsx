'use client';

import React from 'react';
import Button from '../Button';

const SingleCard = () => {
    return (
        <div className="flex h-fit w-full flex-col overflow-hidden md:h-[594px] md:max-w-[336px]">
            <div className="min-h-[230px] w-full flex-1 overflow-hidden bg-[#D9D9D9] md:h-full md:max-w-[336px]"></div>
            <div className="flex w-full items-center justify-between py-[24px]">
                <h2 className="text-[24px] font-[500] leading-[32px] text-[#1A1A1A] md:text-[34px] md:leading-[42px]">
                    Insight
                </h2>

                <img className="h-[22px] w-[22px]" src="/assets/icons/arrow-top-right-black.svg" />
            </div>
            <h2 className="text-[18px] font-[400] leading-[26px] text-[#484848] md:text-[16px] md:leading-[24px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore{' '}
            </h2>
        </div>
    );
};

const CardsRow = () => {
    return (
        <div className="flex flex-1 flex-col justify-start gap-[24px] md:flex-row lg:justify-end">
            <SingleCard />
            <SingleCard />
        </div>
    );
};

const FeaturedDigitalProducts = () => {
    return (
        <div className="px-5 py-[60px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px]">
                <div className="flex h-full w-full flex-row justify-between lg:mb-0 lg:h-[594px] lg:max-w-[384px] lg:flex-col">
                    <div className="lg:max-w-auto max-w-[600px]">
                        <h3 className="font-euxodus text-[48px] font-medium leading-[56px] text-black">
                            Featured Digital Products
                        </h3>
                        <p className="font-euxodus mt-[16px] text-[18px] font-normal leading-[26px] text-[#484848] md:mt-[24px]">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta
                        </p>
                    </div>

                    <div className="mt-auto hidden lg:block">
                        <Button
                            title="SEE ALL CASE STUDIES"
                            height="56px"
                            background="blue"
                            rightIcon="/assets/icons/arrow-top-right-white.svg"
                        />
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="mx-auto mb-[60px] flex h-auto w-full max-w-[1200px] flex-col gap-[24px] lg:h-[594px] lg:flex-row">
                        <div />
                        <CardsRow />
                    </div>
                    <div className="mx-auto mb-[60px] flex h-auto w-full max-w-[1200px] flex-col gap-[24px] pt-[60px] md:mb-[180px] md:pt-[180px] lg:h-[594px] lg:flex-row">
                        <div />
                        <CardsRow />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedDigitalProducts;
