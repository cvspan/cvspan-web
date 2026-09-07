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
        <div className="flex flex-1 items-start justify-end gap-[32px]">
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
                    className="disabled:opacity-25"
                    whileHover={{
                        scale: 1.1,
                        transition: { delay: 0, duration: 0.1, ease: 'easeInOut' },
                    }}
                >
                    <img
                        src="/assets/icons/circled-arrow-right-white.svg"
                        className="h-[70px] w-[70px] rotate-[180deg] object-contain"
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
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
                    className="h-[70px] w-[70px] object-contain disabled:opacity-25"
                >
                    <img src="/assets/icons/circled-arrow-right-white.svg" alt="" loading="lazy" decoding="async" />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ControlButtons;
