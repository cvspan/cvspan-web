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
            <div className="bg-[#f4f1ec] py-[50px] md:py-[100px]">
                <div className="widow-main">
                    <div className="widow-inner">
                        <div className="mb-[32px] flex items-center justify-between sm:mb-[60px]">
                            <h1 className="text_60 text-[#161616]">Our Clients</h1>
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
