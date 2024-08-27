'use client';
import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

const WhatToExpect = () => {
    return (
        <>
            <section className="bg-[#F5F5F5] px-[16px] py-[60px] lg:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="w-full max-w-[300px] flex-col lg:sticky lg:top-[100px] lg:flex lg:h-[264px]"
                    >
                        <h4
                            className="font-eudoxus font-medium text-[#1A1A1A]"
                            style={{ fontSize: 'clamp(1.5rem, 4.6875vw, 2.125rem)' }}
                        >
                            WHAT TO EXPECT
                        </h4>
                    </motion.div>

                    <div className="ml-auto flex w-full flex-row flex-wrap gap-[24px] lg:max-w-[780px]">
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                User-centered Approach
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We prioritize users, conducting thorough research to create designs that resonate,
                                enhancing engagement and fostering lasting connections.
                            </p>
                        </motion.div>
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Data-Informed Decisions
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We apply user behaviour insights to link design choices with data, resulting in optimal
                                usability and effective interactions.
                            </p>
                        </motion.div>
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Holistic Strategy
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We perfectly integrate UX, UI, and functionality, creating designs that authentically
                                reflect your brand while providing comprehensive and unified experiences.
                            </p>
                        </motion.div>
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0.1 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Tailored solutions
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We delve into user personas, creating tailored solutions to specific difficulties and
                                ensuring designs are properly aligned with user needs.
                            </p>
                        </motion.div>
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0.1 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Timely Delivery
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                Our efficient workflows and strategic planning ensure that projects are delivered on
                                time, without compromising your deadlines.
                            </p>
                        </motion.div>
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0.1 })}
                            className="flex w-full flex-col gap-[30px] bg-white p-[32px] md:max-w-[378px]"
                        >
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Long Term-viability
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                With foresight, we build for durability, anticipating trends and changes, resulting in
                                long-term relevance and fewer modifications.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default WhatToExpect;
