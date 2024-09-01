import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

type Props = {};

const TheDesign = (props: Props) => {
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
            <div className="h-[1000px] bg-[#194DC9] bg-[url('/assets/images/caseLargeImage.png')] bg-bottom bg-no-repeat pt-[93px]">
                <div className="mx-auto flex h-full w-full max-w-[1200px]">
                    <div className="flex max-w-[600px] flex-col gap-3">
                        <h3 className="text-[48px] font-medium text-white">Graphic Design</h3>
                        <motion.p className="text-[18px] font-medium text-white" {...ANIMATE_PROPS({ delay: 0 })}>
                            Our specialists enriched Infinity with captivating illustrations beyond our Web 3
                            development work. These visuals facilitated the user experience and added uniqueness to the
                            app’s brand identity.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheDesign;
