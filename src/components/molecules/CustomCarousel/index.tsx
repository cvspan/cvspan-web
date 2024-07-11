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
                            className={`${selectedIndex === index ? '' : 'opacity-45'} flex h-auto min-w-[80%] flex-col items-center gap-[32px] bg-white p-[32px] sm:min-w-[500px] md:h-[336px] md:min-w-[600px] md:flex-row xl:min-w-[800px] xl:gap-[40px] xl:p-[60px]`}
                            key={item?.id}
                        >
                            <img
                                src={item?.avatar}
                                className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full xl:mb-auto xl:h-[168px] xl:w-[168px]"
                            />
                            <div>
                                <p className="text_18 text-center text-[#2D2D2D] md:text-left">{item?.description}</p>
                                <p className="text_24 mt-[24px] text-center font-[500] text-[#161616] md:text-left">
                                    {item?.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomCarousel;
