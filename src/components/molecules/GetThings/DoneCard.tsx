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
            // Border is now the .gradient-border utility rather than a stretched
            // SVG, so it scales with the card and matches at every breakpoint.
            className="gradient-border h-[324px] w-full rounded-xl p-6 md:max-w-[384px]"
        >
            <div className="relative bg-[linear-gradient(180deg,#272727_0%,#686868_43%,#686868_64%,#272727_100%)] bg-clip-text font-pp-mori text-[96px] leading-[103px] text-transparent">
                {`0${index + 1}`}
            </div>
            <div className="mt-6">
                <div className="text-align mb-[16px] mt-[24px] font-eudoxus text-[24px] font-medium leading-[32px] text-[#B0B0B0]">
                    {title}
                </div>
            </div>
            <div className="mt-3">
                <p className="text-align font-eudoxus text-[15px] leading-[24px] text-[#A3A3A3]">{text}</p>
            </div>
        </motion.div>
    );
};
export default DoneCard;
