import React from 'react';

const OurValues = () => {
    return (
        <section className="bg-#00FFB2 h-full bg-[#00FFB2] py-[60px] pl-6 pr-6 lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-[20px] md:flex-row lg:gap-[120px]">
                <h3
                    className="font-euxodus w-full max-w-[540px] font-medium leading-[50px] text-black lg:leading-[56px]"
                    style={{ fontSize: 'clamp(2rem, 4.6875vw, 3rem)' }}
                >
                    Our Values
                </h3>
                <p className="font-eudoxus text-[18px] leading-[26px] text-[#484848]">
                    We value long-term development and professional growth. Our career paths are designed to set clear
                    expectations and recognize good performance. We encourage and offer training in new skills. Our
                    continuous learning opportunities, constant mentoring and leadership development efforts ensure
                    everyone has the right tools to grow and succeed.
                </p>
            </div>
        </section>
    );
};

export default OurValues;
