'use client';

import React, { useState } from 'react';

interface FaqProps {
    id: number;
    question: string;
    answer: string;
}

const Faq: React.FC<FaqProps> = ({ id, question, answer }) => {
    const [toggleFaq, setToggleFaq] = useState(false);

    const questionClass = `flex font-eudoxus transform transition-transform duration-300  lg:self-start lg:justify-self-start ${toggleFaq ? 'text-white' : 'text-[#A3A3A3]'}`;
    const idClass = `${toggleFaq ? 'text-white flex self-start' : 'text-silver-chalice'}`;
    const arrowClass = `h-6 w-6 transform transition-transform duration-300 md:flex md:justify-end lg:flex lg:justify-end md:w-3/12 ${toggleFaq ? 'flex self-start pt-3' : ''} `;
    const arrow = `h-6 w-6 flex items-start justify-start  ${toggleFaq ? 'rotate-180' : ''}`;
    const arrowStroke = `${toggleFaq ? 'white' : '#A3A3A3'}`;
    const answerClass = `m-auto text-base relative font-euxodus font-normal flex transition-all duration-300 ${toggleFaq ? 'accordion-down' : 'accordion-up'} `;
    const faqClass = ` border-t-solid relative h-full flex w-full cursor-pointer items-center size-full justify-between gap-6 md:gap-12  border-t ${toggleFaq ? 'border-t-white border-t-4' : 'border-t border-t-tundora'}  pt-6 pb-6 transition-all duration-300 lg:items-start lg:gap-x-32 lg:pt-6 lg:pb-6`;

    return (
        <div className={faqClass} onClick={() => setToggleFaq(!toggleFaq)}>
            <span className={idClass}>{id}</span>
            <div
                className={`flex w-full flex-col justify-between gap-y-6 md:items-center md:justify-between ${toggleFaq ? 'size-full h-min' : ''}`}
            >
                <h5 className={questionClass} style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}>
                    {question}
                </h5>
                {toggleFaq && <p className={answerClass}>{answer}</p>}
            </div>
            <div className={arrowClass}>
                <svg
                    className={arrow}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M19 9L12 15L5 9"
                        stroke={arrowStroke}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Faq;
