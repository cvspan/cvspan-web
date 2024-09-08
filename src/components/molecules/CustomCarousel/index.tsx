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
                                className={`${selectedIndex === index ? '' : 'opacity-45'} relative flex h-[340px] w-[280px] shrink-0 flex-grow-0 flex-col items-start gap-[32px] rounded-[15px] p-[24px] md:h-[364px] md:w-[659px] xl:p-[40px]`}
                                key={item?.id}
                                // style={{
                                //     border: '1px solid',
                                //     borderImageSlice: 1,
                                //     borderImageSource:
                                //         'linear-gradient(to right, rgba(104, 104, 104, 1), rgba(39, 39, 39, 1), rgba(39, 39, 39, 1),rgba(104, 104, 104)',
                                // }}
                            >
                                {/* <img
                                    src={
                                        hasLongerDescription
                                            ? '/assets/images/border-faq-lg.svg'
                                            : '/assets/images/border-faq-bg.svg'

                                    }
                                    className="absolute left-0 top-0 hidden h-full w-full md:block"
                                /> */}

                                <img
                                    src={'/assets/images/border-faq-lg.svg'}
                                    className="absolute left-0 top-0 hidden h-full w-full md:block"
                                />
                                <img
                                    src="/assets/images/border-faq-sm.svg"
                                    className="absolute left-0 top-0 block h-full w-full md:hidden"
                                />

                                <img src={'/assets/icons/green-quote.svg'} className="w-[37px]" />

                                <div className="hidden w-full overflow-hidden md:block">
                                    <p className="w-full text-ellipsis text-left text-[16px] leading-[26px] text-[#D1D1D1]">
                                        {item?.descriptionBG}
                                    </p>
                                </div>

                                <div className="block md:hidden">
                                    <p className="text-center text-[14px] font-[400] leading-[22px] text-[#D1D1D1]">
                                        {item?.descriptionSM}
                                    </p>
                                </div>

                                <div className="flex w-full flex-row items-center gap-[16px]">
                                    <div className="h-[40px] w-[40px] overflow-hidden rounded-full bg-[#D9D9D9] md:h-[60px] md:w-[60px]">
                                        <img src={item?.avatar} className="h-full w-full" />
                                    </div>
                                    <div>
                                        <p className="text-[16px] font-[500] leading-[24px] text-[#ffffff]">
                                            {item?.name}
                                        </p>
                                        <p className="text-[12px] leading-[20px] text-[#A3A3A3] md:text-[14px] md:leading-[22px]">
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
