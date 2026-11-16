import Faq from './Faq';
import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import { FAQS } from './data';
const Faqs = () => {
    return (
        <div className="bg-[#0C0C0C] px-5 py-[60px] lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-y-14 text-white">
                <motion.h3
                    {...ANIMATE_PROPS({})}
                    className="font-euxodus w-full max-w-[564px] text-[34px] font-medium leading-[42px] text-white md:text-[48px] md:leading-[56px]"
                >
                    Frequently Asked Questions
                </motion.h3>
                <div className="flex flex-col">
                    {FAQS.map((faq) => (
                        <Faq key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Faqs;
