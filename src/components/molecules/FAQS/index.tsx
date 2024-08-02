import Faq from './Faq';
import React from 'react';

const Faqs = () => {
    return (
        <div className="bg-[#0C0C0C] px-5 py-[60px] lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-y-14 text-white">
                <h3 className="font-euxodus text-[34px] font-medium leading-[42px] text-white sm:w-[6/12] md:text-[48px] md:leading-[56px]">
                    Frequently Asked Questions
                </h3>
                <div className="flex h-full flex-col">
                    <div className="flex h-full w-full">
                        <Faq
                            id={1}
                            question="What sets Eco Rocks apart from other jewelry retailers?"
                            answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={2}
                            question="What sets Eco Rocks apart from other jewelry retailers?"
                            answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={3}
                            question="What sets Eco Rocks apart from other jewelry retailers?"
                            answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={4}
                            question="What sets Eco Rocks apart from other jewelry retailers?"
                            answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
