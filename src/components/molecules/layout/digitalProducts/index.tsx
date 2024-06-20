import React from 'react';
import { DigitalProductList } from './DigitalProductList';
import { DigitalProductHeader } from './DigitalProductHeader';

export const DigitalProducts = () => {
    return (
        <section>
            <div className="bg-[#0c0c0c]">
                <div className="mx-auto w-full max-w-[1200px] py-[120px]">
                    <DigitalProductHeader />
                    <DigitalProductList />
                </div>
            </div>
        </section>
    );
};
