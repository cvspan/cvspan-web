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
            <div className="h-fit bg-white bg-bottom bg-no-repeat px-5 pb-[56px] pt-[120px]">
                <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px]">
                    <div className="flex max-w-[655px] flex-col gap-5">
                        <h3 className="text-[48px] font-medium text-[#16171B]">Visual Style</h3>
                        <motion.p className="text-[18px] font-medium text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            We followed the client’s guidelines and delivered solutions that would fully correspond to
                            the needs of the target audience. We focused on communicating the ease of use and
                            accessibility that Player`s Health offered its client`s.
                        </motion.p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4">
                        <div className="flex w-fit items-center justify-center rounded-2xl bg-[#30BDFF] px-[86px] py-[17px]">
                            <div className="flex h-[418px] w-[418px] items-center justify-center rounded-full bg-white">
                                <p>#30BDFF</p>
                            </div>
                        </div>
                        <div className="flex flex-col flex-wrap gap-4">
                            <div className="flex flex-row gap-4">
                                <div className="flex h-fit w-fit items-center justify-center rounded-2xl bg-[#FF672A] px-[49px] py-[16px]">
                                    <div className="flex h-[186px] w-[191px] items-center justify-center rounded-full bg-white">
                                        <p>#FF672A</p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-fit items-center justify-center rounded-2xl bg-[#5D6C7C] px-[49px] py-[16px]">
                                    <div className="flex h-[186px] w-[191px] items-center justify-center rounded-full bg-white">
                                        <p>#5D6C7C</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <div className="flex h-fit w-fit items-center justify-center rounded-2xl bg-[#F1C932] px-[49px] py-[16px]">
                                    <div className="flex h-[186px] w-[191px] items-center justify-center rounded-full bg-white">
                                        <p>#F1C932</p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-fit items-center justify-center rounded-2xl bg-[#EEF1F9] px-[49px] py-[16px]">
                                    <div className="flex h-[186px] w-[191px] items-center justify-center rounded-full bg-white">
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
