import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

type Props = {};

// import FactCard from '@/components/molecules/FactsAndFigures/FactCard';
import ResultCard from './ResultCard';

const TheResult = (
    props: Props,
    {
        card1Number = 80,
        card2Number = 40,
        card3Number = 25,
    }: {
        title?: string;
        description?: string;
        card1Number?: number;
        card2Number?: number;
        card3Number?: number;
    },
) => {
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
        <div className="mx-auto flex h-full w-full max-w-[1200px] bg-white">
            <div className="flex flex-col gap-[60px] py-[120px]">
                <h3 className="w-full max-w-[564px] text-[48px] font-medium leading-[56px] text-[#1A1A1A]">
                    The Result
                </h3>
                <div className="flex w-full flex-row items-center gap-5">
                    <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0 })}>
                        <ResultCard
                            title={'Our Web 3.0 development and design services left most users satisfied.'}
                            rate={card1Number}
                            after="%"
                            description="User satisfaction rate"
                        />
                    </motion.div>

                    <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0 })}>
                        <ResultCard
                            title={'Arounda’s efforts helped Infinity retain a significant portion of users.'}
                            rate={card2Number}
                            after="%"
                            description="User retention rate"
                        />
                    </motion.div>

                    <motion.div {...ANIMATE_PROPS({ from: 'bottom', delay: 0 })}>
                        <ResultCard
                            title={'As seen in our crypto case study, a new mobile app is what users want the most.'}
                            rate={card3Number}
                            after="%"
                            description="Mobile users increase"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TheResult;
