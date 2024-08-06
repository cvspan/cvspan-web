import React from 'react';
import { HowWeWork } from './types';

import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export const HowWorkItem = ({ item }: { item: HowWeWork }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.2 * item?.index })}
            className="col-span-3 rounded-3xl border-[1px] border-[#272727] p-6"
        >
            <div>
                <div>
                    <div className="h-[56px] w-[56px] rounded-full bg-[#a6F46a]" />
                </div>
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <span>
                            <div className="text-gradient font-eudoxus text-[34px] font-medium leading-[42px] text-white">
                                {item.title}
                            </div>
                        </span>
                    </div>
                </div>
                <div className="mt-3">
                    <span className="font-eudoxus text-base font-normal leading-6 text-[#a3a3a3]">
                        {item.description}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
