import React from 'react';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import useWindowSize from '@/hooks/general/useWindowSize';

interface DesignCardProps {
    title: string;
    description: string;
    index?: number;
}

const SharedFeaturedCard: React.FC<DesignCardProps> = ({ title, description, index = 0 }) => {
    const { width } = useWindowSize();
    const smallDevice = width < 900;

    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.1 * index, from: smallDevice ? 'bottom' : 'right' })}
            className="border-rgba(209, 209, 209, 1) flex w-full flex-col justify-between gap-[20px] border-t py-[32px] lg:flex-row"
        >
            <h4 className="text-[clamp(24px,calc(34/1400*100vw),34px)] font-medium leading-[1.5] text-[#000000]">
                {title}
            </h4>
            <p className="flex w-full -self-end justify-self-end font-eudoxus text-[16px] font-normal leading-[24px] text-[#484848] lg:max-w-[374px]">
                {description}
            </p>
        </motion.div>
    );
};

export default SharedFeaturedCard;
