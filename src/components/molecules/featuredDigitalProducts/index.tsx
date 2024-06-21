'use client';

import React from 'react';
import FeaturedDigitalProductCard from './FeaturedDigitalProductCard';
import feature1 from '../../../../public/assets/images/digitalfeature1.jpeg';
import feature2 from '../../../../public/assets/images/digitalfeature2.jpeg';

const FeaturedDigitalProducts = () => {
    return (
        <>
            <section className="flex w-full bg-white py-[50px] pb-[60px] pl-6 pr-6 pt-[60px] lg:pb-[120px] lg:pt-[120px]">
                <div className="m-auto flex max-w-[1200px] flex-col gap-[60px] lg:flex-row lg:gap-[120px]">
                    <div className="flex flex-col gap-[24px] lg:w-6/12">
                        <div className="flex flex-col gap-[24px] sm:w-8/12 lg:w-full">
                            <h3 className="font-euxodus-bold text-black sm:w-[6/12]">Featured Digital Products</h3>
                            <p className="text-tundora">
                                Maximize your productivity with our innovative digital tools. From task management apps
                                to advanced scheduling software, our products help you stay organized and focused,
                                ensuring you get the most out of every day.
                            </p>
                        </div>
                    </div>
                    <div className="custom-flex-row flex flex-col gap-[44px] sm:flex-row md:flex-row lg:w-6/12">
                        <div className="">
                            <FeaturedDigitalProductCard
                                title="Insights"
                                description="Maximize your productivity with our innovative digital tools. From task management apps to advanced scheduling software, our products help you stay organized and focused, ensuring you get the most out of every day."
                                image={feature1}
                            />
                        </div>
                        <div className="">
                            <FeaturedDigitalProductCard
                                title="Creativity"
                                description="Unleash your creativity with our range of creative software. Whether you're into graphic design, video editing, or music production, our tools provide the features and flexibility you need to bring your ideas to life."
                                image={feature2}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <style jsx>{`
                @media (min-width: 480px) {
                    .custom-flex-row {
                        flex-direction: row;
                        gap: 22px;
                    }
                }
            `}</style>
        </>
    );
};

export default FeaturedDigitalProducts;
