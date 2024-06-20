import React from 'react';
import { DigitalProduct } from './DigitalProduct';

export const DigitalProductList = () => {
    return (
        <div className="pt-[60px]">
            <div>
                <div className="grid grid-cols-12 gap-12">
                    {Array.from([1, 2, 3, 4, 5, 6], (x) => x).map((item: number, i: number) => (
                        <DigitalProduct item={item} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
