import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useWindowSize } from '@react-hook/window-size';
import { cn } from '@/lib/utils';

type IProcess = {
    title?: string;
    main?: boolean;
    hasCVSpanIcon?: boolean;
};

const TheProcess = () => {
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

    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const aa = useTransform(scrollYProgress, [0, 1], [1, 100]);

    const shiftX = useSpring(aa, {
        stiffness: 100,
        damping: 10,
        mass: 0.1,
    });

    const [ev, setev] = React.useState(0);
    useMotionValueEvent(shiftX, 'change', (latest) => {
        setev(latest);
    });

    const [windowWidth] = useWindowSize();
    const stopAnimation = windowWidth < 1262;

    const processTitles = [
        { hasCVSpanIcon: false, main: false, title: 'Research' },
        { hasCVSpanIcon: false, main: false, title: 'User Flow' },
        { hasCVSpanIcon: false, main: false, title: 'Wireframes' },
        { hasCVSpanIcon: true, main: true, title: 'UI Design' },
        { hasCVSpanIcon: false, main: false, title: 'Development' },
    ];

    return (
        <div className="bg-[#0A153E] px-5" ref={ref}>
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-[60px] bg-bottom bg-no-repeat py-[120px]">
                <h3 className="max-w-[564px] text-[48px] font-medium leading-[56px] text-white">
                    The process of Infinity Product Design
                </h3>
                <div>
                    <div className="flex flex-col gap-[17px]">
                        {processTitles.map((item, index) => (
                            <Process
                                key={index}
                                ev={ev}
                                index={index}
                                stopAnimation={stopAnimation}
                                windowWidth={windowWidth}
                                item={item}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheProcess;

const Process = ({
    item,
    stopAnimation,
    windowWidth,
    index,
    ev,
}: {
    item?: IProcess;
    stopAnimation?: boolean;
    windowWidth: number;
    index: number;
    ev: number;
}) => {
    const maxEv = ev > 51.96267605633803 ? 51.96267605633803 : ev;

    const v = index * 4.4;
    const x = stopAnimation ? (windowWidth < 500 ? windowWidth / 5 - 50 : windowWidth / 5 - 40) * index : maxEv * v;

    return (
        <div className="relative flex">
            <motion.div
                viewport={{ once: true }}
                className={cn(
                    'relative flex h-[56px] w-full max-w-[220px] items-center justify-center rounded-full border-[0.5px] text-center text-2xl min-[1200px]:max-w-[287px]',
                    item?.main
                        ? 'border-[#ffffff] bg-white text-[#000000]'
                        : 'border-[#303C62] bg-[#303C62] text-white',
                )}
                style={{
                    x,
                }}
            >
                <span>{item?.title}</span>

                {item?.hasCVSpanIcon ? (
                    <div className="absolute left-0 top-[calc(-60px-17px)] flex w-full items-center justify-center max-[900px]:hidden">
                        <img src="/assets/icons/logo-blue-rounded.svg" className="h-[60px] w-[60px]" />
                    </div>
                ) : null}
            </motion.div>
        </div>
    );
};
