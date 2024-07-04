import React from 'react';
import Button from '@/components/molecules/Button';

export const SpecificJobDetail = () => {
    return (
        <div className="py-[60px] lg:py-[120px]">
            <div className="m-auto max-w-[1200px] px-5">
                <div className="relative grid grid-cols-3 gap-x-6">
                    {/* <div className="fixed inset-x-0 bottom-0 lg:static lg:col-span-1 lg:w-fit">
                        <Button fullWidth height="56px" title="APPLY HERE" leftIcon={'/assets/images/arrowUp.svg'} />
                    </div> */}
                    <div className="sticky top-[calc(100vh-60px)] col-span-3 w-full lg:static lg:col-span-1 lg:w-fit">
                        <Button fullWidth height="56px" title="APPLY HERE" leftIcon={'/assets/images/arrowUp.svg'} />
                    </div>
                    <div className="col-span-3 lg:col-span-2">
                        <div className="mb-8">
                            <div className="mb-3 font-pp-mori text-[34px] font-semibold leading-[42px] text-[#1a1a1a] lg:text-[60px] lg:leading-[64px]">
                                Design Consultant
                            </div>
                            <span className="font-eudoxus text-2xl font-medium text-[#1a1aff]">Design</span>
                        </div>

                        <div className="mb-8">
                            <div className="mb-4 font-eudoxus text-base font-normal text-[#484848]">
                                Fireart is an experience design & technology partner to clients large and small. We
                                believe that great ideas are only as good as how well they perform. Our passion is for
                                pushing the boundaries of our ideas within the limits of what’s possible. We are not
                                satisfied until we are achieving industry-leading results in the market.
                            </div>
                            <div>
                                Fireart studio is looking for a UX Consultant who will be the coherent chain between the
                                client and design team and will help to improve the design processes.
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 font-eudoxus text-2xl font-normal text-[#1a1a1a]">
                                You are a great fit if you have…
                            </div>
                            <ul className="list-inside list-disc font-eudoxus text-base font-normal text-[#484848]">
                                <li>at least 3 years of experience building / designing / managing IT projects</li>
                                <li>practical knowledge of product development cycle,</li>
                                <li>previous experience in projects estimation,</li>
                                <li>
                                    good understanding of current trends of web/mobile products and solution frameworks,
                                </li>
                                <li>ability to understand customer competition and solution landscape,</li>
                                <li>
                                    ability to provide strategic inputs for bid response and controlling the flow and
                                    approach,
                                </li>
                                <li>excellent communication and analytical skills</li>
                                <li>excellent command of written and spoken English (C1+).</li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <div className="mb-4 font-eudoxus text-2xl font-normal text-[#1a1a1a]">
                                What will you do:
                            </div>
                            <div className="font-eudoxus text-base font-normal text-[#484848]">
                                You will be responsible for evaluating the client needs to provide them with a complete
                                individualized design solution. Your role will also include collaborating with the
                                design team to give the information of client’s preferences, making the estimations of
                                the projects, and improving and suggesting changes to the old design if requires.
                            </div>
                        </div>

                        <ul className="mt-8 list-inside list-disc font-eudoxus text-base font-normal text-[#484848]">
                            <div className="mb-4 font-eudoxus text-2xl font-normal text-[#1a1a1a]">What we offer</div>
                            <li>at least 3 years of experience building / designing / managing IT projects</li>
                            <li>practical knowledge of product development cycle,</li>
                            <li>previous experience in projects estimation,</li>
                            <li>
                                good understanding of current trends of web/mobile products and solution frameworks,
                            </li>
                            <li>ability to understand customer competition and solution landscape,</li>
                            <li>
                                ability to provide strategic inputs for bid response and controlling the flow and
                                approach,
                            </li>
                            <li>excellent communication and analytical skills</li>
                            <li>excellent command of written and spoken English (C1+).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
