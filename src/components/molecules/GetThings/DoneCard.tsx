import React from 'react';

import { ANIMATE_PROPS } from '@/helpers/motion';
import { motion } from 'framer-motion';

interface DoneCardProps {
    text?: string;
    title?: string;
    index: number;
}

const DoneCard: React.FC<DoneCardProps> = ({ index, title, text }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: index * 0.1 })}
            className="h-[270px] w-full rounded-[24px] border-[1px] border-solid border-[#272727] p-6 md:max-w-[384px]"
        >
            <img
                src="/assets/images/border-benefits-card.svg"
                className="absolute left-0 top-0 hidden h-full w-full md:block"
            />
            <div className="bg-[linear-gradient(180deg,#272727_0%,#686868_43%,#686868_64%,#272727_100%)] bg-clip-text font-pp-mori text-6xl leading-[64px] text-transparent">
                {`0${index + 1}`}
            </div>
            <div className="mt-6">
                <div className="text-align mb-[16px] mt-[24px] font-eudoxus text-[24px] font-medium leading-[32px] text-[#a3a3a3]">
                    {title}
                </div>
            </div>
            <div className="mt-3">
                <p className="text-align font-eudoxus text-[16px] leading-[24px] text-[#A3A3A3]">{text}</p>
            </div>
        </motion.div>
    );
};
export default DoneCard;
