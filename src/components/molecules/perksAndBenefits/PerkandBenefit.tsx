import React from 'react';
import './style.css';

interface PerkAndBenefitProps {
    id: string;
    title: string;
    explanation: string;
}

const PerkandBenefit: React.FC<PerkAndBenefitProps> = ({ id, title, explanation }) => {
    return (
        <div className="relative flex h-[276px] w-full flex-col justify-center gap-[12px] rounded-3xl border-[1px] border-[#272727] p-[24px] max-[1217px]:scale-95 md:w-[384px] md:border-transparent">
            <img
                src="/assets/images/border-perks-benefits.svg"
                className="absolute left-0 top-0 hidden h-full w-full md:block"
            />

            <h2 className="font-pp-mori-semibold text- perks_gradient_text1 text-[60px] font-semibold leading-[64px] max-[1180px]:text-[50px] max-[1180px]:leading-[56px]">
                {id}
            </h2>

            <h5 className="font-eudoxus text-[24px] font-medium text-[#ffffff] max-[1180px]:text-[20px]">{title}</h5>
            <p className="text-[15px] text-[#A3A3A3] max-[1180px]:text-[14px]">{explanation}</p>
        </div>
    );
};

export default PerkandBenefit;
