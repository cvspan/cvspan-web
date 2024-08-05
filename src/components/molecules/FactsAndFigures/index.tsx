'use client';
import React from 'react';
import Button from '@/components/molecules/Button';
import FactCard from './FactCard';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

const FactsAndFigures = () => {
    return (
        <>
            <div className="w-full bg-[#0C0C0C] px-5 py-[60px] lg:py-[120px]">
                <div className="mx-auto max-w-[1200px]">
                    <section className="m-auto grid w-full gap-x-6 gap-y-6 text-white md:grid-cols-2">
                        <motion.div
                            // {...ANIMATE_PROPS({ from: 'bottom' })}
                            className="w-12/12 z-1 relative mb-8 flex h-full w-full flex-col items-start gap-y-8 rounded-3xl bg-gradient-to-r from-[#000032] to-[#1919d6] bg-cover bg-center bg-no-repeat bg-origin-border p-[24px] md:p-[40px]"
                        >
                            <img
                                src="/assets/images/fact-figures.webp"
                                className="absolute left-0 top-0 h-full w-full"
                            />
                            <div className="relative z-20 flex flex-col gap-y-4">
                                <h2 className="font-pp-mori text-[34px] font-semibold leading-[42px] md:text-[60px] md:leading-[64px]">
                                    Facts & Figures
                                </h2>
                                <p className="font-eudoxus text-[14px] leading-[22px] md:text-[18px] md:leading-[26px]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>

                            <div className="relative w-full max-w-[189px]">
                                <Button
                                    title="ABOUT US"
                                    height="56px"
                                    fullWidth
                                    background="transparent"
                                    // rightIcon="/assets/icons/arrow-top-right-white.svg"
                                />
                            </div>
                        </motion.div>
                        <div className="grid gap-6 sm:grid-cols-2 sm:grid-rows-2">
                            <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0.2 })}>
                                <FactCard id={'01'} rate={80} after="%" description="of faster design asset delivery" />
                            </motion.div>
                            <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0.3 })}>
                                <FactCard
                                    id={'02'}
                                    before="$"
                                    rate={56}
                                    after="k"
                                    description="Saved on creative production"
                                />
                            </motion.div>
                            <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0.5 })}>
                                <FactCard
                                    id={'03'}
                                    before="+"
                                    rate={1}
                                    after="M"
                                    description="Increase in customer base"
                                />
                            </motion.div>
                            <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0.6 })}>
                                <FactCard
                                    id={'04'}
                                    before="+"
                                    rate={28}
                                    after="%"
                                    description="Monthly E-commerce visits"
                                />
                            </motion.div>
                        </div>
                    </section>
                </div>
            </div>
            <style>{`
                .grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(30em, 1fr));
                    grid-gap: 3em;
                }
            `}</style>
        </>
    );
};

export default FactsAndFigures;
