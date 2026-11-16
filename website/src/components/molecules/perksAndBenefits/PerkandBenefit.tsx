import React from 'react';
import './style.css';

interface PerkAndBenefitProps {
    id: string;
    title: string;
    explanation: string;
}

const PerkandBenefit: React.FC<PerkAndBenefitProps> = ({ id, title, explanation }) => {
    return (
        <div className="gradient-border flex h-[276px] w-full flex-col justify-center gap-[12px] rounded-xl p-6 max-[1217px]:scale-95 md:w-[384px]">
            <h2 className="font-pp-mori-semibold text- perks_gradient_text1 text-[60px] font-semibold leading-[64px] max-[1180px]:text-[50px] max-[1180px]:leading-[56px]">
                {id}
            </h2>

            <h5 className="font-eudoxus text-[24px] font-medium text-[#ffffff] max-[1180px]:text-[20px]">{title}</h5>
            <p className="text-[15px] text-[#A3A3A3] max-[1180px]:text-[14px]">{explanation}</p>
        </div>
    );
};

export default PerkandBenefit;
