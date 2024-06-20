import React from 'react';

import FactCard from './FactCard';

const FactsAndFigures = () => {
    return (
        <>
            <div className="my-[50px] w-full bg-[#0C0C0C] pl-6 pr-6">
                <div className="mx-auto max-w-[1200px]">
                    <section className="m-auto grid w-full gap-x-6 gap-y-6 text-white md:grid-cols-2">
                        <div className="h-150 w-12/12 bg-fact-figure flex flex-col items-start gap-y-8 rounded-3xl bg-cover bg-center bg-no-repeat bg-origin-border p-[40px]">
                            <div className="flex flex-col gap-y-4">
                                <h2 className="font-pp-mori-semibold">Facts & Figures</h2>
                                <p className="font-eudoxus text-[1.125em]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                                <FactCard id={'01'} rate="80%" description="of faster design asset delivery" />
                            </div>
                            <div>
                                <FactCard id={'02'} rate="$56k" description="Saved on creative production" />
                            </div>
                            <div>
                                <FactCard id={'03'} rate="+1M" description="Increase in customer base" />
                            </div>
                            <div>
                                <FactCard id={'04'} rate="+28%" description="Monthly E-commerce visits" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default FactsAndFigures;
