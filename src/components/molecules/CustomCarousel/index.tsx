'use client';
import React from 'react';

const CustomCarousel = ({
    emblaRef,
    slides = [],
    selectedIndex,
}: {
    emblaRef?: any;
    slides?: any;
    selectedIndex?: any;
}) => {
    return (
        <section className="m-auto max-w-[100%]">
            <div className="overflow-hidden" ref={emblaRef}>
                <div
                    className="flex touch-pan-y gap-[20px] lg:gap-[50px] xl:gap-[76px]"
                    style={{
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {slides.map((item?: any, index?: any) => (
                        <div
                            className={`${selectedIndex === index ? '' : 'opacity-45'} flex h-auto min-w-[80%] flex-col items-start gap-[32px] rounded-[15px] border-[1px] p-[24px] sm:min-w-[500px] md:h-[336px] md:min-w-[600px] md:border-[0.5px] xl:min-w-[800px] xl:p-[40px]`}
                            key={item?.id}
                            style={{
                                border: '1px solid',
                                borderImageSlice: 1,
                                borderImageSource:
                                    'linear-gradient(to right, rgba(104, 104, 104, 1), rgba(39, 39, 39, 1), rgba(39, 39, 39, 1),rgba(104, 104, 104)',
                            }}
                        >
                            <img src={'/assets/icons/green-quote.svg'} className="w-[37px]" />

                            <p className="text-center text-[14px] font-[400] text-[#D1D1D1] md:text-left md:text-[18px] md:leading-[22px] md:leading-[26px]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.{' '}
                            </p>

                            <div className="flex w-full flex-row items-center gap-[16px]">
                                <div className="h-[40px] w-[40px] rounded-full bg-[#D9D9D9] md:h-[60px] md:w-[60px]"></div>
                                <div>
                                    <p className="text-[16px] font-[500] leading-[24px] text-[#ffffff]">Moses Arfo</p>
                                    <p className="text-[14px] leading-[22px] text-[#A3A3A3]">CEO CVSpan Limited</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomCarousel;
