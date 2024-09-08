import React from 'react';

import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Clients from '@/components/molecules/Clients';
import Link from 'next/link';

import './style.css';
type Props = {};

const Careerlanding = (props: Props) => {
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
        <div className="relative h-screen overflow-x-hidden bg-[#0c0c0c] md:h-[820px]">
            <div className="absolute left-0 top-0 z-10">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="relative z-20 flex h-full w-full flex-col items-center justify-start px-[10px] pt-[120px] lg:pt-[180px]">
                <div className="mx-auto flex flex-col items-center justify-center space-y-[24px]">
                    <h1
                        className="about_header_title w-full max-w-[1200px] text-center font-pp-mori text-[34px] font-[500] leading-[42px] text-white lg:text-[96px] lg:font-[600] lg:leading-[103px]"
                        id="about_header_title_id"
                    >
                        Careers & <br /> Vacancies
                    </h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="w-full max-w-[615px] text-center font-eudoxus text-[16px] font-[400] leading-[24px] text-white lg:text-[18px] lg:leading-[26px]"
                    >
                        We are pioneering the future of work, working together to bring creativity to another scale. We
                        are a supportive and diverse community of people that are kind, truth seeking, and authentic
                    </motion.p>
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0.3 })}
                        className="mx-auto flex w-full max-w-[400px] justify-center pt-2"
                    >
                        <Link href="/careers/open-position">
                            <Button title="JOIN US" fullWidth height="56px" />
                        </Link>
                    </motion.div>
                </div>

                <div className="absolute bottom-[150px] md:bottom-9">
                    <Clients darkMode containerClassName="py-[40px] md:py-[50px]" />
                </div>
            </div>
        </div>
    );
};

export default Careerlanding;
