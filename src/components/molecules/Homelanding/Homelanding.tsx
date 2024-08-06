import React from 'react';
import Image from 'next/image';

import Ribbon from '../../../../public/Ribbon-2.png';
import Button from '../Button';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';

const Homelanding = () => {
    return (
        <div className="relative h-[100vh] w-full bg-[#0c0c0c] px-5 sm:h-[820px]">
            <div className="absolute left-0 top-0">
                <img src={'/assets/images/haomepage_banner.png'} alt="elipse" />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <div className="relative flex h-full w-full max-w-[1200px] justify-center sm:items-center lg:justify-start">
                    <div className="mt-[130px] w-full max-w-[941px] sm:mt-0">
                        <motion.h1
                            {...ANIMATE_PROPS({ delay: 0 })}
                            className="font-pp-mori m-0 mx-auto text-center text-[67px] font-[100] leading-[72px] text-white sm:text-[90px] sm:leading-[99.6px] md:text-left lg:text-[120px] lg:leading-[129.6px]"
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
                            <Button background="white" title="OUR SERVICES" height="56px" fullWidth />
                            <Button background="transparent" title="GET STARTED" height="56px" fullWidth />
                        </motion.div>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 right-0 w-[450px] rotate-[21.43] overflow-hidden lg:w-[959.12px]">
                        <Image src={Ribbon} alt="elipse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homelanding;
