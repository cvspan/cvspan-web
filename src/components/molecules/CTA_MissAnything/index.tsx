'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import { useRouter } from 'next/navigation';

const CTA_MissAnything = () => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push('/careers/open-position')}
            className="bg-cta-bg m-auto h-[300px] w-full bg-cover bg-center bg-no-repeat bg-origin-border py-[60px] pb-12 pl-6 pr-6 pt-12 text-white lg:h-[630px] lg:py-[120px]"
        >
            <div className="m-auto flex h-full w-full max-w-[1200px] flex-col justify-between gap-[40px] md:flex-row">
                <motion.div {...ANIMATE_PROPS({ from: 'left' })}>
                    <h1
                        className="font-euxodus max-w-[580px] font-medium text-white"
                        style={{ fontSize: 'clamp(3rem, 8.6875vw, 7.5rem)', lineHeight: 1 }}
                    >
                        Don’t miss anything
                    </h1>
                </motion.div>
                <motion.div
                    {...ANIMATE_PROPS({ from: 'right' })}
                    className="flex w-full max-w-[580px] flex-col gap-5 md:items-end md:justify-between lg:justify-between"
                >
                    <motion.div
                        whileHover="on_hover"
                        className="group mt-[100px] flex w-full items-center justify-between gap-5 self-end border-b-[1px] border-b-[#fefefe] pb-[24px] lg:mt-[0px] lg:self-end lg:justify-self-end"
                    >
                        <motion.h4 className="text-[24px] leading-[42px] group-hover:text-white/80 lg:text-[34px]">
                            Subscribe to newsletter
                        </motion.h4>

                        <motion.img
                            initial={{ x: '-30px', y: 30, opacity: 0 }}
                            variants={{
                                on_hover: {
                                    x: 0,
                                    y: 0,
                                    opacity: 1,
                                },
                            }}
                            src="/assets/icons/arrow-up-big-white.svg"
                            className="hidden h-[40px] w-[40px] group-hover:block"
                        />

                        <motion.img
                            initial={{ x: 0, y: 0, opacity: 1 }}
                            variants={{
                                on_hover: {
                                    x: 30,
                                    y: -30,
                                    opacity: 0,
                                },
                            }}
                            src="/assets/icons/arrow-up-big-white.svg"
                            className="h-[24px] w-[24px] group-hover:hidden lg:h-[40px] lg:w-[40px]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CTA_MissAnything;
