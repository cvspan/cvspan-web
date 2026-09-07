import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ElementType } from 'react';

function NemoVisual() {
    useGSAP(() => {
        SplitType.create('#about_header_title_id', { charClass: 'about_title_char' });

        const tl = gsap.timeline({});

        tl.to('.about_header_title', {
            opacity: 1,
            duration: 0.03,
        }).to('.about_title_char', {
            opacity: 1,
            stagger: 0.03,
            duration: 0.03,
        });

        return () => {
            tl.reverse();
        };
    }, {});

    return (
        <div>
            <div className="h-fit bg-white bg-bottom bg-no-repeat px-5 py-[120px]">
                <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px]">
                    <div className="flex max-w-[655px] flex-col gap-5">
                        <h3 className="text-[48px] font-medium text-[#16171B]">Visual Style</h3>
                        <motion.p className="text-[18px] text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            We followed the client’s guidelines and delivered solutions that would fully correspond to
                            the needs of the target audience. We focused on communicating the ease of use and
                            accessibility that Player`s Health offered its client`s.
                        </motion.p>
                    </div>

                    <div className="flex flex-row flex-wrap gap-4">
                        <div className="flex w-full flex-1 items-center justify-center rounded-xl bg-[#30BDFF] px-[86px] py-[17px] lg:w-fit">
                            <div className="flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white md:h-[418px] md:w-[418px]">
                                <p>#30BDFF</p>
                            </div>
                        </div>
                        <div className="flex w-full flex-1 flex-col flex-wrap gap-4 md:w-fit">
                            {/* jknvsjhkdfvkfv */}
                            <div className="flex w-full flex-row gap-4">
                                <div className="flex flex-1 items-center justify-center rounded-xl bg-[#FF672A] px-10 py-[16px] md:h-fit md:w-fit md:px-[49px]">
                                    <div className="flex aspect-square w-[140px] items-center justify-center rounded-full bg-white md:h-[186px] md:w-[191px]">
                                        <p>#FF672A</p>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center justify-center rounded-xl bg-[#5D6C7C] px-10 py-[16px] md:h-fit md:w-fit md:px-[49px]">
                                    <div className="flex aspect-square w-[140px] items-center justify-center rounded-full bg-white md:h-[186px] md:w-[191px]">
                                        <p>#5D6C7C</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full flex-row gap-4">
                                <div className="flex flex-1 items-center justify-center rounded-xl bg-[#F1C932] px-10 py-[16px] md:h-fit md:w-fit md:px-[49px]">
                                    <div className="flex aspect-square w-[140px] items-center justify-center rounded-full bg-white md:h-[186px] md:w-[191px]">
                                        <p>#F1C932</p>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center justify-center rounded-xl bg-[#EEF1F9] px-10 py-[16px] md:h-fit md:w-fit md:px-[49px]">
                                    <div className="flex aspect-square w-[140px] items-center justify-center rounded-full bg-white md:h-[186px] md:w-[191px]">
                                        <p>#EEF1F9</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NemoVisual;
