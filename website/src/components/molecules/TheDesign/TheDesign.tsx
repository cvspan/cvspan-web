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
            <div className="h-fit bg-[#263959] px-5 pt-[93px]">
                <div className="mx-auto flex h-fit w-full max-w-[1200px] flex-col gap-10">
                    <div className="flex max-w-[600px] flex-col gap-3">
                        <h3 className="text-[48px] font-medium text-white">Mobile Version for Consumers</h3>
                        <motion.p className="text-[18px] font-medium text-white" {...ANIMATE_PROPS({ delay: 0 })}>
                            We followed an extensive process involving competitor research, UX strategy development, and
                            the creation of user flow, app flow, and wireframes for this particular user segment. Based
                            on the existing Mine’d application, our team delivered a seamless mobile experience tailored
                            to the unique needs of Consumers.
                        </motion.p>
                    </div>

                    <div className="flex w-full items-center justify-center">
                        <img src="/assets/images/screens/nb-mockup1.webp" alt="" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheDesign;
