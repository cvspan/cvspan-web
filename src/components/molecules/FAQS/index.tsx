import Faq from './Faq';
import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
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
                <div className="flex h-full flex-col">
                    <div className="flex h-full w-full">
                        <Faq
                            id={1}
                            question="Do you offer consultations before starting a project?"
                            answer="Yes, we offer a free initial consultation to discuss your project needs, goals, and vision. This helps us understand how we can best work together and provide a tailored proposal."
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={2}
                            question="What is your design and development process?"
                            answer="Our process includes discovery and research, concept development, wireframing and prototyping, design execution, development, quality assurance testing, and final deployment. We work closely with our clients at each stage to ensure their vision is accurately realized."
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={3}
                            question="Who are your typical clients?"
                            answer="Our clients range from startups and small businesses to large corporations across various industries, including technology, healthcare, retail, finance, and education."
                        />
                    </div>
                    <div className="flex h-full w-full">
                        <Faq
                            id={4}
                            question="How do you manage projects and keep them on schedule?"
                            answer="We use project management tools to track progress, set milestones, and communicate regularly with clients. This ensures that all tasks are completed on time and that any potential issues are addressed promptly."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
