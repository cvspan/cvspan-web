'use client';
import React from 'react';
import CustomCountUp from '@/components/molecules/CustomCountUp';
import './FactCard.css';

interface FactCardProps {
    id: string;
    before?: string;
    rate: number;
    after?: string;
    description: string;
    duration?: number;
}

const FactCard: React.FC<FactCardProps> = ({ id, rate, description, after, before, duration = 4 }) => {
    return (
        <div className="bg-cod-gray ffg_card flex h-full cursor-pointer flex-col justify-between gap-14 rounded-3xl bg-[#1A1A1A] p-6">
            <p className="font-eudoxus overflow-hidden text-[#484848]">{id}</p>
            <div>
                <h2
                    className="font-pp-mori bg-gradient-to-r font-semibold"
                    style={{
                        background: 'linear-gradient(to right, #B0B0B0 0%, #FFFFFF 50%, #B0B0B0 100%)',
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
                <p className="text-silver-chalice font-eudoxus text-base text-[#A3A3A3]">{description}</p>
            </div>
        </div>
    );
};

export default FactCard;
