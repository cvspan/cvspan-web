'use client';
import { ITestimonials } from '@/types';
import React from 'react';

const CustomCarousel = ({
    emblaRef,
    slides = [],
    selectedIndex,
}: {
    emblaRef?: any;
    slides?: ITestimonials[];
    selectedIndex?: any;
}) => {
    return (
        <section className="m-auto max-w-[100%]">
            <div className="overflow-hidden" ref={emblaRef}>
                <div
                    className="flex touch-pan-y gap-[18px] md:gap-[24px]"
                    style={{
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {slides.map((item, index) => {
                        const hasLongerDescription = `${item?.descriptionBG}`.length > 253;

                        return (
                            <div
                                className={`${selectedIndex === index ? '' : 'opacity-45'} gradient-border flex h-[340px] w-[280px] shrink-0 flex-grow-0 flex-col items-start gap-[24px] rounded-xl p-[16px] md:h-[364px] md:w-[659px] md:gap-[32px] md:p-6 xl:p-[40px]`}
                                key={item?.id}
                                // style={{
                                //     border: '1px solid',
                                //     borderImageSlice: 1,
                                //     borderImageSource:
                                //         'linear-gradient(to right, rgba(104, 104, 104, 1), rgba(39, 39, 39, 1), rgba(39, 39, 39, 1),rgba(104, 104, 104)',
                                // }}
                            >
                                <img
                                    src={'/assets/icons/green-quote.svg'}
                                    className="w-[20px] md:w-[37px]"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />

                                <div className="hidden w-full overflow-hidden md:block">
                                    <p className="w-full text-ellipsis text-left text-[16px] leading-[26px] text-[#D1D1D1]">
                                        {item?.descriptionBG}
                                    </p>
                                </div>

                                <div className="block md:hidden">
                                    <p className="text-center text-[13px] font-[400] leading-[20px] text-[#D1D1D1] md:text-[14px] md:leading-[22px]">
                                        {item?.descriptionSM}
                                    </p>
                                </div>

                                <div className="flex w-full flex-row items-center justify-center gap-[16px] md:justify-start">
                                    <div className="h-[40px] w-[40px] overflow-hidden rounded-full bg-[#D9D9D9] md:h-[60px] md:w-[60px]">
                                        <img
                                            src={item?.avatar}
                                            className="h-full w-full"
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[16px] font-[500] leading-[24px] text-[#ffffff]">
                                            {item?.name}
                                        </p>
                                        <p className="text-[12px] leading-[16px] text-[#A3A3A3] md:text-[14px] md:leading-[22px]">
                                            {item?.position}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CustomCarousel;
