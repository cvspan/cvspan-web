import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

function NeverBareVisual() {
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
                        <motion.p className="text-[18px] text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            Understanding the significance of visual appeal, we refreshed the overall Mine’d design. Our
                            team carefully considered user preferences, Consumers and Experts, and the latest trends to
                            create a visual style that resonates with the audience.
                        </motion.p>
                    </div>

                    <div className="flex flex-col flex-wrap gap-10 pb-[56px]">
                        <div className="flex w-full flex-row">
                            <div className="flex w-1/4 items-end justify-center rounded-l-2xl bg-[#1B576F] px-3 pb-[24px] pt-[160px] text-sm text-white md:justify-start md:px-[40px] md:text-lg">
                                <p>#1B576F</p>
                            </div>
                            <div className="px:-3 flex w-1/4 items-end justify-center bg-[#EDF6FF] pb-[24px] pt-[160px] text-sm text-[#16171B] md:justify-start md:px-[40px] md:text-lg">
                                <p>#EDF6FF</p>
                            </div>
                            <div className="px:-3 flex w-1/4 items-end justify-center bg-[#5D6C7C] pb-[24px] pt-[160px] text-sm text-white md:justify-start md:px-[40px] md:text-lg">
                                <p>#5D6C7C</p>
                            </div>
                            <div className="flex w-1/4 items-end justify-center rounded-r-2xl bg-[#F1F5F9] px-3 pb-[24px] pt-[160px] text-sm text-[#16171B] md:justify-start md:px-[40px] md:text-lg">
                                <p>#F1F5F9</p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-[48px] md:flex-row">
                            <div className="flex h-[406px] w-full flex-1 items-start justify-start rounded-2xl border-[2px] border-[#1B576F8A] pl-[44px] pt-[94px] md:w-[calc(50%-14px)] lg:w-fit xl:pr-[323px]">
                                <span className="flex flex-col gap-[46px]">
                                    <p className="text-[18px]">typography</p>
                                    <p className="text-[64px] font-semibold">Aeonik</p>
                                </span>
                            </div>
                            <div className="mt-10 flex h-[406px] w-full flex-col items-start justify-center gap-[45px] rounded-2xl bg-[#EEF1F9] px-[43px] py-[60px] md:w-[calc(50%-14px)] md:justify-between lg:max-w-[565px]">
                                <div className="flex h-fit w-full flex-col gap-[4px] md:max-w-[450px]">
                                    <p className="text-[18px]">alphabet</p>
                                    <p className="break-words text-[32px] font-semibold leading-[54px]">
                                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                    </p>
                                </div>
                                <div className="flex h-fit w-full flex-col gap-[4px] md:max-w-[450px]">
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

export default NeverBareVisual;
