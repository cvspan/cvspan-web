import React from 'react';

const Cta = () => {
    return (
        <div className="lg:p-r32 flex h-full max-w-7xl flex-col justify-between gap-8 pb-16 pt-16 md:flex-row lg:gap-16 lg:pl-6 lg:pr-6">
            <h1 className="font-pp-mori-semibold">Have a project in mind?</h1>
            <div className="flex flex-col gap-5 md:items-end md:justify-between lg:min-h-full lg:justify-between">
                <p className="lg:flex lg:justify-end lg:self-end">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
                <div className="flex items-center justify-between gap-5 self-end lg:self-end lg:justify-self-end">
                    <h4>LET’S TALK</h4>
                    <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default Cta;
