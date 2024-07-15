'use client';
import * as React from 'react';
import { clients } from './data';
import CustomCarousel from '@/components/molecules/CustomCarousel';
import ControlButtons from './ControlButtons';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from './DotButton';

const options = { startIndex: 1 };

function TestimonialsNew() {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    return null;
    return (
        <>
            <div className="bg-[#0C0C0C] py-[50px] md:py-[100px]">
                <div className="widow-main">
                    <div className="widow-inner">
                        <div className="mx-auto mb-[32px] flex w-full max-w-[1200px] items-center justify-between sm:mb-[60px]">
                            <h3 className="font-euxodus text-left text-[48px] font-medium leading-[56px] text-white">
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

                <div className="mt-[40px] flex justify-center gap-[5px]">
                    {scrollSnaps.map((_, index) => (
                        <DotButton key={index} onClick={() => onDotButtonClick(index)}>
                            <img
                                src={
                                    selectedIndex === index
                                        ? '/assets/icons/dot-black.svg'
                                        : '/assets/icons/dot-black.svg'
                                }
                            />
                        </DotButton>
                    ))}
                </div>
            </div>
        </>
    );
}

export default TestimonialsNew;
