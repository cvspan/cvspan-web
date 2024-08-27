import React from 'react';
import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

export const SpecificJobDetail = () => {
    return (
        <>
            <section className="px-[16px] py-[60px] lg:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                        className="flex h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:h-[264px] lg:max-w-[200px]"
                    >
                        <Button
                            fullWidth
                            height="56px"
                            title="APPLY HERE"
                            rightIcon={'/assets/images/arrowUp.svg'}
                            animateRightIconOnHover
                            rightIconSize="24px"
                        />
                    </motion.div>
                    <div className="ml-auto w-full lg:max-w-[800px]">
                        <div className="flex flex-col gap-[20px]">
                            <div className="mb-[32px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-3 font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:text-[60px] lg:leading-[64px]"
                                >
                                    Design Consultant
                                </motion.div>
                                <motion.span
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1aff]"
                                >
                                    Design
                                </motion.span>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-base font-normal text-[#484848]"
                                >
                                    Fireart is an experience design & technology partner to clients large and small. We
                                    believe that great ideas are only as good as how well they perform. Our passion is
                                    for pushing the boundaries of our ideas within the limits of what’s possible. We are
                                    not satisfied until we are achieving industry-leading results in the market.
                                </motion.div>
                                <motion.div {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                    Fireart studio is looking for a UX Consultant who will be the coherent chain between
                                    the client and design team and will help to improve the design processes.
                                </motion.div>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    You are a great fit if you have…
                                </motion.div>
                                <ul className="list-inside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        at least 3 years of experience building / designing / managing IT projects
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        practical knowledge of product development cycle,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        previous experience in projects estimation,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        good understanding of current trends of web/mobile products and solution
                                        frameworks,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        ability to understand customer competition and solution landscape,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        ability to provide strategic inputs for bid response and controlling the flow
                                        and approach,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        excellent communication and analytical skills
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        excellent command of written and spoken English (C1+).
                                    </motion.li>
                                </ul>
                            </div>

                            <div className="mb-[16px]">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    What will you do:
                                </motion.div>

                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-base font-normal text-[#484848]"
                                >
                                    You will be responsible for evaluating the client needs to provide them with a
                                    complete individualized design solution. Your role will also include collaborating
                                    with the design team to give the information of client’s preferences, making the
                                    estimations of the projects, and improving and suggesting changes to the old design
                                    if requires.
                                </motion.div>
                            </div>

                            <div className="">
                                <motion.div
                                    {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}
                                    className="mb-4 font-eudoxus text-[24px] font-medium leading-[32px] text-[#1a1a1a]"
                                >
                                    What we offer
                                </motion.div>
                                <ul className="list-inside list-disc pl-2 font-eudoxus text-base font-normal text-[#484848]">
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        at least 3 years of experience building / designing / managing IT projects
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        practical knowledge of product development cycle,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        previous experience in projects estimation,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        good understanding of current trends of web/mobile products and solution
                                        frameworks,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        ability to understand customer competition and solution landscape,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        ability to provide strategic inputs for bid response and controlling the flow
                                        and approach,
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        excellent communication and analytical skills
                                    </motion.li>
                                    <motion.li {...ANIMATE_PROPS({ delay: 0, from: 'bottom' })}>
                                        excellent command of written and spoken English (C1+).
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
