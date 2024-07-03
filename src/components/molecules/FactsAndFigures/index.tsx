'use client';

import Button from '../Button';
import FactCard from './FactCard';

const FactsAndFigures = () => {
    return (
        <>
            <div className="w-full bg-[#0C0C0C] py-[60px] pl-6 pr-6 lg:py-[120px]">
                <div className="mx-auto max-w-[1200px]">
                    <section className="grid-layout m-auto w-full gap-x-6 gap-y-6 text-white md:grid-cols-2">
                        <div className="w-12/12 mb-8 flex h-full flex-col items-start gap-y-8 rounded-3xl bg-fact-figure bg-cover bg-center bg-no-repeat bg-origin-border p-[40px]">
                            <div className="flex flex-col gap-y-4">
                                <h2
                                    className="font-pp-mori font-semibold"
                                    style={{ fontSize: 'clamp(2.5rem, 4.6875vw, 3.75rem);' }}
                                >
                                    Facts & Figures
                                </h2>
                                <p className="font-eudoxus text-[1.125em]">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                            <Button
                                title="ABOUT US"
                                leftIconSize="12px"
                                leftIcon="/assets/icons/arrow-forward-slant.svg"
                                height="56px"
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 sm:grid-rows-2">
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
            <style jsx>{`
                .grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(30em, 1fr));
                    grid-gap: 3em;
                }
            `}</style>
        </>
    );
};

export default FactsAndFigures;
