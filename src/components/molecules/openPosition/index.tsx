import React from 'react';

const OpenPosition = () => {
    return (
        <div className="m-auto w-full bg-cta-bg bg-cover bg-center bg-no-repeat bg-origin-border py-[60px] pb-12 pl-6 pr-6 pt-12 text-white lg:py-[120px]">
            <div className="m-auto flex h-full w-full max-w-[1200px] flex-col items-start justify-between gap-[60px] lg:flex-row">
                <h1
                    className="font-euxodus font-medium text-white lg:max-w-[580px]"
                    style={{ fontSize: 'clamp(3rem, 8.6875vw, 7.5rem)', lineHeight: 1 }}
                >
                    Open Positions
                </h1>

                <div className="flex items-center justify-between gap-5 lg:justify-self-start">
                    <h4
                        className="font-eudoxus font-medium text-white"
                        style={{ fontSize: 'clamp(1.5rem, 2vw, 2.125rem)' }}
                    >
                        APPLY NOW
                    </h4>
                    <svg
                        className="h-[20px] w-[20px] lg:h-[40px] lg:w-[40px]"
                        width=""
                        height=""
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.90476 0L1.82466 5.38679L30.8036 5.3869L0 36.1905L3.80952 40L34.6131 9.19643L34.6132 38.0954L40 38.0952C40 24.1486 40 13.3486 40 0H1.90476Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default OpenPosition;
