import React from 'react';
import SharedFeaturedCard from './sharedFeatureCard/SharedFeaturedCard';
import Button from '../Button';

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
        <section className="py-[60px] lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-[60px] overflow-hidden pl-6 pr-6 md:flex-row lg:gap-[120px]">
                <div className="flex flex-col gap-[60px] lg:w-4/12 lg:gap-[120px]">
                    <p className="font-eudoxus text-[14px] text-[#484848]">{intro}</p>
                    <Button
                        title="LET'S TALK"
                        rightIconSize="12px"
                        rightIcon="/assets/icons/arrow-forward-slant.svg"
                        height="56px"
                        fullWidth={true}
                    />
                </div>
                <div className="flex flex-col gap-[60px] lg:w-8/12">
                    <div className="flex flex-col gap-[20px]">
                        <h2
                            className="font-pp-mori font-semibold leading-tight text-[#1A1A1A] md:w-full lg:w-full"
                            style={{ fontSize: 'clamp(2.5rem, 4.6875vw, 3.75rem)' }}
                        >
                            {title}
                        </h2>
                        <p className="font-eudoxus text-[#484848] md:w-full lg:w-full">{description}</p>
                    </div>
                    <div>
                        {arrayOfFeatures.map(({ title, details }) => (
                            <div>
                                <SharedFeaturedCard title={title} description={details} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SharedFeaturesComponent;
