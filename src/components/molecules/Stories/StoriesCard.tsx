'use client';

import React, { useEffect } from 'react';
import SplitType from 'split-type';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/src/ScrollTrigger';
import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
gsap.registerPlugin(ScrollTrigger);

const StoriesCard = () => {
    useGSAP(() => {
        const splitTypes = document.querySelectorAll('.reveal-type');

        splitTypes.forEach((char, i) => {
            const bg = char?.dataset?.bgColor;
            const fg = char?.dataset?.fgColor;

            const text = new SplitType(char, { types: 'chars' });

            gsap.fromTo(
                text.chars,
                {
                    color: bg,
                },
                {
                    color: fg,
                    duration: 0.3,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: char,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: true,
                        markers: false,
                        toggleActions: 'play play reverse reverse',
                    },
                },
            );
        });

        return () => {};
    }, {});

    return (
        <div className="px-5 py-[60px] md:py-[80px] lg:py-[120px]">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-y-[40px] lg:flex-row">
                <div className="w-full max-w-[384px]">
                    <motion.h3
                        {...ANIMATE_PROPS({ delay: 0 })}
                        className="font-eudoxus sticky top-[100px] hidden text-[34px] font-[500] leading-[42px] md:text-[48px] md:leading-[56px] lg:block"
                    >
                        Success Stories Shaped By Our Experience
                    </motion.h3>

                    <motion.h3
                        {...ANIMATE_PROPS({ delay: 0.5, from: 'bottom' })}
                        className="font-eudoxus text-[34px] font-[500] leading-[42px] md:text-[48px] md:leading-[56px] lg:hidden"
                    >
                        Success Stories Shaped By Our Experience
                    </motion.h3>
                </div>

                <div className="w-full lg:max-w-[696px]">
                    <div className="w-full">
                        <h5 className="font-eudoxus pb-3 text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            ABOUT US
                        </h5>
                        <p
                            className="text-align reveal-type font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]"
                            data-bg-color="#48484830"
                            data-fg-color="#484848"
                        >
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem. Sed ut perspiciatis unde omnis iste natus error
                            sit voluptatem accusantium doloremque laudantium. <br />
                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                            velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
                            quaerat voluptatem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium doloremque laudantium.
                        </p>
                    </div>

                    <div className="mt-[40px] md:mt-[60px]">
                        <h5 className="font-eudoxus pb-3 text-[24px] font-[500] leading-[32px] text-[#1A1A1A]">
                            OUR VALUES
                        </h5>
                        <p
                            className="text-align reveal-type font-eudoxus text-[18px] font-[300] leading-[26px] text-[#484848]"
                            data-bg-color="#48484830"
                            data-fg-color="#484848"
                        >
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                            aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            <br />
                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                            velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
                            quaerat voluptatem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium doloremque laudantium.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoriesCard;
