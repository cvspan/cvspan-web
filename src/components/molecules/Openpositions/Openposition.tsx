'use client';
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Button from '@/components/molecules/Button';

import { ANIMATE_PROPS } from '@/helpers/motion';
import Link from 'next/link';
import useWindowSize from '@/hooks/general/useWindowSize';

const Openposition = () => {
    const [selected, setSelected] = useState<string>('All');

    const buttons: string[] = ['All', 'Design', 'Development', 'Marketing', 'Business Development', 'Product'];

    const jobListings = [
        {
            title: 'Project Manager',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: '/assets/icons/arrow-top-right-gray.svg',
        },
        {
            title: 'Senior React Developer',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: '/assets/icons/arrow-top-right-gray.svg',
        },
        {
            title: 'Technical Consultant',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: '/assets/icons/arrow-top-right-gray.svg',
        },
        {
            title: 'Lead Node.js Developer',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: '/assets/icons/arrow-top-right-gray.svg',
        },
        {
            title: 'Design Consultant',
            language: 'English',
            level: 'Senior',
            experience: '2 Years Experience',
            location: 'Nigeria or Remote',
            arrowSrc: '/assets/icons/arrow-top-right-gray.svg',
        },
    ];

    const { width } = useWindowSize();
    const smallDevice = width < 900;
    return (
        <>
            <section className="px-[16px] pt-[60px] lg:pt-[120px]">
                <div className="mx-auto mb-[32px] max-w-[1200px] border-b-[1px] border-b-[#A3A3A3] pb-[32px] lg:mb-[40px] lg:pb-[60px]">
                    <p className="font-eudoxus text-[16px] text-[#1A1A1A]">Filter by departments</p>

                    <div className="mt-[24px] flex w-full flex-wrap items-center justify-start gap-[12px]">
                        {buttons.map((title) => {
                            const active = selected === title;
                            return (
                                <Button
                                    title={title}
                                    key={title}
                                    height="56px"
                                    onClick={() => setSelected(title)}
                                    background={active ? 'dark' : 'white-with-border'}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="px-[16px] pb-[60px] lg:pb-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[32px] lg:flex-row">
                    <motion.div
                        {...ANIMATE_PROPS({ delay: 0, from: smallDevice ? 'bottom' : 'left' })}
                        className="flex h-auto w-full max-w-full flex-col lg:sticky lg:top-[100px] lg:h-[264px] lg:max-w-[300px]"
                    >
                        <p className="mb-[24px] font-eudoxus text-[34px] font-medium leading-[42px] text-[#1A1A1A]">
                            Open Positions
                        </p>

                        <p className="font-eudoxus text-[14px] leading-[24px] text-[#484848]">
                            Become a part of our growing team and contribute to building innovative digital solutions
                            for clients worldwide. We look forward to hearing from you and potentially welcoming you to
                            our team!
                        </p>
                    </motion.div>
                    <div className="ml-auto w-full lg:max-w-[800px]">
                        <div className="flex flex-col gap-[20px]">
                            {jobListings.map((job, index) => (
                                <Link className="cursor-pointer" href="/careers/specific-job" key={index}>
                                    <motion.div
                                        {...ANIMATE_PROPS({
                                            delay: 0.05 * index,
                                            from: smallDevice ? 'bottom' : 'right',
                                        })}
                                        whileHover="on_hover"
                                        className={`flex items-start justify-between pb-10 ${
                                            index !== 0 ? 'border-t-[1px] border-[#A3A3A3] pt-10' : ''
                                        }`}
                                    >
                                        <div className="">
                                            <h3 className="mb-[12px] font-eudoxus text-[24px] font-medium leading-[32px] lg:text-[48px] lg:leading-[56px]">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-[11px]">
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.language}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.level}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.experience}
                                                </p>
                                                <span className="mt-[-1px] h-[6px] w-[6px] rounded-full bg-[#1a1a1a]"></span>
                                                <p className="font-eudoxus text-[14px] font-normal leading-[26px] text-[#1a1a1a]">
                                                    {job.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative h-[22px] w-[22px]">
                                            <motion.img
                                                initial={{ x: 0, y: 0, opacity: 1 }}
                                                variants={{
                                                    on_hover: {
                                                        x: 20,
                                                        y: -30,
                                                        opacity: 0,
                                                        transition: { duration: 0.2 },
                                                    },
                                                }}
                                                src={'/assets/icons/arrow-top-right-gray-slim.svg'}
                                                alt="arrow"
                                                className="absolute h-[22px] w-[22px]"
                                            />

                                            <motion.img
                                                initial={{ x: -20, y: 30, opacity: 0 }}
                                                variants={{
                                                    on_hover: { x: 0, y: 0, opacity: 1, transition: { duration: 0.2 } },
                                                }}
                                                src={'/assets/icons/arrow-top-right-gray-slim.svg'}
                                                alt="arrow"
                                                className="absolute h-[22px] w-[22px]"
                                            />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Openposition;
