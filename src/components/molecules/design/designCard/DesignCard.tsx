import React from 'react';

interface DesignCardProps {
    title: string;
    description: string;
}

const DesignCard: React.FC<DesignCardProps> = ({ title, description }) => {
    return (
        <div className="border-rgba(209, 209, 209, 1) flex flex-col gap-[20px] border-t py-8 lg:py-8">
            <h4 className="font-medium" style={{ fontSize: 'clamp(1.5rem, 4.6875vw, 2.75rem)' }}>
                {title}
            </h4>
            <p>{description}</p>
        </div>
    );
};

export default DesignCard;
