'use client';
import React from 'react';

const AcievmentItem = ({ src, title }: { src?: string; title?: string }) => {
    return (
        <div className="flex w-[220px] flex-col items-center gap-[22px] font-eudoxus">
            <img src={src} alt="behance" className="w-[135px]" />
            <span className="w-full max-w-[120px] text-center text-[16px] font-[500] leading-[24px]">{title}</span>
        </div>
    );
};

const Achievements = () => {
    return (
        <>
            <div className="bg-faint-white bg-[#F5F5F5] px-5 py-[60px] md:py-[120px]">
                <div className="m-auto flex w-full max-w-[1200px] flex-col items-start gap-[60px]">
                    <h3 className="font-euxodus w-full text-center text-[34px] font-medium leading-[42px] text-black md:text-left md:text-[48px] md:leading-[56px]">
                        Our Achievements
                    </h3>
                    <div className="flex w-full flex-wrap items-center justify-center gap-[20px] gap-y-[40px] font-eudoxus text-black">
                        <AcievmentItem src={'/assets/icons/behance.svg'} title="28 Behance Galleries" />
                        <AcievmentItem src={'/assets/icons/clutch.svg'} title="5.0 Ratings on Clutch" />
                        <AcievmentItem src={'/assets/icons/dribble.svg'} title="Top 3 on Dribble" />
                        <AcievmentItem src={'/assets/icons/appbusiness.svg'} title="22 Reviews on Clutch" />
                        <AcievmentItem src={'/assets/icons/appbusiness.svg'} title="Verified on App Business" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Achievements;
