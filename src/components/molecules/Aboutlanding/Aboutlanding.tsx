import React from 'react';

import Brands from './Brands';
import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

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

    return (
        <div className="relative h-[820px] bg-[#0c0c0c]">
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start px-[10px] pt-[120px] lg:pt-[180px]">
                <div className="mx-auto flex flex-col items-center justify-center space-y-[24px]">
                    <h1
                        className="font-pp-mori about_header_title w-full max-w-[1200px] text-center text-[34px] font-[500] leading-[42px] text-white lg:text-[70px] lg:font-[600] lg:leading-[78px]"
                        id="about_header_title_id"
                    >
                        We provide innovative design solutions & expert talents
                    </h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="font-eudoxus w-full max-w-[615px] text-center text-[16px] font-[400] leading-[24px] text-white lg:text-[18px] lg:leading-[26px]"
                    >
                        From a small team of five people to a leading global remote team of professional designers &
                        developers that strive to develop valuable digital products for people worldwide.
                    </motion.p>
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0.3 })}
                        className="flex w-full max-w-[400px] flex-col gap-[24px] pt-[10px] md:flex-row"
                    >
                        <Button title="OUR SERVICES" fullWidth height="56px" background="white" />
                        <Button title="GET STARTED" fullWidth height="56px" background="transparent" />
                    </motion.div>
                </div>

                <div className="absolute bottom-9">
                    <Brands />
                </div>
            </div>
        </div>
    );
};

export default Aboutlanding;
