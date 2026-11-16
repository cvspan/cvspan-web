import { motion } from 'framer-motion';
import { ANIMATE_PROPS } from '@/helpers/motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import ResultCard from './ResultCard';
import { DEFAULT_RESULTS, ResultItem } from './data';

type Props = {
    /** Three outcome cards for this case study. Falls back to generic copy. */
    results?: ResultItem[];
    heading?: string;
};

// Note: this previously declared a second function parameter for the card
// numbers. React only ever passes one props object, so those values were
// always undefined and every case study rendered the same hardcoded results.
const TheResult = ({ results = DEFAULT_RESULTS, heading = 'The Result' }: Props) => {
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
        <div className="flex h-full w-full bg-white px-5">
            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[60px] py-[120px]">
                <h3 className="w-full max-w-[564px] text-[48px] font-medium leading-[56px] text-[#1A1A1A]">
                    {heading}
                </h3>
                <div className="flex w-full flex-col flex-wrap items-center gap-5 md:flex-row md:flex-nowrap">
                    {results.map((result, index) => (
                        <motion.div
                            key={`${result.description}-${index}`}
                            {...ANIMATE_PROPS({ from: 'bottom', delay: 0 })}
                            className="w-full md:w-fit"
                        >
                            <ResultCard
                                title={result.title}
                                rate={result.rate}
                                before={result.before}
                                after={result.after}
                                description={result.description}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TheResult;
