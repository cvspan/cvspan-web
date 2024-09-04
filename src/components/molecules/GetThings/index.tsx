import React from 'react';
import DoneCard from './DoneCard';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

import { data, TBenefitsData } from './data/data';

export default function GetThings({
    title = 'We get things done with quality',
    products = data,
}: {
    title?: string;
    products: TBenefitsData[];
}) {
    return (
        <div className="bg-black px-[16px] py-[60px] lg:py-[120px]">
            <div className="mx-auto w-full max-w-[1200px]">
                <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="w-[100%] max-w-[535px]">
                    <h2 className="pb-10 font-eudoxus text-[48px] font-medium leading-[56px] text-white">{title}</h2>
                </motion.div>

                <div className="mt-[20px] flex w-full flex-wrap items-center justify-start gap-[24px] self-center">
                    {products.map((product, index: number) => (
                        <DoneCard
                            index={index}
                            key={index}
                            // image={product.image}
                            text={product?.text}
                            title={product?.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
