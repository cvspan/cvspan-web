import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

function CoastalVisual() {
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
        <div className="flex h-fit items-center justify-center bg-white bg-bottom bg-no-repeat pb-[56px] pt-[120px]">
            <div className="flex h-full w-full flex-col gap-[60px]">
                <div className="flex h-full w-full flex-col gap-[60px] px-5">
                    <div className="mx-auto flex w-full max-w-[1200px]">
                        <div className="flex max-w-[655px] flex-col gap-5">
                            <h3 className="text-[48px] font-medium text-[#16171B]">Visual Style Guide Creation</h3>
                            <motion.p className="text-[18px] text-[#484848]" {...ANIMATE_PROPS({ delay: 0 })}>
                                As part of our project with Gradwork, we created a visual style guide that established a
                                consistent visual language for the brand. It includes a carefully selected color
                                palette, typography, and other visual elements that help to create a distinct and
                                memorable brand identity.
                            </motion.p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-start overflow-x-auto lg:justify-center lg:overflow-hidden">
                    <div className="w-screen max-w-[1400px]">
                        <div className="flex items-center justify-start bg-white pl-5 md:w-full lg:ml-auto lg:w-[1350px] xl:ml-auto xl:justify-end 2xl:pl-0">
                            <img
                                src="/assets/images/screens/coastal-svg-visual.svg"
                                alt=""
                                className="h-[350px] w-fit max-w-none md:h-fit md:max-w-full lg:min-w-[1000px] xl:max-w-[1280px]"
                            />
                        </div>
                    </div>
                </div>

                {/* <div className="ml-[80px] flex h-fit flex-row gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex h-[208px] flex-col items-start justify-between rounded-2xl border-[1px] border-[#0000004D] bg-white py-[30px] pl-[30px] pr-[196px]">
                            <p className="text-lg font-semibold">Heading Font</p>
                            <div className="w-[290px] text-left">
                                <p className="mt-2 text-sm">
                                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                </p>
                                <p className="mt-1 text-sm font-bold">0123456789!@#$%^&*()_+</p>
                            </div>
                        </div>

                        <div className="flex h-[208px] flex-col items-start justify-between rounded-2xl bg-violet-100 py-[30px] pl-[30px]">
                            <div className="flex flex-col gap-2 text-left">
                                <p className="text-sm">Regular</p>
                                <p className="text-sm font-medium">Medium</p>
                                <p className="text-sm font-semibold">Semi Bold</p>
                            </div>
                            <p className="text-3xl font-bold">Lexend</p>
                        </div>
                    </div>

                    <div className="flex h-[440px] w-[250px] items-end justify-start rounded-2xl bg-[#3D3E70] pb-[30px] pl-[30px] text-white">
                        <div className="flex flex-col gap-4 text-[14px]">
                            <p>#3D3E70</p>
                            <p>American Blue</p>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-6">
                        <div className="items-START flex h-[208px] w-full items-end justify-start rounded-l-2xl bg-[#FB774F] py-[30px] pl-[30px] text-white">
                            <div className="flex flex-col gap-4 text-[14px] text-black">
                                <p>#FB774F</p>
                                <p>Coral</p>
                            </div>
                        </div>

                        <div className="flex flex-row gap-6">
                            <div className="flex h-[208px] w-[250px] items-end justify-start rounded-2xl bg-[#1F1F1F] p-6 text-white">
                                <div className="flex flex-col gap-4 text-[14px]">
                                    <p>#1F1F1F</p>
                                    <p>Eerie Black</p>
                                </div>
                            </div>

                            <div className="flex h-[208px] flex-1 items-end justify-start rounded-l-2xl border-[1px] border-[#0000004D] bg-white p-6">
                                <div className="flex flex-col gap-4 text-[14px] text-black">
                                    <p>#FFFFFF</p>
                                    <p>White</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default CoastalVisual;
