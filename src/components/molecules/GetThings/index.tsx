import React from 'react';
import { data } from '@/components/molecules/GetThings/data/data';
import DoneCard from './DoneCard';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

export default function GetThings({ title = 'We get things done with quality' }: { title?: string }) {
    return (
        <div className="bg-black px-[16px] py-[60px] lg:py-[120px]">
            <div className="mx-auto w-full max-w-[1200px]">
                <motion.div {...ANIMATE_PROPS({ delay: 0 })} className="w-[100%] max-w-[524px]">
                    <h2 className="pb-10 font-eudoxus text-[48px] font-medium leading-[56px] text-white">{title}</h2>
                </motion.div>

                <div className="mt-[20px] flex w-full flex-wrap items-center justify-start gap-[24px] self-center">
                    {data.map((details, index) => (
                        <DoneCard
                            index={index}
                            key={details.id}
                            id={details.id}
                            image={details.image}
                            text={details.text}
                            title={details.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
