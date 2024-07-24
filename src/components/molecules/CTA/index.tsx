import React from 'react';

const Cta = () => {
    return (
        <div className="m-auto w-full bg-cta-bg bg-cover bg-center bg-no-repeat bg-origin-border py-[60px] pb-12 pl-6 pr-6 pt-12 text-white lg:py-[120px]">
            <div className="m-auto flex h-full w-full max-w-[1200px] flex-col justify-between gap-[40px] md:flex-row">
                <h1
                    className="font-euxodus font-medium text-white lg:w-[6/12]"
                    style={{ fontSize: 'clamp(3rem, 8.6875vw, 7.5rem)', lineHeight: 1 }}
                >
                    Have a project in mind?
                </h1>
                <div className="flex flex-col gap-5 md:items-end md:justify-between lg:justify-between">
                    <p className="">
                        Let us know about your project idea! If the vibe for the collaboration isn't right, we're happy
                        to provide you with insightful information that might be useful.
                    </p>
                    <div className="flex items-center justify-between gap-5 self-end lg:self-end lg:justify-self-end">
                        <h4 className="text-[34px] leading-[42px]">LET’S TALK</h4>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.90476 0L1.82466 5.38679L30.8036 5.3869L0 36.1905L3.80952 40L34.6131 9.19643L34.6132 38.0954L40 38.0952C40 24.1486 40 13.3486 40 0H1.90476Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cta;
