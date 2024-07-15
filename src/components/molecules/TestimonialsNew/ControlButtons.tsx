'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ControlButtons = ({ emblaApi }: { emblaApi?: any }) => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((emblaApi?: any) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="flex flex-1 items-start justify-end gap-[20px]">
            <motion.div
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                variants={{
                    visible: { opacity: 1, x: 0, rotate: [0, 180, 270, 360] },
                    hidden: { opacity: 0, x: 50 },
                }}
            >
                <motion.button
                    disabled={prevBtnDisabled}
                    onClick={onPrevButtonClick}
                    className="flex flex-1 items-start justify-end gap-[16px] rounded-full border-[1px] object-contain p-[20px] disabled:opacity-25"
                    whileHover={{
                        scale: 1.1,
                        transition: { delay: 0, duration: 0.1, ease: 'easeInOut' },
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 36 28" fill="red" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M34.6667 14H1.33337M1.33337 14L13.8334 1.5M1.33337 14L13.8334 26.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.button>
            </motion.div>
            <motion.div
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                variants={{
                    visible: { opacity: 1, x: 0, rotate: [0, 180, 270, 360] },
                    hidden: { opacity: 0, x: 50 },
                }}
            >
                <motion.button
                    disabled={nextBtnDisabled}
                    onClick={onNextButtonClick}
                    whileHover={{
                        scale: 1.1,
                        transition: { delay: 0, duration: 0.1 },
                    }}
                    className="flex flex-1 items-start justify-end gap-[16px] rounded-full border-[1px] p-[20px] disabled:opacity-25"
                >
                    <svg width="32" height="32" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22.0619 1.39515C22.672 0.784951 23.6614 0.784951 24.2716 1.39515L36.7716 13.8951C37.3818 14.5053 37.3818 15.4947 36.7716 16.1049L24.2716 28.6049C23.6614 29.215 22.672 29.215 22.0619 28.6049C21.4517 27.9947 21.4517 27.0053 22.0619 26.3951L31.8945 16.5625H2.33337C1.47043 16.5625 0.770874 15.8629 0.770874 15C0.770874 14.1371 1.47043 13.4375 2.33337 13.4375H31.8945L22.0619 3.60485C21.4517 2.99466 21.4517 2.00534 22.0619 1.39515Z"
                            fill="white"
                        />
                    </svg>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ControlButtons;
