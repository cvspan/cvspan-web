import React from 'react';
import Image from 'next/image';

import Frame from '../../../../public/assets/images/Frame 1618868713.png';
import Button from '../Button';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './style.css';
import Link from 'next/link';

type Props = {
    Heading: string;
    subHeading: string;
    bannerImage?: string;
};

const Landing = ({ Heading, subHeading, bannerImage = '/assets/images/services_landinf_frame.png' }: Props) => {
    useGSAP(() => {
        SplitType.create('#service_landing_title', { charClass: 'service_landing_title_char' });

        const tl = gsap.timeline({});

        tl.to('.service_landing_title', {
            opacity: 1,
            duration: 0.03,
        }).to('.service_landing_title_char', {
            opacity: 1,
            stagger: 0.03,
            duration: 0.03,
        });

        return () => {
            tl.reverse();
        };
    }, {});

    return (
        <div className="relative bg-[#0c0c0c] px-[16px] pb-[100px] lg:h-[820px] lg:pb-0">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/homepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <div className="mt-[100px] flex w-full max-w-[1200px] flex-col-reverse items-center justify-between lg:mt-0 lg:flex-row">
                    <div className="relative z-20 flex w-full max-w-[561px] flex-col gap-[32px]">
                        <h1
                            className="service_landing_title mt-[32px] text-center font-pp-mori text-[clamp(42px,calc(60/1400*100vw),60px)] font-medium leading-[1.2] text-white lg:mt-0 lg:text-left lg:font-semibold"
                            id="service_landing_title"
                        >
                            {Heading}
                        </h1>
                        <motion.p
                            {...ANIMATE_PROPS({ delay: 0 })}
                            className="text-center font-eudoxus text-[clamp(16px,calc(18/1400*100vw),18px)] font-normal leading-[1.5] text-white lg:text-left"
                        >
                            {subHeading}
                        </motion.p>

                        <motion.div {...ANIMATE_PROPS({ delay: 0.5 })} className="w-full lg:w-[207px]">
                            <Link href="/contact">
                                <Button
                                    title="LET'S TALK"
                                    height="56px"
                                    rightIcon={'/assets/images/arrowUp.svg'}
                                    rightIconHover={'/assets/images/arrowUpBlack.svg'}
                                    animateRightIconOnHover
                                    background="transparent"
                                    rightIconSize="26px"
                                    fullWidth
                                />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="block lg:hidden">
                        <img
                            src={bannerImage}
                            className="w-full max-w-[300px] object-contain md:max-w-[400px] lg:h-[506px] lg:w-[506px] lg:max-w-[506px]"
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <motion.div {...ANIMATE_PROPS({ delay: 0.5, from: 'right' })} className="hidden lg:block">
                        <img
                            src={bannerImage}
                            className="w-full max-w-[400px] object-contain lg:h-[506px] lg:w-[506px] lg:max-w-[506px]"
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
