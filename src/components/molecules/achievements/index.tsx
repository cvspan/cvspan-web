'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

const AcievmentItem = ({ src, title, index }: { src?: string; title?: string; index: number }) => {
    return (
        <motion.div
            {...ANIMATE_PROPS({ delay: 0.1 * index })}
            className="font-eudoxus flex w-[220px] flex-col items-center gap-[22px]"
        >
            <img src={src} alt="behance" className="w-[135px]" />
            <span className="w-full max-w-[120px] text-center text-[16px] font-[500] leading-[24px]">{title}</span>
        </motion.div>
    );
};

const Achievements = () => {
    return (
        <>
            <div className="bg-faint-white bg-[#F5F5F5] px-5 py-[60px] md:py-[120px]">
                <div className="m-auto flex w-full max-w-[1200px] flex-col items-start gap-[60px]">
                    <motion.h3
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="font-euxodus w-full text-center text-[34px] font-medium leading-[42px] text-black md:text-left md:text-[48px] md:leading-[56px]"
                    >
                        Our Achievements
                    </motion.h3>
                    <div className="font-eudoxus flex w-full flex-wrap items-center justify-center gap-[20px] gap-y-[40px] text-black">
                        <AcievmentItem index={0} src={'/assets/icons/behance.svg'} title="28 Behance Galleries" />
                        <AcievmentItem index={1} src={'/assets/icons/clutch.svg'} title="5.0 Ratings on Clutch" />
                        <AcievmentItem index={2} src={'/assets/icons/dribble.svg'} title="Top 3 on Dribble" />
                        <AcievmentItem index={3} src={'/assets/icons/appbusiness.svg'} title="22 Reviews on Clutch" />
                        <AcievmentItem
                            index={4}
                            src={'/assets/icons/appbusiness.svg'}
                            title="Verified on App Business"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Achievements;
