'use client';

const WhatToExpect = () => {
    return (
        <>
            <section className="bg-[#F5F5F5] py-[60px] lg:py-[120px]">
                <div className="m-auto flex w-full max-w-[1200px] flex-col justify-between gap-[60px] overflow-hidden pl-6 pr-6 lg:flex-row">
                    <h4
                        className="font-eudoxus font-medium text-[#1A1A1A]"
                        style={{ fontSize: 'clamp(1.5rem, 4.6875vw, 2.125rem)' }}
                    >
                        WHAT TO EXPECT
                    </h4>

                    <div className="grid-layout lg:max-w-[729px]">
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                User-centered Approach
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We prioritize users, conducting thorough research to create designs that resonate,
                                enhancing engagement and fostering lasting connections.
                            </p>
                        </div>
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Data-Informed Decisions
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We apply user behaviour insights to link design choices with data, resulting in optimal
                                usability and effective interactions.
                            </p>
                        </div>
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Holistic Strategy
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We perfectly integrate UX, UI, and functionality, creating designs that authentically
                                reflect your brand while providing comprehensive and unified experiences.
                            </p>
                        </div>
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Tailored solutions
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                We delve into user personas, creating tailored solutions to specific difficulties and
                                ensuring designs are properly aligned with user needs.
                            </p>
                        </div>
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Timely Delivery
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                Our efficient workflows and strategic planning ensure that projects are delivered on
                                time, without compromising your deadlines.
                            </p>
                        </div>
                        <div className="flex flex-col gap-[30px] bg-white p-[32px]">
                            <h5
                                className="font-eudoxus text-[24px] font-medium text-[#1A1A1A]"
                                style={{ fontSize: 'clamp(1rem, 4.6875vw, 1.5rem)' }}
                            >
                                Long Term-viability
                            </h5>
                            <p className="font-eudoxus font-normal text-[#484848]">
                                With foresight, we build for durability, anticipating trends and changes, resulting in
                                long-term relevance and fewer modifications.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <style jsx>{`
                .grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(18em, 1fr));
                    grid-gap: 1em;
                }
            `}</style>
        </>
    );
};

export default WhatToExpect;
