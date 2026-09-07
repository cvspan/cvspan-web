import React from 'react';

import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';

const Homelanding = () => {
    const scrollTo_HOMEPAGE_DIGITAL_PRODUCTS_TARGET = () => {
        // Select the element you want to scroll to
        const target = document.getElementById('HOMEPAGE_DIGITAL_PRODUCTS_TARGET');
        if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative h-[110vh] w-full overflow-x-hidden bg-[#0c0c0c] px-5 sm:h-[820px]">
            <div className="absolute left-0 top-0">
                {/* Decorative hero backdrop, and the likely LCP element — eager + high
                    priority so it is not deprioritised behind other requests. */}
                <img
                    src={'/assets/images/homepage_banner.png'}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
            </div>

            <div className="absolute bottom-0 right-0 w-full">
                <div className="mx-auto flex w-full max-w-[1200px] justify-end">
                    <img
                        src="/assets/images/homepage-bottom-background.webp"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="mr-[-100px] w-[900px] object-contain"
                    />
                </div>
            </div>

            <div className="relative mx-auto flex h-full w-full max-w-[1200px] justify-center sm:items-center lg:justify-start">
                <div className="mt-[130px] w-full max-w-[941px] sm:mt-0">
                    <motion.h1
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="m-0 mx-auto text-center font-pp-mori text-[67px] font-[100] leading-[72px] text-white sm:text-[90px] sm:leading-[99.6px] md:text-left lg:text-[120px] lg:leading-[129.6px]"
                    >
                        We{' '}
                        <span className="font-semibold">
                            Create <br /> Awesome
                        </span>{' '}
                        Stuff
                    </motion.h1>
                    <motion.p
                        {...ANIMATE_PROPS({ delay: 0.3 })}
                        className="font-exodus m-0 mx-auto mb-[32px] max-w-[660px] p-0 text-center text-[16px] font-normal leading-[24px] text-white md:mx-0 md:text-left lg:text-[18px] lg:leading-[26px]"
                    >
                        Our experts accompany our Clients from the private and public sector in their digital
                        transformation journey by providing business value solutions
                    </motion.p>
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0.5 })}
                        className="mx-auto flex w-full max-w-[400px] flex-col justify-center gap-x-[24px] gap-y-[16px] sm:flex-row md:mx-0 md:justify-start"
                    >
                        <div className="flex-1">
                            <Button
                                background="white-no-border"
                                title="OUR SERVICES"
                                height="56px"
                                fullWidth
                                onClick={scrollTo_HOMEPAGE_DIGITAL_PRODUCTS_TARGET}
                            />
                        </div>
                        <Link href="/contact" className="flex-1">
                            <Button background="transparent" title="GET STARTED" height="56px" fullWidth />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Homelanding;
