'use client';
import React from 'react';
import Image from 'next/image';
import Arrow1 from '../../../public/Frame 1171275131.png';
import Arrow2 from '../../../public/Frame 1171275132.png';
import { useState } from 'react';
import Vector from '../../../public/Vector.png';
import avatar from '../../../public/pic-3.png';

// Define a type for the slide
interface Slide {
  id: number;
  content: string;
  name: string;
  position: string;
}

const Testimonial: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
    {
      id: 2,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
    {
      id: 3,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
    {
      id: 4,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
    {
      id: 6,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
    {
      id: 5,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      name: 'Moses Arfo',
      position: 'CEO CVSpan Limited',
    },
  ];

  console.log(window.innerWidth)

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentIndex((currentIndex + 2) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentIndex((currentIndex - 2 + slides.length) % slides.length);
  };

  return (
    <div className="bg-[#0c0c0c] px-5 py-10 md:px-40">
      <div className="top flex items-start justify-between gap-5 md:gap-20">
        <div className="w-1/2">
          <h1 className="text-2xl font-medium leading-7 text-white md:text-[48px] md:leading-[56px]">What Do People Say About Us</h1>
        </div>
        <div className="flex w-1/2 justify-end gap-2 md:gap-5">
          <button onClick={prevSlide}>
            <Image src={Arrow2} alt="Previous" width={30} height={30} />
          </button>
          <button onClick={nextSlide}>
            <Image src={Arrow1} alt="Next" width={30} height={30} />
          </button>
        </div>
      </div>
      <div className="relative mt-10 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * (window.innerWidth <= 768 ? 50 : 100)}%)` }} // Adjust transform based on screen size
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full p-4 md:min-w-1/2">
              <div className="flex h-full w-full flex-col rounded-[12px] border-[0.5px] border-solid p-10">
                <span className="">
                  <Image src={Vector} alt="vector" width={30} height={30} />
                </span>
                <p className="mt-6 text-[18px] font-normal leading-[26px] text-white font-pp-mori">
                  {slide.content}
                </p>

                <div className="mt-6 flex gap-3">
                  <Image src={avatar} alt="avatar" className="h-10 w-10 rounded-full" />
                  <div>
                    <h1 className="text-[16px] font-medium leading-[24px] text-white">{slide.name}</h1>
                    <p className="text-[14px] font-normal leading-[22px] text-[#A3A3A3]">{slide.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
