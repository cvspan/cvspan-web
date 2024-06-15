import Faq from '../mini-components/faq/Faq';

const Faqs = () => {
    return (
        <div className="flex w-full flex-col gap-y-14">
            <h3 className="lg:w-5/12">Frequently Asked Questions</h3>
            <div className="flex h-full w-full flex-col">
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
    );
};

export default Faqs;
