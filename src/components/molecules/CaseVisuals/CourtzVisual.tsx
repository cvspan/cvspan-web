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
                        <motion.p className="text-[18px] font-medium text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            Considering that the platform should have a dark and light theme, we created the design
                            system to shift the ideas to components.
                        </motion.p>
                    </div>

                    <div className="flex flex-col flex-wrap gap-10 pb-[56px]">
                        <div className="flex w-full flex-row flex-wrap justify-between gap-8">
                            <div className="flex h-[472px] w-[calc(68%-32px)] flex-col items-center justify-between rounded-2xl border-[3px] border-[#D1D1FF] p-[42px]">
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h1 className="text-[36px]">Typography</h1>
                                    <p className="text-[36px]">Inter</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h1 className="text-[36px]">Heading H1</h1>
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
                                    <h5 className="text-[12px]">Body</h5>
                                    <p className="text-[16px]">Inter, 12px</p>
                                </div>
                                <div className="flex h-fit w-full flex-row items-center justify-between font-medium">
                                    <h6 className="text-[10px]">Small Text</h6>
                                    <p className="text-[16px]">Inter, 10px</p>
                                </div>
                            </div>

                            <div className="flex h-[472px] w-[calc(33.33%-32px)] flex-col rounded-2xl text-lg text-white">
                                <span className="flex h-[94.4px] w-full items-center justify-center rounded-t-2xl bg-[#E6E8EA] text-[#000000]">
                                    <p className="text-[32px] font-medium">#E6E8EA</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#ACAEB2]">
                                    <p className="text-[32px] font-medium">#ACAEB2</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#BABABA]">
                                    <p className="text-[32px] font-medium">#BABABA</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center bg-[#8E8E8E]">
                                    <p className="text-[32px] font-medium">#8E8E8E</p>
                                </span>
                                <span className="flex h-[94.4px] w-full items-center justify-center rounded-b-2xl bg-[#1D2333]">
                                    <p className="text-[32px] font-medium">#1D2333</p>
                                </span>
                            </div>

                            <div className="flex h-[389px] w-[calc(33.33%-32px)] items-end justify-start rounded-2xl bg-[#1D2333] pb-[24px] pl-[40px] text-lg text-[#16171B]">
                                <p className="text-[32px] font-medium text-white">#1D2333</p>
                            </div>
                            <div className="flex h-[389px] w-[calc(33.33%-32px)] items-end justify-start rounded-2xl border-[1px] border-[#0000004D] bg-[#FFFFFF] pb-[24px] pl-[40px] text-lg text-[#16171B]">
                                <p className="text-[32px] font-medium">#FFFFFF</p>
                            </div>
                            <div className="flex h-[389px] w-[calc(33.33%-32px)] items-end justify-start rounded-2xl bg-[#2B64E2] pb-[24px] pl-[40px] text-lg text-white">
                                <p className="text-[32px] font-medium">#2B64E2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeeDeonVisual;
