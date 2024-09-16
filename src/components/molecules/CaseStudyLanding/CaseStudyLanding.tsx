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
        <div className="relative h-screen bg-[#0c0c0c] md:h-[679px]">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="relative z-20 mx-auto flex h-full w-full max-w-[1200px] flex-col items-center justify-between pt-[120px] md:flex-row md:items-end md:pb-[90px] lg:pt-[180px]">
                <div className="flex w-full max-w-[742px] flex-col gap-[23px]">
                    <h1
                        className="about_header_title w-full text-left font-pp-mori text-[70px] font-[500] leading-[42px] text-white lg:text-[96px] lg:font-[600] lg:leading-[104px]"
                        id="about_header_title_id"
                    >
                        {header}
                    </h1>

                    <motion.div className="flex w-full flex-row gap-[10px]" {...ANIMATE_PROPS({ delay: 0 })}>
                        {buttons?.map((button, index) => (
                            <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black" key={index}>
                                {button}
                            </p>
                        ))}
                        {/* <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black">UI/UX DESIGN</p>
                        <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black">UX STRATEGY</p>
                        <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black">MOBILE DESIGN</p>
                        <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black">3D DESIGN</p>
                        <p className="w-fit rounded-full bg-white px-3 py-1 text-sm text-black">SEO</p> */}
                    </motion.div>
                </div>

                <div className="w-full max-w-[390px]">
                    <motion.p className="text-[18px] text-white" {...ANIMATE_PROPS({ delay: 0 })}>
                        {paragraph}
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyLanding;
