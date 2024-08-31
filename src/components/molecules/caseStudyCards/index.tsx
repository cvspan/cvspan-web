'use client';

import React from 'react';
import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import './style.css';

const SingleCard = () => {
    return (
        <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="fdp_card" whileHover="on_hover">
            <div className="fdp_card_img_wrapper" />
            <div className="fdp_card_title_wrapper">
                <h2 className="fdp_card_title">Insight</h2>
                {/* <img className="arrow_black h-[22px] w-[22px]" src="/assets/icons/arrow-top-right-black.svg" />
                <img className="arrow_blue h-[22px] w-[22px]" src="/assets/icons/arrow-top-right-blue.svg" /> */}

                <motion.img
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    variants={{
                        on_hover: {
                            x: 20,
                            y: -30,
                            opacity: 0,
                            transition: { duration: 0.2 },
                        },
                    }}
                    src="/assets/icons/arrow-top-right-black.svg"
                    className="arrow_black h-[22px] w-[22px]"
                />

                <motion.img
                    initial={{ x: -20, y: 30, opacity: 0 }}
                    variants={{
                        on_hover: {
                            x: 0,
                            y: 0,
                            opacity: 1,
                            transition: { duration: 0.2 },
                        },
                    }}
                    src="/assets/icons/arrow-top-right-blue.svg"
                    className="arrow_blue h-[22px] w-[22px]"
                />
            </div>
            <motion.h2
                variants={{
                    on_hover: {
                        opacity: 0,
                        height: 0,
                    },
                }}
                className="fdp_card_desc"
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore{' '}
            </motion.h2>
        </motion.div>
    );
};

const CardsRow = () => {
    return (
        <div className="flex h-fit flex-1 flex-col items-center justify-center gap-[32px] gap-y-[40px] py-[60px] md:flex-row md:gap-x-[24px] md:gap-y-[24px]">
            <SingleCard />
            <SingleCard />
            <SingleCard />
        </div>
    );
};

const CaseStudies = () => {
    return (
        <div className="px-5 py-[60px]">
            <div className="mx-auto w-full max-w-[1200px] lg:flex">
                <div className="h-fit w-full">
                    {/* <div className="mx-auto flex h-fit w-full max-w-[1200px] flex-col gap-[24px] bg-red-400 lg:mb-[60px] lg:h-[594px] lg:flex-row">
                        <div />
                        <CardsRow />
                    </div>
                    <div className="mx-auto flex h-fit w-full max-w-[1200px] flex-col gap-[24px] md:mb-[180px] md:pt-[60px] lg:mb-[60px] lg:h-[594px] lg:flex-row lg:pt-[60px]">
                        <div />
                        <CardsRow />
                    </div> */}
                    <div className="flex h-fit w-full max-w-[1200px] flex-col gap-[24px] lg:flex-row">
                        <CardsRow />
                    </div>
                    <div className="flex h-fit w-full max-w-[1200px] flex-col gap-[24px] lg:flex-row">
                        <CardsRow />
                    </div>
                    <div className="flex h-fit w-full max-w-[1200px] flex-col gap-[24px] lg:flex-row">
                        <CardsRow />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;
