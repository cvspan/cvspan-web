import Faq from './Faq';

const Faqs = () => {
    return (
        <div className="bg-[#0C0C0C] py-[60px] pl-6 pr-6 lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-y-14 pl-6 pr-6 text-white">
                <h3
                    className="font-euxodus font-medium text-white sm:w-[6/12]"
                    style={{ fontSize: 'clamp(2rem, 4.6875vw, 3rem)' }}
                >
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
