'use client';

import Image from 'next/image';
import TestimonialCard from '../mini-components/testimonialCard/TestimonialCard';
import data from '../testimonials/testimonialData';
import { useEffect, useState } from 'react';
import goodluck from '../../../../../public/assets/images/goodluck.jpg';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(1);

    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth >= 768) {
                setItemsToShow(2);
            } else {
                setItemsToShow(1);
            }
        };
        updateItemsToShow();

        window.addEventListener('resize', updateItemsToShow);

        return () => {
            window.removeEventListener('resize', updateItemsToShow);
        };
    }, []);

    const nextTestimony = () => {
        setCurrentIndex((prevIndex) => (prevIndex + itemsToShow) % data.length);
    };

    const prevTestimony = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - itemsToShow < 0 ? data.length - itemsToShow : prevIndex - itemsToShow,
        );
    };
    return (
        <div className="overflow-hidden">
            <div className="flex w-full flex-col gap-10">
                <div className="flex w-full flex-col items-start justify-between gap-5">
                    <h3 className="font-euxodus-bold lg:w-5/12">What Do People Say About Us</h3>
                    <div className="flex gap-x-8">
                        <button
                            onClick={prevTestimony}
                            className="flex items-center justify-center rounded-full border border-solid border-tundora p-2.5"
                        >
                            <svg
                                className="opacity-25"
                                width="32"
                                height="32"
                                viewBox="0 0 36 28"
                                fill="red"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M34.6667 14H1.33337M1.33337 14L13.8334 1.5M1.33337 14L13.8334 26.5"
                                    stroke="white"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={nextTestimony}
                            className="flex items-center justify-center rounded-full border border-solid border-white p-2.5"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 38 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.0619 1.39515C22.672 0.784951 23.6614 0.784951 24.2716 1.39515L36.7716 13.8951C37.3818 14.5053 37.3818 15.4947 36.7716 16.1049L24.2716 28.6049C23.6614 29.215 22.672 29.215 22.0619 28.6049C21.4517 27.9947 21.4517 27.0053 22.0619 26.3951L31.8945 16.5625H2.33337C1.47043 16.5625 0.770874 15.8629 0.770874 15C0.770874 14.1371 1.47043 13.4375 2.33337 13.4375H31.8945L22.0619 3.60485C21.4517 2.99466 21.4517 2.00534 22.0619 1.39515Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex h-full items-center overflow-x-hidden">
                    <div className="flex gap-8">
                        {data.slice(currentIndex, currentIndex + itemsToShow).map((testimony, index) => (
                            <div className="md:w-6/12">
                                <TestimonialCard
                                    key={index}
                                    name={testimony.name}
                                    profession={testimony.profession}
                                    testimony={testimony.testimony}
                                    image={goodluck}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
