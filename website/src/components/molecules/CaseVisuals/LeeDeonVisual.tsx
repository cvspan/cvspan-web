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
            <div className="h-fit bg-white bg-bottom bg-no-repeat px-5 py-[120px]">
                <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px]">
                    <div className="flex max-w-[655px] flex-col gap-5">
                        <h3 className="text-[48px] font-medium text-[#16171B]">Design System</h3>
                        <motion.p className="text-[18px] text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                            Considering that the platform should have a dark and light theme, we created the design
                            system to shift the ideas to components.
                        </motion.p>
                    </div>

                    <div className="flex flex-col gap-8 overflow-x-auto">
                        <img
                            src="/assets/images/screens/designSystem.svg"
                            alt=""
                            className="w-[150%] max-w-none md:w-full"
                        />
                        <img
                            src="/assets/images/screens/designSystem2.svg"
                            alt=""
                            className="w-[150%] max-w-none md:w-full"
                        />
                    </div>

                    {/* <div className="flex flex-col flex-wrap gap-10 pb-[56px]">
                        <div className="flex flex-row justify-between gap-8">
                            <div className="flex h-[478px] max-w-[481px] items-start justify-start rounded-xl bg-[#D3C8FF] py-[30px] pl-[44px] pr-[323px]">
                                <span className="flex h-full flex-col justify-between py-[10px]">
                                    <p className="font-serif text-[40px] font-semibold">Typography</p>
                                    <p className="font-serif text-[40px] font-semibold">Aeonik</p>
                                </span>
                            </div>

                            <div className="flex h-[478px] w-full flex-1 flex-col items-center justify-between rounded-xl border-[3px] border-[#D1D1FF] p-[42px]">
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[45px]">
                                    <p className="text-[40px] font-medium">Heading H1</p>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[150px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[35px]">
                                    <h2 className="text-[32px] font-medium">Heading H2</h2>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[180px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[30px]">
                                    <h3 className="text-[24px] font-medium">Heading H3</h3>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[230px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[20px]">
                                    <h4 className="text-[18px] font-medium">Subheading</h4>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[255px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[13px]">
                                    <h5 className="text-[14px] font-medium">Body</h5>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[320px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-fit w-full flex-row items-end justify-between leading-[13px]">
                                    <h6 className="text-[12px] font-medium">Small Text</h6>
                                    <div className="flex flex-row items-end justify-end gap-1 leading-[13px]">
                                        <hr className="w-[300px] border-[1px] border-[#B1B2B2] border-opacity-[0.2]" />{' '}
                                        <p className="text-[16px] font-semibold">
                                            Aeonik Bold, <span className="text-[#86869A]">Size:</span>
                                            42px/54px
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-row justify-between">
                            <div className="flex h-[389px] w-[276px] items-end justify-start rounded-xl bg-[#311A91] pb-[24px] pl-[40px] text-lg text-white">
                                <p>#311A91</p>
                            </div>
                            <div className="flex h-[389px] w-[276px] items-end justify-start rounded-xl bg-[#F5F5F5] pb-[24px] pl-[40px] text-lg text-[#16171B]">
                                <p>#F5F5F5</p>
                            </div>
                            <div className="flex h-[389px] w-[276px] flex-col rounded-xl pb-[24px] text-lg text-white">
                                <span className="h-[43px] w-full rounded-t-xl bg-[#f5f5f5]"> </span>
                                <span className="h-[43px] w-full bg-[#D2D3D3]"> </span>
                                <span className="h-[43px] w-full bg-[#B1B2B2]"> </span>
                                <span className="h-[43px] w-full bg-[#9173E1]"> </span>
                                <span className="h-[43px] w-full bg-[#6745C2]"> </span>
                                <span className="h-[43px] w-full bg-[#5B36BD]"> </span>
                                <span className="h-[43px] w-full bg-[#3C22A7]"> </span>

                                <span className="flex h-[86px] w-full items-end justify-start rounded-b-xl bg-[#311A91] pb-[24px] pl-[40px]">
                                    <p>#311A91</p>
                                </span>
                            </div>
                            <div className="flex h-[389px] w-[276px] items-end justify-start rounded-xl bg-[#6745C2] pb-[24px] pl-[40px] text-lg text-white">
                                <p>#6745C2</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default LeeDeonVisual;
