'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import { caseStudies, TCaseStudy } from './data';
import './style.css';
import Link from 'next/link';

const SingleCard = ({ card = {} }: { card?: TCaseStudy }) => {
    return (
        <Link href="/our-works/case-study">
            <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="fdp_card" whileHover="on_hover">
                <div className="fdp_card_img_wrapper">
                    <img src={card?.img} className="h-full w-full object-cover" />
                </div>
                <div className="fdp_card_title_wrapper">
                    <h2 className="fdp_card_title">{card?.title}</h2>
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
                    {card?.description}
                </motion.h2>
            </motion.div>
        </Link>
    );
};

const CardsRow = ({ card1, card2 }: { card1?: TCaseStudy; card2?: TCaseStudy }) => {
    return (
        <div className="flex h-fit flex-1 flex-col items-center justify-center gap-[32px] gap-y-[40px] py-[60px] md:flex-row md:gap-x-[24px] md:gap-y-[24px]">
            <SingleCard card={card1} />
            <SingleCard card={card2} />
            <SingleCard card={card2} />
        </div>
    );
};

const CaseStudies = () => {
    return (
        <div className="px-5 py-[60px]">
            <div className="mx-auto w-full max-w-[1200px] lg:flex">
                <div className="h-fit w-full">
                    {/* <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] md:mb-[180px] md:pt-[60px] lg:mb-[60px] lg:h-[594px] lg:flex-row lg:pt-[60px]"> */}
                    <div className="flex h-fit w-full max-w-[1200px] flex-col gap-[24px] lg:flex-row">
                        <CardsRow card1={caseStudies[0]} card2={caseStudies[1]} />
                    </div>
                    {/* <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] md:mb-[180px] md:pt-[60px] lg:mb-[60px] lg:h-[594px] lg:flex-row lg:pt-[60px]"> */}
                    <div className="flex h-fit w-full max-w-[1200px] flex-col gap-[24px] lg:flex-row">
                        <CardsRow card1={caseStudies[2]} card2={caseStudies[3]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;
