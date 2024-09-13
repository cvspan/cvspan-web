import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

type Props = {};

const TheProcess = (props: Props) => {
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
        <div className="bg-[#0A153E]">
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px] bg-bottom bg-no-repeat py-[120px]">
                <h3 className="w-[564px] text-[48px] font-medium leading-[56px] text-white">
                    The process of Infinity Product Design
                </h3>
                <img src="/assets/images/process.png" alt="" />
            </div>
        </div>
    );
};

export default TheProcess;
