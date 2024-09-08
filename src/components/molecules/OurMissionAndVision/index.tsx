import React from 'react';
import Button from '@/components/molecules/Button';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import Link from 'next/link';
export const OurVisionAndMission = () => {
    return (
        <div className="px-5 py-[60px] lg:py-[120px]">
            <div className="m-auto max-w-[1200px]">
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-2 lg:gap-6">
                    <div className="col-span-2 rounded-3xl bg-[#f5f5f5] px-5 lg:px-0">
                        <div className="grid min-h-[354px] grid-cols-2 overflow-hidden lg:ml-[40.5px] lg:grid-cols-3">
                            <div className="col-span-2 flex w-full flex-col gap-y-8 pt-6 lg:col-span-1 lg:my-10">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0 })}
                                    className="font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] md:hidden"
                                >
                                    Our Vision and <br /> Mission
                                </motion.div>
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0 })}
                                    className="hidden w-[385px] font-pp-mori text-6xl font-semibold leading-[64px] text-[#1a1a1a] md:block"
                                >
                                    Our Vision <br />
                                    and Mission
                                </motion.div>

                                <div className="w-full md:w-fit lg:mt-auto">
                                    <Link href={'/careers/open-position'}>
                                        <Button
                                            height="56px"
                                            title="SEE JOB OPENINGS"
                                            rightIconSize="12px"
                                            rightIcon="/assets/icons/arrow-top-right-white.svg"
                                            animateRightIconOnHover
                                            fullWidth
                                        />
                                    </Link>
                                </div>
                            </div>

                            <div className="col-span-2 flex h-full max-h-[354px] justify-end pt-[40px]">
                                <img src="/assets/images/workflow.webp" className="h-full" />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="rounded-3xl bg-[#f5f5f5]">
                            <div className="p-6 lg:p-10">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0 })}
                                    className="font-eudoxus text-2xl font-medium leading-8 text-[#1a1a1a] lg:text-[34px] lg:leading-[42px]"
                                >
                                    CVSpan’s Vision is to create more equal opportunities globally, by accelerating the
                                    world’s transition to online work.
                                </motion.div>
                                <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="mt-6">
                                    <span className="font-eudoxus text-base font-normal leading-6 text-[#484848] lg:text-lg lg:leading-[26px]">
                                        We believe online work is the greatest equalizer in the 21st century - unlocking
                                        the globalization of services and democratizing opportunities for both talent
                                        and companies.
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="h-full rounded-3xl bg-[#f5f5f5]">
                            <div className="p-6 lg:p-10">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0 })}
                                    className="font-eudoxus text-2xl font-medium leading-8 text-[#1a1a1a] lg:text-[34px] lg:leading-[42px]"
                                >
                                    CVSpan’s Mission is to build the best creative service in the world.
                                </motion.div>
                                <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="mt-6">
                                    <span className="font-eudoxus text-base font-normal leading-6 text-[#484848] lg:text-lg lg:leading-[26px]">
                                        To create more equal opportunities globally, we believe creativity is an
                                        excellent place to start. It is not constrained by language, we are all
                                        increasingly part of the same global monoculture.
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
