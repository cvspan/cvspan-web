import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export const HowWeWorkHeader = () => {
    return (
        <div className="min-w-[564px]">
            <span>
                <motion.h2
                    {...ANIMATE_PROPS()}
                    className="leading-[42px]font-medium font-eudoxus text-[34px] text-white lg:text-5xl lg:leading-[56px]"
                >
                    How We Work
                </motion.h2>
            </span>
        </div>
    );
};
