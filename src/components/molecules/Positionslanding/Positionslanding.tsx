'use client';

import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './style.css';

const Positionslanding = () => {
    useGSAP(() => {
        SplitType.create('#position_header_title_id', { charClass: 'position_title_char' });

        const tl = gsap.timeline({});

        tl.to('.position_header_title', {
            opacity: 1,
            duration: 0.03,
        }).to('.position_title_char', {
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
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/homepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
                <h1
                    id="position_header_title_id"
                    className="position_header_title w-[335px] text-center font-pp-mori text-[48px] font-[400] leading-[56px] text-white lg:w-[1012px] lg:text-[96px] lg:font-[600] lg:leading-[103.65px]"
                >
                    Check our <br /> open positions
                </h1>
            </div>
        </div>
    );
};

export default Positionslanding;
