import React from 'react';
import { DigitalProductList } from './DigitalProductList';
import { DigitalProductHeader } from './DigitalProductHeader';

export const DigitalProducts = () => {
    return (
        <section>
            <div className="bg-[#0c0c0c] px-5">
                <div className="mx-auto w-full max-w-[1200px] py-[60px] sm:py-[120px]">
                    <DigitalProductHeader />
                    <DigitalProductList />
                </div>
            </div>
        </section>
    );
};
