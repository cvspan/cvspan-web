'use client';

import React, { useEffect } from 'react';
import SplitType from 'split-type';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/src/ScrollTrigger';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
gsap.registerPlugin(ScrollTrigger);

type Props = {
    solution: string;
    challenge: string;
};

const AboutProject: React.FC<Props> = ({ solution, challenge }) => {
    useGSAP(() => {
        // Typed as HTMLElement so `dataset` is available and SplitType accepts the
        // node; querySelectorAll returns plain Elements otherwise.
        const splitTypes = document.querySelectorAll<HTMLElement>('.reveal-type');

        splitTypes.forEach((char, i) => {
            const bg = char?.dataset?.bgColor;
            const fg = char?.dataset?.fgColor;

            const text = new SplitType(char, { types: 'chars' });

            gsap.fromTo(
                text.chars,
                {
                    color: bg,
                },
                {
                    color: fg,
                    duration: 0.3,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: char,
                        start: 'top 70%',
                        end: 'top 20%',
                        scrub: true,
                        markers: false,
                        toggleActions: 'play play reverse reverse',
                    },
                },
            );
        });

        return () => {};
    }, {});

    return (
        <div className="px-5 py-[60px] md:py-[80px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-y-[40px] lg:flex-row">
                <div className="w-full max-w-[384px]">
                    <motion.h3
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="sticky top-[100px] hidden font-eudoxus text-[34px] font-[500] leading-[42px] md:text-[48px] md:leading-[56px] lg:block"
                    >
                        About the project
                    </motion.h3>

                    <h3 className="font-eudoxus text-[34px] font-[500] leading-[42px] md:text-[48px] md:leading-[56px] lg:hidden">
                        About the project
                    </h3>
                </div>

                <div className="w-full lg:max-w-[696px]">
                    <div className="w-full">
                        <h5 className="pb-3 font-eudoxus text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            CHALLENGE
                        </h5>
                        <p
                            className="text-align reveal-type font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]"
                            data-bg-color="#48484830"
                            data-fg-color="#484848"
                        >
                            {challenge}
                        </p>
                    </div>

                    <div className="mt-[40px] md:mt-[60px]">
                        <h5 className="pb-3 font-eudoxus text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            SOLUTION
                        </h5>
                        <p
                            className="text-align reveal-type font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]"
                            data-bg-color="#48484830"
                            data-fg-color="#484848"
                        >
                            {solution}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutProject;
