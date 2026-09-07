import React from 'react';

import Button from '@/components/molecules/Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Clients from '@/components/molecules/Clients';

import './style.css';
type Props = {};

const Bloglanding = (props: Props) => {
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
        <div className="relative h-screen bg-[#0c0c0c] md:h-[820px]">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/homepage_banner.png'} alt="elipse" />
            </div>
            <div className="relative z-20 flex h-full w-full flex-col items-center justify-start px-[10px] pt-[120px] lg:pt-[180px]">
                <div className="mx-auto flex flex-col items-center justify-center space-y-[24px]">
                    <h1
                        className="about_header_title w-full max-w-[1200px] text-center font-pp-mori text-[34px] font-[500] leading-[42px] text-white lg:text-[96px] lg:font-[600] lg:leading-[103px]"
                        id="about_header_title_id"
                    >
                        Blog & Article
                    </h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="w-full max-w-[708px] text-center font-eudoxus text-[16px] font-[400] leading-[24px] text-white lg:text-[18px] lg:leading-[26px]"
                    >
                        The CVSpan Blog is a premier destination for developers, designers, finance professionals,
                        executives, and entrepreneurs. It provides essential technology updates, in-depth tutorials,
                        freelancer resources, and valuable management insights.
                    </motion.p>
                </div>

                <motion.div
                    {...ANIMATE_PROPS({ delay: 0.3 })}
                    className="mx-auto mt-[30px] flex w-full max-w-[1012px] justify-center lg:mt-[60px]"
                >
                    <div className="relative w-full">
                        <span className="absolute left-[24px] top-[20px]">
                            <img src={'/assets/icons/Vector.png'} alt="search" className="h-[24px] w-[24px]" />
                        </span>
                        <input
                            type="text"
                            className="placehoder:text-[18px] h-[64px] w-full rounded-full border-[1px] border-gray-400 bg-[#1a1a1a] pl-[60px] text-[18px] font-normal leading-[26px] text-white outline-none placeholder:font-eudoxus placeholder:font-normal placeholder:leading-[26px]"
                            aria-label="What are you looking for?"
                            placeholder="What are you looking for?"
                        />
                        <div className="relative right-1 top-[4px] mt-[12px] w-full lg:absolute lg:mt-0 lg:w-auto">
                            <Button background="blue" title="SEARCH" height="56px" fullWidth />
                        </div>
                    </div>
                </motion.div>

                <div className="absolute bottom-[150px] md:bottom-9">
                    <Clients darkMode containerClassName="py-[40px] md:py-[50px]" />
                </div>
            </div>
        </div>
    );
};

export default Bloglanding;
