import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export const OurPeople = () => {
    return (
        <div className="px-5 py-[60px] md:py-[80px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-y-[40px] lg:flex-row">
                <div className="w-full max-w-[384px]">
                    <motion.h3
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="sticky top-[100px] hidden font-eudoxus text-base font-medium leading-6 lg:block lg:text-5xl lg:leading-[56px]"
                    >
                        Our People
                    </motion.h3>

                    <h3 className="font-eudoxus text-[24px] font-medium leading-6 lg:hidden lg:text-5xl lg:leading-[56px]">
                        Our People
                    </h3>
                </div>

                <div className="w-full lg:max-w-[780px]">
                    <div className="w-full">
                        <motion.div
                            {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                            className="font-eudoxus text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:font-pp-mori lg:text-[60px] lg:leading-[64px]"
                        >
                            Be part of an international community
                        </motion.div>
                        <div className="my-8">
                            <motion.div
                                {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                className="font-eudoxus text-[18px] font-normal leading-6 text-[#484848] lg:text-lg lg:leading-[26px]"
                            >
                                At CVSpan, we believe in the power of a global perspective. As a leading design agency,
                                we are proud to be part of an international community of talented professionals who
                                bring diverse ideas, experiences, and creativity to every project. Our remote-first
                                approach allows us to collaborate with clients and team members from all corners of the
                                world, fostering an inclusive environment where innovation thrives. Become part of an
                                international community that values creativity, collaboration, and excellence. Together,
                                we create impactful designs that make a difference on a global scale. Let’s shape the
                                future of digital experiences, one project at a time.
                            </motion.div>
                        </div>

                        <div className="h-auto w-full flex-row gap-[24px] lg:flex lg:h-[478px]">
                            <motion.div
                                {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                className="mb-[24px] h-[229px] flex-1 shrink-0 overflow-hidden rounded-xl bg-red-600 lg:mb-0 lg:h-full"
                            >
                                <img
                                    src="/assets/images/our-people-1.png"
                                    className="h-full w-full object-cover"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                />
                            </motion.div>
                            <div className="flex h-[250px] flex-1 flex-col gap-[24px] md:h-[400px] lg:h-full">
                                <div className="flex h-full flex-1 gap-[24px] overflow-hidden rounded-xl">
                                    <motion.div
                                        {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                        className="flex-1 overflow-hidden rounded-xl bg-blue-500"
                                    >
                                        <img
                                            src="/assets/images/our-people-2.png"
                                            className="h-full w-full object-cover"
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </motion.div>
                                    <motion.div
                                        {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                        className="flex-1 overflow-hidden rounded-xl bg-blue-500"
                                    >
                                        <img
                                            src="/assets/images/our-people-3.png"
                                            className="h-full w-full object-cover"
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </motion.div>
                                </div>
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="h-full flex-1 overflow-hidden rounded-xl"
                                >
                                    <img
                                        src="/assets/images/our-people-4.png"
                                        className="h-full w-full object-cover"
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
