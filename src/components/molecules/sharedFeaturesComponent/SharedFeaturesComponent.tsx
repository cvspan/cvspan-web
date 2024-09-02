import React from 'react';
import SharedFeaturedCard from './sharedFeatureCard/SharedFeaturedCard';
import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

interface Feature {
    title: string;
    details: string;
}
interface SharedFeaturesProps {
    title: string;
    intro: string;
    description: string;
    arrayOfFeatures: Feature[];
}

const SharedFeaturesComponent: React.FC<SharedFeaturesProps> = ({ intro, title, description, arrayOfFeatures }) => {
    return (
        <section className="px-[16px] py-[60px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                <motion.div
                    {...ANIMATE_PROPS({ delay: 0, from: 'left' })}
                    className="hidden h-[264px] w-full max-w-[300px] flex-col lg:sticky lg:top-[100px] lg:flex"
                >
                    <p className="font-eudoxus text-[14px] text-[#484848]">{intro}</p>
                    <div className="mt-auto w-full">
                        <Button
                            title="LET'S TALK"
                            rightIconSize="12px"
                            rightIcon="/assets/icons/arrow-forward-slant.svg"
                            height="56px"
                            fullWidth={true}
                            animateRightIconOnHover
                        />
                    </div>
                </motion.div>
                <div className="ml-auto w-full lg:max-w-[800px]">
                    <div className="flex flex-col gap-[20px]">
                        <h2 className="mb-[12px] font-pp-mori text-[clamp(34px,calc(60/1400*100vw),60px)] font-semibold leading-[1.2] text-[#1A1A1A] md:w-full lg:w-full">
                            {title}
                        </h2>
                        <p className="mb-[40px] font-eudoxus text-[clamp(16px,calc(16/1400*100vw),16px)] leading-[1.6] text-[#484848] md:w-full lg:w-full">
                            {description}
                        </p>
                    </div>
                    <div>
                        {arrayOfFeatures.map(({ title, details }, index) => (
                            <div key={index}>
                                <SharedFeaturedCard title={title} description={details} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SharedFeaturesComponent;
