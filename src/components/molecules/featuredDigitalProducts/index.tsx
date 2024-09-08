'use client';

import React from 'react';
import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import { caseStudies, TCaseStudy } from './data';
import './style.css';
import Link from 'next/link';

const SingleCard = ({ card = {} }: { card?: TCaseStudy }) => {
    return (
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
    );
};

const CardsRow = ({ card1, card2 }: { card1?: TCaseStudy; card2?: TCaseStudy }) => {
    return (
        <div className="flex flex-1 flex-col justify-start gap-[32px] gap-y-[40px] md:flex-row md:gap-x-[24px] md:gap-y-[24px] lg:justify-end">
            <SingleCard card={card1} />
            <SingleCard card={card2} />
        </div>
    );
};

const FeaturedDigitalProducts = () => {
    return (
        <div className="cursor-[url(/assets/icons/case-study-cursor.svg),_pointer] px-5 py-[60px] lg:py-[120px]">
            <div className="mx-auto w-full max-w-[1200px] lg:flex">
                <div className="mb-[24px] flex h-full w-full flex-row justify-between lg:sticky lg:top-[100px] lg:mb-0 lg:h-[594px] lg:max-w-[384px] lg:flex-col">
                    <div className="lg:max-w-auto max-w-[600px]">
                        <motion.h3
                            {...ANIMATE_PROPS()}
                            className="font-euxodus text-[48px] font-medium leading-[56px] text-black"
                        >
                            Featured Digital Products
                        </motion.h3>
                        <motion.p
                            {...ANIMATE_PROPS({ delay: 0.5 })}
                            className="font-euxodus mt-[16px] text-[17px] font-normal leading-[26px] text-[#484848] md:mt-[24px]"
                        >
                            Our portfolio features a diverse array of digital designs critical to the advancement of
                            contemporary businesses. It includes B2B SaaS solutions, B2C mobile applications, and
                            marketing designs for promotional purposes. We showcase work developed for both early-stage
                            startups and established enterprises across different stages of their growth.
                        </motion.p>
                    </div>

                    <div className="mt-auto hidden lg:block">
                        <Link href="/our-works">
                            <Button
                                title="SEE ALL CASE STUDIES"
                                height="56px"
                                background="blue"
                                animateRightIconOnHover
                                rightIcon="/assets/icons/arrow-top-right-white.svg"
                                className="cursor-[url(/assets/icons/case-study-cursor.svg),_pointer]"
                            />
                        </Link>
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] lg:mb-[60px] lg:h-[594px] lg:flex-row">
                        <div />
                        <CardsRow card1={caseStudies[0]} card2={caseStudies[1]} />
                    </div>
                    <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] md:mb-[180px] md:pt-[60px] lg:mb-[60px] lg:h-[594px] lg:flex-row lg:pt-[60px]">
                        <div />
                        <CardsRow card1={caseStudies[2]} card2={caseStudies[3]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedDigitalProducts;
