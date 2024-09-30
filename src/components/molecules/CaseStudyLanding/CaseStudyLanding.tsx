import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import './style.css';
type Props = {
    header?: string;
    buttons?: string[];
    paragraph?: string;
};

const CaseStudyLanding: React.FC<Props> = ({ header, paragraph, buttons }) => {
    useGSAP(() => {
        SplitType.create('#about_header_title_id', { charClass: 'about_title_char' });

        const tl = gsap.timeline({});

        tl.to('.about_header_title', {
            opacity: 1,
            duration: 0.03,
        }).to('.about_title_char', {
            opacity: 1,
            stagger: 0.03,
            duration: 0.03,
        });

        return () => {
            tl.reverse();
        };
    }, {});

    return (
        <div className="relative flex h-screen items-end justify-end bg-[#0c0c0c] px-5 md:h-[679px]">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="relative z-20 mx-auto flex h-fit w-full max-w-[1200px] flex-col items-end gap-[23px] pb-[90px] pt-[120px] lg:h-full lg:flex-row lg:items-end lg:justify-between lg:pt-[180px]">
                <div className="flex h-fit w-full flex-col gap-[23px] lg:max-w-[742px]">
                    <h1
                        className="about_header_title w-full text-left font-pp-mori text-[clamp(40px,calc(96/1200*100vw),96px)] font-[500] leading-[1.1] text-white lg:font-[600]"
                        id="about_header_title_id"
                    >
                        {header}
                    </h1>

                    <motion.div className="flex w-full flex-row flex-wrap gap-[10px]" {...ANIMATE_PROPS({ delay: 0 })}>
                        {buttons?.map((button, index) => (
                            <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black" key={index}>
                                {button}
                            </p>
                        ))}
                    </motion.div>
                </div>

                <div className="flex w-full justify-start lg:w-fit lg:justify-end">
                    <motion.p
                        className="max-w-[507px] text-[18px] font-normal text-white"
                        {...ANIMATE_PROPS({ delay: 0 })}
                    >
                        {paragraph}
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyLanding;
