'use client';
import * as React from 'react';
import { clients } from './data';
import CustomCarousel from '@/components/molecules/CustomCarousel';
import ControlButtons from './ControlButtons';
import useEmblaCarousel from 'embla-carousel-react';
import { useDotButton } from './DotButton';

const options = { startIndex: 1 };

function TestimonialsNew() {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const { selectedIndex } = useDotButton(emblaApi);

    return (
        <>
            <div className="bg-[#0C0C0C] px-5 py-[60px] md:py-[120px]">
                <div className="widow-main">
                    <div className="widow-inner">
                        <div className="mx-auto mb-[32px] flex w-full max-w-[1200px] items-center justify-between sm:mb-[60px]">
                            <h3 className="font-euxodus text-left text-[34px] font-medium leading-[42px] text-white md:text-[48px] md:leading-[56px]">
                                What Do People Say <br />
                                About Us
                            </h3>
                            <div className="hidden sm:flex">
                                <ControlButtons emblaApi={emblaApi} />
                            </div>
                        </div>
                    </div>
                </div>
                <CustomCarousel slides={clients} emblaRef={emblaRef} selectedIndex={selectedIndex} />
            </div>
        </>
    );
}

export default TestimonialsNew;
