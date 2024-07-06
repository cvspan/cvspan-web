import React from 'react';

interface PerkAndBenefitProps {
    id: string;
    title: string;
    explanation: string;
}

const PerkandBenefit: React.FC<PerkAndBenefitProps> = ({ id, title, explanation }) => {
    return (
        <div
            style={{
                border: '1px solid',
                borderImageSlice: 1,
                borderWidth: '0.5px',
                borderRadius: '24px',
                // borderImageSource: 'linear-gradient(to right, #272727 0%, #686868 100%',
                borderImageSource:
                    'linear-gradient(to right, rgba(104, 104, 104, 1), rgba(39, 39, 39, 1), rgba(39, 39, 39, 1),rgba(104, 104, 104)',
            }}
            className="flex flex-col gap-[12px] rounded-3xl p-[12px] md:p-[24px]"
        >
            <h2
                className="font-pp-mori-semibold text- font-semibold"
                style={{
                    fontSize: 'clamp(2.5rem, 4.6875vw, 3.75rem);',
                    background: 'linear-gradient(180deg, #272727 100%, #686868 100%, #686868 100%, #272727 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                {id}
            </h2>

            <h5
                style={{
                    background: 'linear-gradient(270deg, #B0B0B0 0%, #FFFFFF 36.5%, #FFFFFF 67.5%, #B0B0B0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
                className="font-eudoxus text-[24px] font-medium"
            >
                {title}
            </h5>
            <p className="text-[#A3A3A3]">{explanation}</p>
        </div>
    );
};

export default PerkandBenefit;
