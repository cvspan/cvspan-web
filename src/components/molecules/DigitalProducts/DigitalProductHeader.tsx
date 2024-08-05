import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export const DigitalProductHeader = () => {
    return (
        <div>
            <span className="font-eudoxus font-medium text-white">
                <motion.h2 {...ANIMATE_PROPS({ delay: 0.5 })} className="text-[34px] leading-[42px] sm:hidden">
                    Digital Products <br /> Services and <br />
                    Solutions We Offer
                </motion.h2>
                <motion.h2 {...ANIMATE_PROPS({ delay: 0.5 })} className="hidden text-5xl leading-[56px] sm:block">
                    Digital Products Services <br /> and Solutions We Offer
                </motion.h2>
            </span>
        </div>
    );
};
