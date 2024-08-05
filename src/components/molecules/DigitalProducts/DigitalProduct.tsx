import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import './DigitalProduct.css';

export const DigitalProduct = ({
    item,
    index = 1,
}: {
    item?: { isLetsTalk?: boolean; title?: string };
    index?: number;
}) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.1 * index })}
            whileHover="on_hover"
            className={`relative h-[212px] w-full cursor-pointer overflow-hidden rounded-[12px] border-[1px] border-transparent ${item?.isLetsTalk ? 'bg-[#0A1EB9]' : 'dgp_card bg-[#1a1a1a]'} p-[16px] hover:border-[#272727] md:p-[24px]`}
        >
            {!item?.isLetsTalk ? null : (
                <img src="/assets/images/service-card-bg.jpg" className="z-1 absolute left-0 top-0 h-full w-full" />
            )}

            <div className="z-[2] flex h-full flex-col">
                <div className="flex items-center justify-between gap-[16px]">
                    {item?.isLetsTalk ? (
                        <span></span>
                    ) : (
                        <span>
                            <div className="text-[24px] font-medium leading-[32px] text-white">{item?.title}</div>
                        </span>
                    )}
                    <motion.img
                        initial={{ x: '-30px', y: 30, opacity: 0 }}
                        variants={{
                            on_hover: {
                                x: 0,
                                y: 0,
                                opacity: 1,
                            },
                        }}
                        src="/assets/icons/arrow-top-right-white.svg"
                        className="absolute right-[24px] top-[24px] h-[16px] w-[16px]"
                    />

                    <motion.img
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        variants={{
                            on_hover: {
                                x: 30,
                                y: -30,
                                opacity: 0,
                            },
                        }}
                        src="/assets/icons/arrow-top-right-white.svg"
                        className="absolute right-[24px] top-[24px] h-[16px] w-[16px]"
                    />
                </div>
                <div className="mt-auto">
                    {item?.isLetsTalk ? (
                        <div className="relative z-10 text-[24px] font-medium leading-[32px] text-white">
                            {item?.title}
                        </div>
                    ) : (
                        <span className="text-[16px] leading-[24px] text-[#767676]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. 
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
