import React from 'react';

interface FactCardProps {
    id: string;
    rate: string;
    description: string;
}

const FactCard: React.FC<FactCardProps> = ({ id, rate, description }) => {
    return (
        <div className="flex h-full flex-col justify-between gap-14 rounded-3xl bg-cod-gray p-6">
            <p className="text-tundora">{id}</p>
            <div>
                <h2
                    className="bg-gradient-to-r font-pp-mori-semibold"
                    style={{
                        background: 'linear-gradient(to right, #B0B0B0 0%, #FFFFFF 50%, #B0B0B0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {rate}
                </h2>
                <p className="font-eudoxus text-base text-silver-chalice">{description}</p>
            </div>
        </div>
    );
};

export default FactCard;
