import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

function LeeDeonVisual() {
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
                        <h3 className="text-[48px] font-medium text-[#16171B]">Design System</h3>
                        <motion.p className="text-[18px] text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            Considering that the platform should have a dark and light theme, we created the design
                            system to shift the ideas to components.
                        </motion.p>
                    </div>

                    <div className="flex flex-col flex-wrap gap-10 pb-[56px]">
                        <div className="flex w-full flex-row flex-wrap justify-center gap-4 md:gap-8">
                            <div className="flex h-[472px] w-full flex-col items-center justify-between rounded-xl border-[1px] border-[#0000004D] p-[30px] md:p-[42px] xl:w-[790px]">
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    {/* Type-scale specimen label, not a document heading. */}
                                    <p className="text-[36px]">Typography</p>
                                    <p className="text-[36px]">Inter</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <p className="text-[36px]">Heading H1</p>
                                    <p className="text-[16px]">Inter, 46px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h2 className="text-[24px]">Heading H2</h2>
                                    <p className="text-[16px]">Inter, 24px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h3 className="text-[16px]">Heading H3</h3>
                                    <p className="text-[16px]">Inter, 16px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h4 className="text-[14px]">Subheading</h4>
                                    <p className="text-[16px]">Inter, 14px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h5 className="text-[14px]">Body</h5>
                                    <p className="text-[16px]">Inter, 12px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h6 className="text-[14px]">Small Text</h6>
                                    <p className="text-[16px]">Inter, 10px</p>
                                </div>
                            </div>

                            <div className="flex h-[389px] w-[calc(50%-16px)] flex-col rounded-xl text-lg text-white lg:w-[calc(25%-24px)] xl:h-[472px] xl:w-[378px]">
                                <span className="flex h-[94.4px] w-full items-center justify-center rounded-t-xl bg-[#E6E8EA] px-6 text-[#000000]">
                                    <p className="text-[16px] font-medium lg:text-[32px]">#E6E8EA</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#ACAEB2] px-6">
                                    <p className="text-[16px] font-medium lg:text-[32px]">#ACAEB2</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#BABABA] px-6">
                                    <p className="text-[16px] font-medium lg:text-[32px]">#BABABA</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#8E8E8E] px-6">
                                    <p className="text-[16px] font-medium lg:text-[32px]">#8E8E8E</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center rounded-b-xl bg-[#1D2333] px-6">
                                    <p className="text-[16px] font-medium lg:text-[32px]">#1D2333</p>
                                </span>
                            </div>

                            <div className="flex h-[389px] w-[calc(50%-16px)] items-end justify-center rounded-xl bg-[#1D2333] px-6 pb-[24px] text-lg text-[#16171B] md:justify-start md:px-[40px] lg:w-[calc(25%-24px)] xl:w-[378px]">
                                <p className="text-[16px] font-medium text-white lg:text-[32px]">#1D2333</p>
                            </div>

                            <div className="flex h-[389px] w-[calc(50%-16px)] items-end justify-center rounded-xl border-[1px] border-[#0000004D] bg-[#FFFFFF] px-6 pb-[24px] text-lg text-black md:justify-start md:px-[40px] lg:w-[calc(25%-24px)] xl:w-[378px]">
                                <p className="text-[16px] font-medium lg:text-[32px]">#FFFFFF</p>
                            </div>

                            <div className="flex h-[389px] w-[calc(50%-16px)] items-end justify-center rounded-xl bg-[#2B64E2] px-6 pb-[24px] text-lg text-white md:justify-start md:px-[40px] lg:w-[calc(25%-24px)] lg:flex-1 xl:w-[378px]">
                                <p className="text-[16px] font-medium lg:text-[32px]">#2B64E2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeeDeonVisual;
