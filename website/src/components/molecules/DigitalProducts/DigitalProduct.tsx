import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import './DigitalProduct.css';
import Link from 'next/link';

export const DigitalProduct = ({
    item,
    index = 1,
}: {
    item?: { isLetsTalk?: boolean; title?: string; subtitle?: string; link?: string };
    index?: number;
}) => {
    const card = (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.1 * index })}
            whileHover="on_hover"
            className={`relative h-[212px] w-full cursor-pointer overflow-hidden rounded-xl ${item?.isLetsTalk ? 'bg-[#0A1EB9]' : 'dgp_card gradient-border-hover bg-[#1a1a1a]'} relative p-[16px] md:p-[24px]`}
        >
            {!item?.isLetsTalk ? null : (
                <img
                    src="/assets/images/service-card-bg.jpg"
                    className="z-1 absolute left-0 top-0 h-full w-full"
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
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
                        alt=""
                        loading="lazy"
                        decoding="async"
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
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </div>
                <div className="mt-auto h-full pt-[40px]">
                    {item?.isLetsTalk ? (
                        <div className="relative z-10 text-[24px] font-medium leading-[32px] text-white">
                            {item?.title}
                        </div>
                    ) : (
                        <span className="text-[16px] leading-[24px] text-[#767676]">{item?.subtitle}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );

    // Ten of the service cards carry no link, and <Link href={undefined}> is not
    // valid, so only the linked ones get wrapped.
    return item?.link ? <Link href={item.link}>{card}</Link> : card;
};
