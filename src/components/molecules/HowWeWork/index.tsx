import React from 'react';
import './HowWeWork.css';
import { HowWeWorkHeader } from './HowWeWorkHeader';
import { HowWeWorkList } from './HowWeWorkList';

export const HowweWork = () => {
    return (
        <section>
            <div className="bg-[#0c0c0c]">
                <div className="mx-auto w-full max-w-[1200px] py-[120px]">
                    <HowWeWorkHeader />
                    <HowWeWorkList />
                </div>
            </div>
        </section>
    );
};
