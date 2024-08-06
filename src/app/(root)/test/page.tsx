'use client';
import React from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import './g.css';
function HomepageHeader() {
    useGSAP(() => {
        SplitType.create('#homepage_header_text_1');
        SplitType.create('#homepage_header_text_2');
        const tl = gsap.timeline({});

        tl.to('.hp_header_inner_h1', {
            opacity: 1,
            duration: 0.03,
        }).to('.char', {
            opacity: 1,
            stagger: 0.03,
            duration: 0.03,
        });

        return () => {
            tl.reverse();
        };
    }, {});

    return (
        // DO NOT REMOVE THE id="hp_header_container"
        // IT IS USED OUTSIDE THIS SCOPE TO NAVIGATE/SCROLL TO THIS POSITION
        // FROM ANOTHER COMPONENT OUSIDE THIS SCOPE
        <div id="hp_header_container">
            <div className={'mb-[-12px] text-red-700 lg:mb-[-40px]'}>
                <h1 className={'hp_header_inner_h1'} id="homepage_header_text_1">
                    YOUR WELLBEING
                </h1>
                <h1 className={'hp_header_inner_h1'} id="homepage_header_text_2">
                    JOURNEY
                </h1>
            </div>
        </div>
    );
}

export default HomepageHeader;
