import React from 'react';

import Button from '@/components/molecules/Button';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Clients from '@/components/molecules/Clients';
import Link from 'next/link';

import './style.css';

type Props = {};

const Aboutlanding = (props: Props) => {
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

    const scrollTo_HOMEPAGE_DIGITAL_PRODUCTS_TARGET = () => {
        // Select the element you want to scroll to
        const target = document.getElementById('HOMEPAGE_DIGITAL_PRODUCTS_TARGET');
        if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative h-[812px] overflow-x-hidden bg-[#0c0c0c] md:h-[820px]">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="relative z-20 flex h-full w-full flex-col items-center justify-start px-[10px] pt-[140px] md:pt-[120px] lg:pt-[180px]">
                <div className="mx-auto flex flex-col items-center justify-center space-y-[24px]">
                    <h1
                        className="about_header_title w-full max-w-[1200px] text-center font-pp-mori text-[clamp(40px,calc(72/1200*100vw),72px)] font-[500] leading-[1.1] text-white lg:font-[600]"
                        id="about_header_title_id"
                    >
                        We provide innovative design solutions & expert talents
                    </h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="w-full max-w-[615px] text-center font-eudoxus text-[16px] font-[400] leading-[24px] text-white lg:text-[18px] lg:leading-[26px]"
                    >
                        From a small team of five people to a leading global remote team of professional designers &
                        developers that strive to develop valuable digital products for people worldwide.
                    </motion.p>
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0.3 })}
                        className="flex w-full max-w-[400px] flex-col gap-[24px] pt-[10px] md:flex-row"
                    >
                        <Link href="/#HOMEPAGE_DIGITAL_PRODUCTS_TARGET" className="flex-1">
                            <Button
                                title="OUR SERVICES"
                                fullWidth
                                height="56px"
                                background="white-no-border"
                                onClick={scrollTo_HOMEPAGE_DIGITAL_PRODUCTS_TARGET}
                            />
                        </Link>

                        <Link href="/contact" className="flex-1">
                            <Button title="GET STARTED" fullWidth height="56px" background="transparent" />
                        </Link>
                    </motion.div>
                </div>

                <div className="absolute bottom-9">
                    <Clients darkMode containerClassName="py-[40px] md:py-[50px]" />
                </div>
            </div>
        </div>
    );
};

export default Aboutlanding;
