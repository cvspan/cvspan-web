import React from 'react';
import CustomisableCard from './CustomisableCard';
import CustomizableCTA from './CustomizableCTA';

const CustomizableDesign = () => {
    return (
        <section className="h-full bg-[#F5F5F5] py-[60px] pl-6 pr-6 lg:py-[120px]">
            <div className="m-auto flex w-full max-w-[1200px] flex-col gap-[60px] overflow-hidden lg:gap-[120px]">
                <div className="flex w-full flex-col justify-between gap-[20px] md:flex-row">
                    <h3
                        className="font-euxodus w-full max-w-[540px] font-medium leading-[50px] text-black lg:leading-[56px]"
                        style={{ fontSize: 'clamp(2rem, 4.6875vw, 3rem)' }}
                    >
                        Customisable Design Process Based on Your Needs
                    </h3>
                    <p className="flex w-full justify-self-end font-eudoxus text-[18px] text-[#484848] lg:max-w-[540px]">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                </div>
                <div
                    className="flex w-full -scroll-ml-0 gap-[24px] overflow-scroll"
                    style={{ scrollbarColor: 'transparent', scrollbarWidth: 'none' }}
                >
                    <div>
                        <CustomisableCard />
                    </div>
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>{' '}
                    <div>
                        <CustomisableCard />
                    </div>
                    <div>
                        <CustomizableCTA />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomizableDesign;
