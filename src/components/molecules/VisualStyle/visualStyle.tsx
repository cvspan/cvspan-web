import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

function VisualStyle() {
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
                            Understanding the significance of visual appeal, we refreshed the overall Mine’d design. Our
                            team carefully considered user preferences, Consumers and Experts, and the latest trends to
                            create a visual style that resonates with the audience.
                        </motion.p>
                    </div>
                    {/* <div className="flex flex-row flex-wrap gap-4">
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
                    </div> */}

                    <div className="flex flex-col flex-wrap gap-10 pb-[56px]">
                        <div className="flex flex-row">
                            <div className="flex w-1/4 items-end justify-start rounded-l-2xl bg-[#1B576F] pb-[24px] pl-[40px] pt-[160px] text-lg text-white">
                                <p>#1B576F</p>
                            </div>
                            <div className="flex w-1/4 items-end justify-start bg-[#EDF6FF] pb-[24px] pl-[40px] pt-[160px] text-lg text-[#16171B]">
                                <p>#EDF6FF</p>
                            </div>
                            <div className="flex w-1/4 items-end justify-start bg-[#5D6C7C] pb-[24px] pl-[40px] pt-[160px] text-lg text-white">
                                <p>#5D6C7C</p>
                            </div>
                            <div className="flex w-1/4 items-end justify-start rounded-r-2xl bg-[#F1F5F9] pb-[24px] pl-[40px] pt-[160px] text-lg text-[#16171B]">
                                <p>#F1F5F9</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex h-[406px] w-fit items-start justify-start rounded-2xl border-[2px] border-[#1B576F8A] pl-[44px] pr-[323px] pt-[94px]">
                                <span className="flex flex-col gap-[46px]">
                                    <p className="text-18px]">typography</p>
                                    <p className="text-[64px] font-semibold">Aeonik</p>
                                </span>
                            </div>
                            <div className="bg-[#EEF1F9} mt-10 flex h-[406px] w-[565px] flex-col items-start justify-between gap-[45px] rounded-2xl bg-[#EEF1F9] px-[43px] py-[60px]">
                                <div className="flex h-fit max-w-[450px] flex-col gap-[4px]">
                                    <p className="text-[18px]">alphabet</p>
                                    <p className="break-words text-[32px] font-semibold leading-[54px]">
                                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                    </p>
                                </div>
                                <div className="flex h-fit max-w-[450px] flex-col gap-[4px]">
                                    <p className="text-[18px]">numbers</p>
                                    <p className="text-[32px] font-semibold">0123456789</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisualStyle;
