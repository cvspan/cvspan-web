import React from 'react';
import './HowWeWork.css';
import { HowWeWorkHeader } from './HowWeWorkHeader';
import { HowWeWorkList } from './HowWeWorkList';

export const HowweWork = () => {
    return (
        <section>
            <div className="bg-[#0c0c0c] px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] lg:py-[120px]">
                    <HowWeWorkHeader />
                    <HowWeWorkList />
                </div>
            </div>
        </section>
    );
};
