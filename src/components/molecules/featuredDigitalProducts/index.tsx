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
        <div className="flex flex-1 flex-col justify-start gap-[32px] gap-y-[40px] md:flex-row md:gap-x-[24px] md:gap-y-[24px] lg:justify-end">
            <SingleCard />
            <SingleCard />
        </div>
    );
};

const FeaturedDigitalProducts = () => {
    return (
        <div className="px-5 py-[60px] lg:py-[120px]">
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
                        <Button
                            title="SEE ALL CASE STUDIES"
                            height="56px"
                            background="blue"
                            animateRightIconOnHover
                            rightIcon="/assets/icons/arrow-top-right-white.svg"
                        />
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] lg:mb-[60px] lg:h-[594px] lg:flex-row">
                        <div />
                        <CardsRow />
                    </div>
                    <div className="mx-auto flex h-auto w-full max-w-[1200px] flex-col gap-[24px] md:mb-[180px] md:pt-[60px] lg:mb-[60px] lg:h-[594px] lg:flex-row lg:pt-[60px]">
                        <div />
                        <CardsRow />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedDigitalProducts;
