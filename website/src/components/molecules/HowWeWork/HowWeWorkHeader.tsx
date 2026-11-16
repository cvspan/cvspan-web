import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import useWindowSize from '@/hooks/general/useWindowSize';

export const HowWeWorkHeader = () => {
    const { width } = useWindowSize();
    const smallDevice = width < 900;

    return (
        <div className="min-w-[564px]">
            <span>
                <motion.h2
                    {...ANIMATE_PROPS({ from: 'bottom', disable: smallDevice })}
                    className="leading-[42px]font-medium font-eudoxus text-[34px] text-white lg:text-5xl lg:leading-[56px]"
                >
                    How We Work
                </motion.h2>
            </span>
        </div>
    );
};
