'use client';

import React from 'react';
import PerkandBenefit from './PerkandBenefit';

const PerksAndBenefits = () => {
    return (
        <>
            <section className="bg-#00FFB2 h-full bg-[#0C0C0C] py-[60px] pl-6 pr-6 lg:py-[120px]">
                <div className="m-auto flex w-full max-w-[1200px] flex-col gap-[60px] lg:gap-[60px]">
                    <h3
                        className="font-euxodus w-full max-w-[540px] font-medium leading-[50px] text-white lg:leading-[56px]"
                        style={{ fontSize: 'clamp(2rem, 4.6875vw, 3rem)' }}
                    >
                        Perks and Benefits
                    </h3>

                    <div className="flex flex-col justify-between lg:flex-row">
                        <PerkandBenefit
                            id="01"
                            title="Bonuses for hardworkers"
                            explanation="For those who don't want to spend their vacation days aside work, we pay bonuses at the end of the year for unused vacation days."
                        />
                        <PerkandBenefit
                            id="02"
                            title="Learning Resources"
                            explanation="We believe in the power and joy of learning. We provide plenty of learning resources on design, animation, business, and marketing that will help you grow."
                        />
                        <PerkandBenefit
                            id="03"
                            title="Global clients"
                            explanation="Since 2013, we have worked on over 700 projects for more than 400 clients, including world-renowned brands."
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default PerksAndBenefits;
