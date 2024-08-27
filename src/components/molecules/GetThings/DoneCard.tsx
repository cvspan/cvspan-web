import React from 'react';

import { ANIMATE_PROPS } from '@/helpers/motion';
import { motion } from 'framer-motion';

interface DoneCardProps {
    id?: number;
    image?: string;
    text?: string;
    title?: string;
    index?: number;
}

const DoneCard: React.FC<DoneCardProps> = ({ image, index, title, text, id }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: index * 0.1 })}
            key={id}
            className="h-[270px] w-full rounded-[24px] border-[1px] border-[#272727] p-[24px] md:max-w-[384px] md:border-none"
        >
            <img
                src="/assets/images/border-benefits-card.svg"
                className="absolute left-0 top-0 hidden h-full w-full md:block"
            />

            <img src={image} className="h-[80px] w-[80px] object-contain" />
            <div className="text-align mb-[16px] mt-[24px] font-eudoxus text-[24px] font-medium leading-[32px] text-white">
                {title}
            </div>
            <p className="text-align font-eudoxus text-[16px] leading-[24px] text-[#A3A3A3]">{text}</p>
        </motion.div>
    );
};
export default DoneCard;
