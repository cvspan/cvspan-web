import React from 'react';

interface DesignCardProps {
    title: string;
    description: string;
}

const DesignCard: React.FC<DesignCardProps> = ({ title, description }) => {
    return (
        <div className="border-rgba(209, 209, 209, 1) flex w-full flex-col justify-between gap-[20px] border-t py-8 lg:flex-row lg:py-8">
            <h4
                className="font-medium text-[#000000] lg:w-5/12"
                style={{ fontSize: 'clamp(1.5rem, 4.6875vw, 2.125rem)' }}
            >
                {title}
            </h4>
            <p className="flex -self-end justify-self-end font-eudoxus text-[16px] text-[#484848] lg:w-7/12">
                {description}
            </p>
        </div>
    );
};

export default DesignCard;
