'use client';
import React from 'react';
import CustomCountUp from '@/components/molecules/CustomCountUp';

interface ResultCardProps {
    title: string;
    before?: string;
    rate: number;
    after?: string;
    description: string;
    duration?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, rate, description, after, before, duration = 4 }) => {
    return (
        <div className="bg-cod-gray flex h-[256px] w-full cursor-pointer flex-col justify-between rounded-3xl bg-[#F4F4F4] p-6 md:max-w-[386px]">
            <p className="overflow-hidden font-eudoxus text-[#767676]">{title}</p>
            <div className="">
                <h2
                    className="bg-gradient-to-r font-pp-mori font-semibold"
                    style={{
                        background: 'linear-gradient(to right, #1A1A1A 0%, #1A1A1A 50%, #1A1A1A 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: 'clamp(3rem, 4.6875vw, 3.75rem)',
                    }}
                >
                    {before}
                    {/* <CustomCountUp end={rate} isCounting={isVisible} duration={duration} /> */}

                    <CustomCountUp end={rate} duration={duration} />
                    {after}
                </h2>
                <p className="text-silver-chalice font-eudoxus text-base text-[#1A1A1A]">{description}</p>
            </div>
        </div>
    );
};

export default ResultCard;
